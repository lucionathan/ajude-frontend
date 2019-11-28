import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;
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

    navigateToCampaign(shortUrl){
        location.replace(`${URL_BASE}/#/campaign/${shortUrl}`)
        history.pushState({url:`/#/campaign/${shortUrl}`}, "", `/#/campaign/${shortUrl}`)
    }

    navigateToProfile(email){
        location.replace(`${URL_BASE}/#/profile/${email}`)
        history.pushState({url:`/#/profile/${email}`}, "",  `/#/profile/${email}`)
    }

    navigateToRecover() {
        location.replace(`${URL_BASE}/#/recover`)
        history.pushState({url:"#/recover"}, "", "#/recover")
    }

    navigateToChangePassword(token){
        location.replace(`/#/changePassword`)
        history.pushState({url:`/#/changePassword`}, "",  `/#/changePassword`)
    }

    navigateToReset(token){
        location.replace(`/#/reset/${token}`)
        history.pushState({url:`/#/reset/${token}`}, "",  `/#/reset /${token}`)
    }

}