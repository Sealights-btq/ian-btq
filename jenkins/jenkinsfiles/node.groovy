pipeline {
  agent {
    kubernetes {
      yaml readTrusted('jenkins/pod-templates/cypress.yaml')
      defaultContainer "shell"
    }
  }

    options{
        buildDiscarder logRotator(numToKeepStr: '10')
        timestamps()
    }

    stages {
        stage('Run scripts') {
            steps{
                script{
                  sh """
                  node -v
                  npm -v
                  """
                }
            }
        }
    }
}
