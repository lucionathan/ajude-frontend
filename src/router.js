const URL_BASE = "http://localhost:8000";
export class Router{

    constructor(){

    }
    navigateToLogin(){
        location.replace(`${URL_BASE}/#/login`)
        history.pushState({url:"#/login"}, "", "#/login")
    }

    navigateToRegister(){
        location.replace(`${URL_BASE}/#/register`)
        history.pushState({url:"#/register"}, "", "#/register")
    }

    navigateToDashBoard(){
        location.replace(`${URL_BASE}/#/dash`)
        history.pushState({url:"#/dash"}, "", "#/dash")
    }

    navigateToLoggin(){
        location.replace(`${URL_BASE}/#/loading`)
        history.pushState({url:"#/loading"}, "", "#/loading")
    }
}