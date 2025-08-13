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

                        # Run the update script with explicit file path
                        node scripts/update-product-names.js src/productcatalogservice/products.json
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
                        git add src/productcatalogservice/products.json
                        git commit -m "Automated product name update from Jenkins" || echo "No changes to commit"
                        git push origin main
                    """
                }
            }
        }
    }
}
