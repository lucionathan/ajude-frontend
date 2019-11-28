import {Router} from '../router.js'
const router = new Router()
import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;


export class Login{
    constructor(){
        let $container = document.querySelector("#container")
        $container.innerHTML = ''

        let $template = document.querySelector("#login")
        $container.appendChild($template.content.querySelector('form').cloneNode(true))
        let $button =$container.querySelector('form').querySelector('#loginBtn')
        $button.addEventListener('click', () =>{
            this.login();
        })
        let $buttonRegister = $container.querySelector('form').querySelector('#registerBtn')
        $buttonRegister.addEventListener('click', () =>{
            router.navigateToRegister()
        });

        let $buttonReset = $container.querySelector('form span')
        $buttonReset.addEventListener('click', () => {
            router.navigateToForgot()
        })
        location.hash = "#/login"
    }



    login() {
        //recover data from form
        let $email = document.querySelector("#email").value
        let $password = document.querySelector("#password").value
        let $check = document.querySelector("#check").checked
        localStorage.setItem('loggedAs', $email)    
        
        //show logging page
        router.navigateToLoggin()

        //make login request to the api
        fetch(URL_BACKEND+"/login", {
            'method' : 'POST',
            'body' : `{"email": "${$email}", "password": "${$password}", "savePassword": "${$check}"}`,
            'headers' : {'Content-Type' : 'application/json'}
        }).catch(err => {
            console.log("\n\n[DEBUG script.js login]", err)
            router.navigateToLogin()

        }).then(res =>{
            return res.json()
        }).then(res => {
            //if the request was ok, show the next page; else, go back to the login page with a warning message
            if(res.ok){
                let $template = document.querySelector("#login")
                $template.content.querySelector("p").style.visibility = "hidden";
                localStorage.setItem('token', res.token)
                router.navigateToDashBoard()
            }else{
                let $template = document.querySelector("#login")
                $template.content.querySelector("p").style.visibility = "initial";
                router.navigateToLogin()
            }
            
        })
    
    }


    viewLogging(){
        let $container = document.querySelector("#container")

        $container.innerHTML = ''
        let $template = document.querySelector('#logging')
        $container.appendChild($template.content.querySelector('div').cloneNode(true))
        location.hash ="#/dash"
    }
}