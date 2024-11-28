pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                // Checkout code from GitHub
                git branch: 'main', url: 'https://github.com/arsalmkhawaja/FYP-ConnectPro.git'
            }
        }

        stage('Install Dependencies - Backend') {
            steps {
                dir('backend') {
                    // Install backend dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Install Dependencies - Frontend') {
            steps {
                dir('.') {
                    // Install frontend dependencies
                    sh 'npm install'
                }
            }
        }

        stage('Start Backend') {
            steps {
                dir('backend') {
                    // Start the backend (Node.js/Express)
                    sh 'npm start &'
                }
            }
        }

        stage('Start Frontend') {
            steps {
                dir('.') {
                    // Start the frontend (React)
                    sh 'npm start &'
                }
            }
        }
    }

    post {
        always {
            // Clean up after the build, e.g., delete workspace
            cleanWs()
        }

        success {
            echo 'Frontend and Backend started successfully!'
        }

        failure {
            echo 'There was an issue starting the frontend or backend.'
        }
    }
}
