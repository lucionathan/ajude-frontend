import {Router} from '../router.js'

const URL_BACK = "http://localhost:8080";

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
        let $buttonRegister =$container.querySelector('form').querySelector('#registerBtn')
        $buttonRegister.addEventListener('click', () =>{
            Router.navigateToRegister()
        });
        location.hash = "#/login"
    }



    login() {
        //recover data from form
        let $email = document.querySelector("#email").value
        let $password = document.querySelector("#password").value
        let $check = document.querySelector("#check").checked
        localStorage.setItem('loggedAs', $email)    
        
        //show logging page
        this.viewLogging()

        //make login request to the api
        fetch(URL_BACK+"/login", {
            'method' : 'POST',
            'body' : `{"email": "${$email}", "password": "${$password}", "savePassword": "${$check}"}`,
            'headers' : {'Content-Type' : 'application/json'}
        }).catch(err => {
            console.log("\n\n[DEBUG script.js login]", err)
            Router.navigateToLogin()

        }).then(res =>{
            console.log(res)
            return res.json()
        }).then(res => {
            //if the request was ok, show the next page; else, go back to the login page with a warning message
            if(res.ok){
                let $template = document.querySelector("#login")
                $template.content.querySelector("p").style.visibility = "hidden";
                localStorage.setItem('token', res.token)
                Router.navigateToDashBoard()
            }else{
                let $template = document.querySelector("#login")
                $template.content.querySelector("p").style.visibility = "initial";
                Router.navigateToLogin()
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