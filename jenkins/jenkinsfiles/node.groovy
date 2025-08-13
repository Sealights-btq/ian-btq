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
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    doGenerateSubmoduleConfigurations: false,
                    extensions: [],
                    userRemoteConfigs: [[url: 'https://github.com/Sealights-btq/ian-btq.git']]
                ])
            }
        }

        stage('Run Node Script') {
            steps {
                script {
                    sh """
                        echo 'Node version:'
                        node -v
                        echo 'NPM version:'
                        npm -v

                        # Run the update script
                        node scripts/update-product-names.js
                    """
                }
            }
        }

        stage('Commit & Push Changes') {
            steps {
                script {
                    sh """
                        git config user.email "jenkins@yourdomain.com"
                        git config user.name "Jenkins CI"
                        git add .
                        git commit -m "Automated update from Jenkins"
                        git push origin main
                    """
                }
            }
        }
    }
}
