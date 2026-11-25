pipeline {
    agent any
    tools { nodejs 'Node24' }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Instalar dependencias') {
            steps {
                dir('backend') { bat 'npm ci' }
            }
        }
        stage('Pruebas') {
            steps {
                dir('backend') { bat 'npm test' }
            }
        }
        stage('Analisis SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        bat "\"${scannerHome}\\bin\\sonar-scanner.bat\""
                    }
                }
            }
        }
    }
    post {
        success {
            slackSend(color: 'good', message: "Build exitoso: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${env.BUILD_URL})")
        }
        failure {
            slackSend(color: 'danger', message: "Build fallido: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${env.BUILD_URL})")
        }
    }
}