import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;

export class Router{

    constructor(){

    }
    navigateToLogin(){
        history.pushState({url:"#/login"}, "", "#/login")
        window.onhashchange()
    }

    navigateToRegister(){
        history.pushState({url:"#/register"}, "", "#/register")
        window.onhashchange()
    }

    navigateToDashBoard(){
        history.pushState({url:"#/dash"}, "", "#/dash")
        window.onhashchange()
    }

    navigateToLoggin(){
        history.pushState({url:"#/loading"}, "", "#/loading")
        window.onhashchange()
    }

    navigateToCampaign(shortUrl){
        history.pushState({url:`/#/campaign/${shortUrl}`}, "", `/#/campaign/${shortUrl}`)
        window.onhashchange()
    }

    navigateToProfile(email){
        history.pushState({url:`/#/profile/${email}`}, "",  `/#/profile/${email}`)
        window.onhashchange()
    }


    navigateToEdit(shortUrl){
        history.pushState({url:`/#/campaign/edit/${shortUrl}`}, "",  `/#/campaign/edit/${shortUrl}`)
        window.onhashchange()
    }
  
    navigateToCampaignCreation(){  
        history.pushState({url:`/#/campaign`}, "",  `/#/campaign`)
        window.onhashchange()
    }

    navigateToProfile(email){
        history.pushState({url:`/#/profile/${email}`}, "",  `/#/profile/${email}`)
        window.onhashchange()
    }

    navigateToRecover() {
        history.pushState({url:"#/recover"}, "", "#/recover")
        window.onhashchange()
    }

    navigateToChangePassword(){
        history.pushState({url:`/#/changePassword`}, "",  `/#/changePassword`)
        window.onhashchange()
    }

    navigateToReset(token){
        history.pushState({url:`/#/reset/${token}`}, "",  `/#/reset/${token}`)
        window.onhashchange()
    }

    navigateToForgot(){
        history.pushState({url:`/#/forgot`}, "",  `/#/forgot`)
        window.onhashchange()
    }
}