import {Router} from '../router.js'
import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;
const router = new Router()

export class ChangePassword {
    constructor() {
        let $container = document.querySelector('#container')

        $container.innerHTML = ''
        let $template = document.querySelector("#changePassword")
        $container.appendChild($template.content.querySelector('form').cloneNode(true))
        let $button = $container.querySelector('form').querySelector('#changePasswordBtn')


        $button.addEventListener('click', () =>{
            let $password = $container.querySelector('form').querySelector('#currentPassword');
            let $newPassword = $container.querySelector('form').querySelector('#newPassword');
            let $newPassword2 = $container.querySelector('form').querySelector('#newPassword2');
            let $passwordMessage = $container.querySelector('form').querySelector('#passwordMessage');
            if($newPassword.value === $newPassword2.value) {

                this.change(localStorage.getItem('loggedAs'), $password.value, $newPassword.value)

                $passwordMessage.innerHTML = "";
                $password.value = "";
                $newPassword.value = "";
                $newPassword2.value = "";
            } else {
                $passwordMessage.innerHTML = "As senhas são diferentes.";
            }
            
            $password.value = "";
        })


    }

    change(email, password, newPassword) {
        console.log(email)
        fetch(`${URL_BACKEND}user/changepassword`, {
            'method' : 'POST',
            'body': `{"email":"${email}", "password":"${password}", "newPassword":"${newPassword}"}`,
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
        }).catch(err => {
            
                console.log("\n\n[DEBUG script.js register]" + err)
                Router.navigateToRecover()
            }).then(res => {
                if(res.ok) {
                    return res.json()
                } else {
                    let $container = document.querySelector('#container')
                    console.log(123)
                    $container.querySelector('form').querySelector('#messageChange').innerHTML = "Senha incorreta."          
                }
            }).then(res => {  
                console.log(res);
                if(res) {
                    let $container = document.querySelector('#container')
                    
                    $container.querySelector('form').querySelector('#messageChange').innerHTML = "Senha atualizada."
                }
            })
    }

}