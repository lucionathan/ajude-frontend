import {Router} from '../router.js'

const router = new Router()
const URL_BACK = "https://ajude-psoft.herokuapp.com";

export class Registry{

    constructor(){
        let $container = document.querySelector('#container')

        $container.innerHTML = ''
        let $template = document.querySelector("#register")
        $container.appendChild($template.content.querySelector('form').cloneNode(true))
        let $button = $container.querySelector('form').querySelector('#registerBtn')
        $button.addEventListener('click', () =>{
            this.register()
        })
        location.hash = "#/register"
    }

    register() {
        //recover data from form
        let firstname = document.querySelector("#firstname").value
        let lastname = document.querySelector("#lastname").value
        let email = document.querySelector("#email").value
        let password = document.querySelector("#password").value
        let check = false
        //show logging page
        router.navigateToLoggin()
        //make a register request to the api
        fetch(URL_BACK+"/user/register", {
            'method' : 'POST',
            'body' : `{"firstName": "${firstname}","lastName": "${lastname}", "email": "${email}", "password": "${password}"}`,
            'headers' : {'Content-Type' : 'application/json'}
        }).catch(err => {
            
            console.log("\n\n[DEBUG script.js register]" + err)
            Router.navigateToRegister()
        }).then(res =>{
            console.log(res + "yo my nigga" + res.ok)
            if(res.ok){
                return res.json()
            }else{
                router.navigateToRegister()
            }
        }).then(res => {
            if(res){
                this.login(email,password)
            }
        })

    }



    login(email,password) {        
        //show logging page
        router.navigateToLoggin()

        //make login request to the api
        fetch(URL_BACK+"/login", {
            'method' : 'POST',
            'body' : `{"email": "${email}", "password": "${password}", "savePassword": "${true}"}`,
            'headers' : {'Content-Type' : 'application/json'}
        }).catch(err => {
            console.log("\n\n[DEBUG script.js login]", err)
            router.navigateToLogin()

        }).then(res =>{
            return res.json()
        }).then(res => {
            //if the request was ok, show the next page; else, go back to the login page with a warning message
            if(res.ok){
                localStorage.setItem('loggedAs', email)    
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
}