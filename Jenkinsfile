pipeline {
    agent any
    tools { nodejs 'Node24' }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Instalar dependencias') {
            steps {
                dir('backend') { sh 'npm ci' }
            }
        }
        stage('Pruebas') {
            steps {
                dir('backend') { sh 'npm test' }
            }
        }
        stage('Analisis SonarQube') {
            steps {
                script {
                    def scannerHome = tool 'SonarScanner'
                    withSonarQubeEnv('SonarQube') {
                        sh "${scannerHome}/bin/sonar-scanner"
                    }
                }
            }
        }
    }
    post {
        success {
            slackSend(channel: '#ci-jenkins', color: 'good', message: "Build exitoso: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${env.BUILD_URL})")
        }
        failure {
            slackSend(channel: '#ci-jenkins', color: 'danger', message: "Build fallido: ${env.JOB_NAME} #${env.BUILD_NUMBER} (${env.BUILD_URL})")
        }
    }
}