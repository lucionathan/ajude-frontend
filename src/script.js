let $container

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
    let $button =$container.querySelector('form').querySelector('button')
    $button.addEventListener('click', viewLogado)
    location.hash = "#login"
}

function viewLogado(){
    $container.innerHTML = ''
    let $template = document.querySelector('#dashBoard')
    $container.appendChild($template.content.querySelector('div').cloneNode(true))
    let $button = $container.querySelector('div').querySelector('button')
    $button.addEventListener('click', viewLogin)
    location.hash ="#dash"
}
