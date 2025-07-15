pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
    }
    stages {
        stage('Clean Workspace') {
            steps {
                cleanWs()
            }
        }
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sharan12221/HLF_Auth_Backend.git'
            }
        }
        stage('Install Node & PM2') {
            steps {
                sh '''
                    if ! command -v node > /dev/null; then
                        curl -sL https://deb.nodesource.com/setup_18.x | bash -
                        sudo apt-get install -y nodejs
                    fi
                    if ! command -v pm2 > /dev/null; then
                        npm install -g pm2
                    fi
                '''
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Test') {
            steps {
                // Uncomment if you have tests
                // sh 'npm test'
            }
        }
        stage('Deploy') {
            steps {
                sh 'pm2 restart my-express-app || pm2 start src/server.js --name my-express-app'
            }
            // Remote Deploy Example (Uncomment and configure as needed)
            // steps {
            //     withCredentials([sshUserPrivateKey(credentialsId: 'your-jenkins-ssh-key-id', keyFileVariable: 'SSH_KEY')]) {
            //         sh '''
            //         ssh -i $SSH_KEY user@your-server "
            //             cd /path/to/app &&
            //             git pull &&
            //             npm install &&
            //             pm2 restart my-express-app || pm2 start src/server.js --name my-express-app
            //         "
            //         '''
            //     }
            // }
        }
    }
}
