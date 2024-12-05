pipeline {
    agent any

    // Define tools to be installed
    tools {
        // Install Node.js tool with a specific version
        nodejs 'node:latest'
    }

    environment {
        JWT_SECRET = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
        MONGO_URI = 'mongodb://localhost:27017/connectpro'
    }
    stages {

        stage('Install Client Dependencies') {
      steps {
        // Change to the client directory and install dependencies
        dir('client') {
          sh 'npm install'
        }
      }
        }

        stage('Build Client') {
      steps {
        // Change to the client directory and run the build command
        dir('client') {
          sh 'npm run build'
        }
      }
        }

        stage('Install Backend Dependencies') {
      steps {
        // Change to the backend directory and install dependencies
        dir('api') {
          sh 'npm install'
          sh 'export MONGODB_URI=$MONGODB_URI'
          sh 'export TOKEN_KEY=$TOKEN_KEY'
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
