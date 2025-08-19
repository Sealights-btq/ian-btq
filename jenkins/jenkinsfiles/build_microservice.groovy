pipeline {
  agent {
    kubernetes {
      yaml readTrusted('jenkins/pod-templates/BTQ_BUILD_shell_kaniko_pod.yaml')
      defaultContainer "shell"
    }
  }

  options {
    buildDiscarder logRotator(numToKeepStr: '100')
  }

  parameters {
    string(name: 'TAG', defaultValue: '1.2.2', description: 'latest tag')
    string(name: 'BRANCH', defaultValue: 'main', description: 'default branch')
    choice(name: 'SERVICE', choices: [
      "adservice","cartservice","checkoutservice",
      "currencyservice","emailservice","frontend",
      "paymentservice","productcatalogservice",
      "recommendationservice","shippingservice",
      "sealightsservice"
    ], description: 'Service name to build')
    string(name: 'BUILD_NAME', defaultValue: 'none', description: 'build name')
  }

  environment {
    ECR_FULL_NAME = "btq-${params.SERVICE}"
    ECR_URI = "474620256508.dkr.ecr.eu-west-1.amazonaws.com/${env.ECR_FULL_NAME}"
    TAG = "ian_${params.TAG}"
    GITHUB_REPO_URL = "https://github.com/Sealights-btq/ian-btq" // derived from git URL without .git
  }

  stages {
    stage('Init') {
      steps {
        script {
          withCredentials([
            aws(credentialsId: 'aws-ecr-creds', accessKeyVariable: 'AWS_ACCESS_KEY_ID', secretKeyVariable: 'AWS_SECRET_ACCESS_KEY'),
            string(credentialsId: 'sealights-token', variable: 'SL_TOKEN')
          ]) {
            // Clone the repository with the specified branch.
            git branch: params.BRANCH, url: 'https://github.com/Sealights-btq/ian-btq.git'
            currentBuild.displayName = "${SERVICE}-${BUILD_NAME}"

            stage("Build Docker ${params.SERVICE} Image") {
              container(name: 'kaniko') {
                script {
                  def CONTEXT = params.SERVICE == "cartservice" ? "./src/${params.SERVICE}/src" : "./src/${params.SERVICE}"
                  def DP = "${CONTEXT}/Dockerfile"
                  def D = "${env.ECR_URI}:${env.TAG}"
                  def BRANCH = params.BRANCH
                  def BUILD_NAME = "${params.BUILD_NAME}"
                  def SL_TOKEN = env.SL_TOKEN

                  // Copy .git into the service context so the scanner can see repo metadata
                  sh """
                    echo "Checking .git before copy..."
                    ls -la .git || echo ".git not found at repo root!"

                    echo "Copying .git into ${CONTEXT}"
                    cp -r .git ${CONTEXT}/.git

                    echo "Confirming .git is inside context:"
                    ls -la ${CONTEXT}/.git || echo ".git copy failed!"
                  """

                  // Run Kaniko build with .git included
                  sh """
                      /kaniko/executor \
                      --context ${CONTEXT} \
                      --dockerfile ${DP} \
                      --destination ${D} \
                      --build-arg BRANCH=${BRANCH} \
                      --build-arg BUILD_NAME=${BUILD_NAME} \
                      --build-arg SEALIGHTS_TOKEN=${SL_TOKEN} \
                      --build-arg SL_SCM_PROVIDER=github \
                      --build-arg SL_SCM_BASEURL=${GITHUB_REPO_URL}
                  """
                }
              }
            }
          }
        }
      }
    }
  }
}
