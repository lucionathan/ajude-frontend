let $container
const URL_BASE = "http://localhost:8080";

//SINGLE PAGE LOGIC
(function (){
    $container = document.querySelector('#container')
    $container.innerHTML = ''
    if(["", "#login"].includes(location.hash)){
        viewLogin()
    }else if(location.hash == "#dash"){
        viewLogado()
    }
}())
function viewLogin(){
    $container.innerHTML = ''
    let $template = document.querySelector("#login")
    $container.appendChild($template.content.querySelector('form').cloneNode(true))
    let $button =$container.querySelector('form').querySelector('#loginBtn')
    $button.addEventListener('click', login)
    location.hash = "#login"
}

function viewLogging(){
    $container.innerHTML = ''
    let $template = document.querySelector('#logging')
    $container.appendChild($template.content.querySelector('div').cloneNode(true))
    location.hash ="#dash"
}

function viewLogado(){
    $container.innerHTML = ''
    let $template = document.querySelector('#dashBoard')
    $container.appendChild($template.content.querySelector('div').cloneNode(true))
    let $button = $container.querySelector('div').querySelector('button')
    $button.addEventListener('click', viewLogin)
    location.hash ="#dash"
}


//REQUESTS LOGIC

function login() {
    let $email = document.querySelector("#email").value
    let $password = document.querySelector("#password").value
    let $check = document.querySelector("#check").checked
    viewLogging()

    fetch(URL_BASE+"/login", {
        'method' : 'POST',
        'body' : `{"email": "${$email}", "password": "${$password}", "savePassword": "${$check}"}`,
        'headers' : {'Content-Type' : 'application/json'}
    }).catch(err => {
        console.log("\n\n[DEBUG script.js login]", err)
        viewLogin()
    }).then(res =>{
        return res.json()
    }).then(res => {
        localStorage.setItem('token', res.token)
        viewLogado()
    })

}

