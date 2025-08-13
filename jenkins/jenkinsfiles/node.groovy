pipeline {
    agent {
        kubernetes {
            yaml readTrusted('jenkins/pod-templates/node.yaml')
            defaultContainer "shell"
        }
    }

    options {
        buildDiscarder logRotator(numToKeepStr: '10')
        timestamps()
    }

    stages {
        stage('Checkout') {
            steps {
                container('shell') {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: '*/main']],
                        doGenerateSubmoduleConfigurations: false,
                        extensions: [],
                        userRemoteConfigs: [[url: 'https://github.com/Sealights-btq/ian-btq.git']]
                    ])
                }
            }
        }

        stage('Run Node Script') {
            steps {
                container('shell') {
                    sh """
                        echo 'Node version:'
                        node -v
                        echo 'NPM version:'
                        npm -v
                        node scripts/update-product-names.js src/productcatalogservice/products.json
                    """
                }
            }
        }
stage('Commit & Push Changes') {
    steps {
        container('shell') {
            sh """
                git config --global --add safe.directory /home/jenkins/agent/workspace/node-script
                git config --global user.email "jenkins@yourdomain.com"
                git config --global user.name "Jenkins CI"
                git add src/productcatalogservice/products.json
                git diff --cached --quiet || git commit -m "Automated product name update from Jenkins"
                
                # Push current HEAD to main branch
                git push origin HEAD:main
            """
        }
    }
}


    }
}
