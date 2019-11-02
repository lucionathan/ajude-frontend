let $container
const URL_BASE = "http://localhost:8080";

//SINGLE PAGE LOGIC
(function (){
    $container = document.querySelector('#container')
    $container.innerHTML = ''
    switch(location.hash){
        case "":
            viewLogin()
            break
        case "#login":
            viewLogin()
            break
        case "#dash":
            viewLogado()
            break
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
    //recover data from form
    let $email = document.querySelector("#email").value
    let $password = document.querySelector("#password").value
    let $check = document.querySelector("#check").checked
    //show logging page
    viewLogging()
    //make login request to the api
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
        //if the request was ok, show the next page; else, go back to the login page with a warning message
        if(res.ok){
            let $template = document.querySelector("#login")
            $template.content.querySelector("p").style.visibility = "hidden";
            localStorage.setItem('token', res.token)
            viewLogado()
        }else{
            let $template = document.querySelector("#login")
            $template.content.querySelector("p").style.visibility = "initial";
            viewLogin()
        }
        
    })

}

