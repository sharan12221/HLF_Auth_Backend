pipeline {
    agent any
    environment {
        NODE_ENV = 'production'
    }
    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/sharan12221/HLF_Auth_Backend.git'
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        stage('Deploy') {
            steps {
                sh 'pm2 restart all || pm2 start src/server.js --name my-express-app'
            }
        }
        stage('Deploy') {
            steps {
                sh 'ssh user@your-server "cd /path/to/app && git pull && npm install && pm2 restart all"'
            }
        }
    }
}
