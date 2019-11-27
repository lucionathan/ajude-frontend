import {Router} from '../router.js'
import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;
const router = new Router()

export class Recover {
    constructor() {
        let $container = document.querySelector('#container')

        $container.innerHTML = ''
        let $template = document.querySelector("#recover")
        $container.appendChild($template.content.querySelector('form').cloneNode(true))
        let $button = $container.querySelector('form').querySelector('#recoverBtn')
        

        $button.addEventListener('click', () =>{
            let email = $container.querySelector('form').querySelector('#emailRecover').value
            this.recover(email)
        })


        location.hash = "#/recover"
    }

    recover(email) {
        console.log(email)
        fetch(`${URL_BACKEND}user/forgot`, {
            'method' : 'POST',
            'body': `{"email":"${email}"}`
            }).catch(err => {
            
                console.log("\n\n[DEBUG script.js register]" + err)
                Router.navigateToRegister()
            }).then(res => {
                if(res.ok) {
                    return res.json()
                } else {
                    router.navigateToRecover()
                }
            }).then(res => {
                if(res) {
                    console.log(res);
                    $recover.appendChild(this.render());                
                }
            })
    }

    render() {
        let $div = document.querySelector('div');
        $div.innerHTML = `<div>Email enviado!</div>`;
        $div.id = "message";
        return $div
    }
}