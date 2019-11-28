import {Router} from '../router.js'
import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;
const router = new Router()

export class Reset {
    constructor(token) {
        let $container = document.querySelector('#container')

        $container.innerHTML = ''
        let $template = document.querySelector("#resetPassword")
        $container.appendChild($template.content.querySelector('form').cloneNode(true))
        let $button = $container.querySelector('form').querySelector('#resetPasswordBtn')


        $button.addEventListener('click', () =>{
            let $newPassword = $container.querySelector('form').querySelector('#newResetPassword');
            let $newPassword2 = $container.querySelector('form').querySelector('#newResetPassword2');
            let $passwordMessage = $container.querySelector('form').querySelector('#passwordResetMessage');
            if($newPassword.value === $newPassword2.value & $newPassword.length > 6) {
                $passwordMessage.innerHTML = "";
                $newPassword.value = "";
                $newPassword2.value = "";

                this.reset($newPassword.value, token)
            } else {
                $passwordMessage.innerHTML = "As senhas são diferentes.";
            }
            
            $password.value = "";
        })


    }

    reset(newPassword, token) {
        console.log(email)
        fetch(`${URL_BACKEND}user/reset`, {
            'method' : 'POST',
            'body': `{"new_password":"${newPassword}"}`,
            'headers' : {'Authorization':`Bearer ${token}`,'Content-Type' : 'application/json'}
        }).catch(err => {
            
                console.log("\n\n[DEBUG script.js register]" + err)
                Router.navigateToRecover()
            }).then(res => {
                if(res.ok) {
                    return res.json()
                }
            }).then(res => {  
                console.log(res);
                if(res) {
                    let $container = document.querySelector('#container')
                    
                    $container.querySelector('form').querySelector('#messageReset').innerHTML = "Senha atualizada."
                }
            })
    }

}