// Jenkinsfile
pipeline {
    // MODIFIED LINE: Specify the exact agent to use for this pipeline
    agent { label 'vinod' }

    environment {
        // Define environment variables
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials') // The ID you set in Jenkins
        DOCKER_IMAGE_NAME = "your-dockerhub-username/broker-free" // CHANGE THIS
        DOCKER_IMAGE_TAG = "build-${BUILD_NUMBER}" // Using build number for unique tags
    }

    stages {
        stage('1. Checkout Code') {
            steps {
                echo 'Checking out code from GitHub...'
                git branch: 'main', url: 'https://github.com/DeshmukhRuturaj/BROKER-FREE.git'
            }
        }

        stage('2. Install Dependencies & Run Tests') {
            steps {
                echo 'Installing npm dependencies and running tests...'
                // The 'vinod' agent must have Docker installed for this to work
                docker.image('node:18-alpine').inside {
                    sh 'npm install'
                    // If you have a test script, uncomment the line below
                    // sh 'npm test'
                }
            }
        }

        stage('3. Build Docker Image') {
            steps {
                echo "Building Docker image: ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                // The '.' refers to the current directory where the Dockerfile is
                sh "docker build -t ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ."
                // Also tag it as 'latest' for convenience
                sh "docker tag ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG} ${DOCKER_IMAGE_NAME}:latest"
            }
        }

        stage('4. Push Docker Image to Docker Hub') {
            steps {
                echo "Logging into Docker Hub and pushing images..."
                // Use the credentials we defined in the environment block
                // The withCredentials block is a more secure way to handle secrets
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', passwordVariable: 'DOCKER_PASSWORD', usernameVariable: 'DOCKER_USERNAME')]) {
                    sh "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD}"
                    sh "docker push ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    sh "docker push ${DOCKER_IMAGE_NAME}:latest"
                }
            }
        }

        stage('5. Cleanup') {
            // This 'post' block will run regardless of the build's success or failure
            post {
                always {
                    echo 'Cleaning up local Docker images...'
                    // This is good practice to avoid filling up the agent's disk
                    sh "docker rmi ${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_TAG}"
                    sh "docker rmi ${DOCKER_IMAGE_NAME}:latest"
                    sh "docker logout"
                }
            }
        }
    }
}
