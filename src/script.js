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
    let $email = document.createElement('input')
    let $senha = document.createElement('input')
    let $title = document.createElement('h2')
    let $send = document.createElement('button')
    $send.innerText="Send"
    let $form = document.createElement('form')
    $title.innerText="Login"
    $email.placeholder="Insira seu e-mail aqui"
    $senha.placeholder="Insira sua senha aqui"
    $send.addEventListener('click', viewLogado)
    $form.appendChild($title)
    $form.appendChild($email)
    $form.appendChild($senha)
    $form.appendChild($send)
    $container.appendChild($form)
    location.hash = "#login"
}

function viewLogado(){
    $container.innerHTML = ''
    let $h2 = document.createElement('h2')
    $h2.innerText = "logado"
    $container.appendChild($h2)
    let $logout = document.createElement('button')
    $logout.innerText = "Logout"
    $logout.addEventListener('click', viewLogin)
    $container.appendChild($logout)
    location.hash ="#dash"
}
