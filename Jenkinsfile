pipeline {
    agent any
    environment {
        JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        MONGO_URI = 'mongodb://localhost:27017/connectpro'
    }
    stages {
      stage('Clone Repository') {
            steps {
                git 'https://github.com/arsalmkhawaja/FYP-ConnectPro.git'
            }
        }
      stage('Build image'){
        agent {
          docker { image 'node:latest'}
        }
      }
      stage('Install Client Dependencies') {
        steps {
          // Change to the client directory and install dependencies
          dir('./') {
            sh 'npm install'
          }
        }
      }

      stage('Build Client') {
        steps {
          // Change to the client directory and run the build command
          dir('./') {
            sh 'npm start'
          }
        }
      }

      stage('Install Backend Dependencies') {
        steps {
          // Change to the backend directory and install dependencies
          dir('./backend') {
            sh 'npm install'
            sh 'export MONGODB_URI=$MONGODB_URI'
            sh 'export TOKEN_KEY=$TOKEN_KEY'
          }
        }
      }
      stage('Build Server') {
        steps {
          // Change to the client directory and run the build command
          dir('./backend') {
            sh 'npm start'
          }
        }
      }
    }

    post {
        success {
      echo 'Pipeline completed successfully!'
        }
        failure {
      echo 'Pipeline failed.'
        }
    }
}
