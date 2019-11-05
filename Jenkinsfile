pipeline {

  environment {
    PROJECT = "th-eliasamdualem"
    APP_NAME = "gebeya-mood"
    FE_SVC_NAME = "api-service"
    CLUSTER = "${APP_NAME}-c1"
    CLUSTER_ZONE = "us-central1-a"
    IMAGE_TAG = "gcr.io/${PROJECT}/${APP_NAME}:${env.BRANCH_NAME}.${env.BUILD_NUMBER}"
    JENKINS_CRED = "${PROJECT}"
    PRODUCTION_NAMESPACE = 'production'
    DEVELOPMENT_NAMESPACE = 'development'
  }

  agent {
        kubernetes {
          label 'api-service'
          defaultContainer 'jnlp'
          yaml """
                apiVersion: v1
                kind: Pod
                metadata:
                labels:
                  component: ci
                spec:
                  # Use service account that can deploy to all namespaces
                  serviceAccountName: cd-jenkins
                  containers:
                  - name: gcloud
                    image: gcr.io/cloud-builders/gcloud
                    command:
                    - cat
                    tty: true
                  - name: kubectl
                    image: gcr.io/cloud-builders/kubectl
                    command:
                    - cat
                    tty: true
                """
        }
  }

   stages {
        stage('Build and push image with Container Builder') {
          steps {
            container('gcloud') {
              sh "PYTHONUNBUFFERED=1 gcloud builds submit -t ${IMAGE_TAG} ."
            }
          }
        }

        stage('Deploy Production') {
          when { branch 'master' }
          steps{
            container('kubectl') {
            // Change deployed image in canary to the one we just built
              sh("sed -i.bak 's#gcr.io/cloud-solutions-images/gceme:1.0.0#${IMAGE_TAG}#' ./k8s/deployment/*.yaml")

              step([$class: 'KubernetesEngineBuilder',namespace: "${env.PRODUCTION_NAMESPACE}", projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/services/api-production.yaml', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
              step([$class: 'KubernetesEngineBuilder',namespace: "${env.PRODUCTION_NAMESPACE}", projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/deployment/api-development.yaml', credentialsId: env.JENKINS_CRED, verifyDeployments: true])

              sh("kubectl apply -f ./k8s/ingress/api-production.yaml -n ${env.PRODUCTION_NAMESPACE}")
              sh("echo http://`kubectl --namespace=production get service/${FE_SVC_NAME} -o jsonpath='{.status.loadBalancer.ingress[0].ip}'` > ${FE_SVC_NAME}")
            }
          }
        }

        stage('Deploy Development') {
          when { branch 'develop' }
          steps {
            container('kubectl') {
              // Create namespace if it doesn't exist
              sh("kubectl get ns ${env.DEVELOPMENT_NAMESPACE} || kubectl create ns ${env.BRANCH_NAME}")

              // Don't use public load balancing for development branches
              sh("sed -i.bak 's#gcr.io/cloud-solutions-images/gceme:1.0.0#${IMAGE_TAG}#' ./k8s/deployment/*.yaml")

              step([$class: 'KubernetesEngineBuilder',namespace: "${env.DEVELOPMENT_NAMESPACE}", projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/services/api-development.yaml', credentialsId: env.JENKINS_CRED, verifyDeployments: false])
              step([$class: 'KubernetesEngineBuilder',namespace: "${env.DEVELOPMENT_NAMESPACE}", projectId: env.PROJECT, clusterName: env.CLUSTER, zone: env.CLUSTER_ZONE, manifestPattern: 'k8s/deployment/api-development.yaml', credentialsId: env.JENKINS_CRED, verifyDeployments: true])

              sh("kubectl apply -f ./k8s/ingress/api-development.yaml -n ${env.DEVELOPMENT_NAMESPACE}")

              echo 'To access your environment run `kubectl proxy`'
              echo "Then access your service via http://localhost:8001/api/v1/proxy/namespaces/${env.BRANCH_NAME}/services/${FE_SVC_NAME}:80/"
            }
          }
        }
    }
}