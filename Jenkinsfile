node {
    def app

    stage('Checkout') {
        checkout([$class: 'GitSCM', branches: [[name: '*/master']], doGenerateSubmoduleConfigurations: false, extensions: [], submoduleCfg: [], userRemoteConfigs: [[credentialsId: '8e74bd8b-049f-4320-b077-2df0e12373a0', url: 'https://github.com/sunil-ramesh/node_form.git']]])
    }

    stage('Build image') {
        /* This builds the actual image; synonymous to
         * docker build on the command line */

        app = docker.build("getintodevops/hellonode")
    }

}
