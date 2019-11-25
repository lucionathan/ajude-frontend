const URL_BASE = "https://ajude-psoft.herokuapp.com";
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
}