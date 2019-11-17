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
        case "#register":
            viewRegister()
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
    let $buttonRegister =$container.querySelector('form').querySelector('#registerBtn')
    $buttonRegister.addEventListener('click', viewRegister);
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
    let email = localStorage.getItem("loggedAs")
    console.log(`${URL_BASE}/campaign/user/${email}`)
    fetch(`${URL_BASE}/campaign/user/${email}`,{
        'headers' : {'Content-Type' : 'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`}})
        .then(res => {return res.json()})
        .then(res => {
        populateFeed(res);
    })
    let $template = document.querySelector('#dashBoard')
    $container.appendChild($template.content.querySelector('div').cloneNode(true))
    //let $button = $container.querySelector('div').querySelector('button')
    let $button = document.querySelector('#logoutButton')
    $button.addEventListener('click', viewLogin)
    let $addCampaignButton = document.querySelector('#addCampaignButton')
    $addCampaignButton.addEventListener('click', viewCreateCampaign)
    location.hash ="#dash"
}

function viewRegister() {
    $container.innerHTML = ''
    let $template = document.querySelector("#register")
    $container.appendChild($template.content.querySelector('form').cloneNode(true))
    let $button = $container.querySelector('form').querySelector('#registerBtn')
    $button.addEventListener('click', register)
    location.hash = "#register"
}

function viewCreateCampaign(){
    $container.innerHTML = ''
    let $template = document.querySelector("#registerCampaign")
    $container.appendChild($template.content.querySelector('form').cloneNode(true))
    let $button = $container.querySelector('#postCampaign')
    $button.addEventListener('click', postCampaign)
    location.hash = "#campaign"
}

//REQUESTS LOGIC

function login() {
    //recover data from form
    let $email = document.querySelector("#email").value
    let $password = document.querySelector("#password").value
    let $check = document.querySelector("#check").checked
    localStorage.setItem('loggedAs', $email)    
    
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


function register() {
    //recover data from form
    let $firstname = document.querySelector("#firstname").value
    let $lastname = document.querySelector("#lastname").value
    let $email = document.querySelector("#email").value
    let $password = document.querySelector("#password").value
    let $check = false;
    //show logging page
    viewLogging()
    //make a register request to the api
    fetch(URL_BASE+"/user/register", {
        'method' : 'POST',
        'body' : `{"firstName": "${$firstname}","lastName": "${$lastname}", "email": "${$email}", "password": "${$password}"}`,
        'headers' : {'Content-Type' : 'application/json'}
    }).catch(err => {
        console.log("\n\n[DEBUG script.js register]", err)
        viewRegister()
    }).then(res =>{
        return res.json()
    }).then(res => {
        //if the request was ok, show the next page; else, go back to the login page with a warning message
        if(res.ok){
            login()
        }else{
            let $template = document.querySelector("#register")
            $template.content.querySelector("p").style.visibility = "initial";
            viewRegister()
        }
        
    })

}

function postCampaign(){
    console.log("testing")
    //recover data from form
    let shortName = document.querySelector("#shortname").value
    let description = document.querySelector("#description").value
    let date = document.querySelector("#date").value
    let goal = document.querySelector("#goal").value

    //make a register request to the api
    fetch(URL_BASE+"/campaign", {
        'method' : 'POST',
        'body' : `{"shortName": "${shortName}","description": "${description}", "date": "${date}", "goal": ${goal}, "shortUrl":"${getShortUrl(shortName)}"}`,
        'headers' : {'Content-Type' : 'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`}
    }).catch(err => {
        console.log("\n\n[DEBUG script.js register]", err)
        viewCreateCampaign()
    }).then(res =>{
        return res.json()
    }).then(res => {
        console.log(res)
        //if the request was ok, show the next page; else, go back to the login page with a warning message
        if(res.ok){
            viewLogado()
        }else{
            viewCreateCampaign()
        }
        
    })

}
//FRONT STATE
let feedCampaigns = [];

//Manipulating DOM
function populateFeed(campaigns){
    
    
    let $feed = document.querySelector('#feed')
    campaigns.map(c => {
        feedCampaigns.push(new Campaign(c.shortName, c.shortUrl,c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated))
    })

    feedCampaigns.map(campaign =>{
        $feed.appendChild(campaign.render())
    })
}

//UTIL

function getShortUrl(shortName){
    shortName = shortName.replace(/\s\s+/g, ' ');
    shortName = shortName.normalize("NFD").toLowerCase();
    shortName = shortName.split("").map(e =>{
        if(e in [".",":","?","!",",","/","|"]){
            return " "
        }else{
            return e;
        }
    }).join("")
    shortName = shortName.split(" ").join("-")
    return shortName
}

class Campaign{

    constructor(shortName, shortUrl, description, date, likes, deslikes, likedBy, deslikedBy, goal, donated){
        this.shortName = shortName;
        this.shortUrl=shortUrl;
        this.description= description;
        this.date = date;
        this.likes = likes;
        this.deslikes = deslikes;
        this.likedBy = likedBy;
        this.deslikedBy = deslikedBy
        this.goal = goal;
        this.donated = donated;
        let user = localStorage.getItem('loggedAs')
        this.wasLiked = likedBy.includes(user)
        this.wasDesliked = deslikedBy.includes(user)
    }

    render(){
        let $div = document.createElement('div')
        $div.className = "campaign"
        let $title = document.createElement('h2')
        $title.innerText = this.shortName
        let $description = document.createElement('p')
        $description.innerText = this.description
        let $reach = document.createElement('div')
        let $tempGoal = document.createElement('p')
        $tempGoal.innerText = `${this.donated}/${this.goal}`
        $reach.appendChild($tempGoal)
        let $likes = document.createElement('p')
        $likes.innerText= this.likes
        let $deslikes = document.createElement('p')
        $deslikes.innerText= this.deslikes
        let $date = document.createElement('p')
        $date.innerText = this.date
        let $likeButton = document.createElement('button')
        $likeButton.addEventListener('click', () =>{
            this.addLike()
        })
        $likeButton.innerText = this.likedBy.includes(localStorage.getItem('loggedAs'))
        let $deslikeButton = document.createElement('button')
        $deslikeButton.innerText = this.deslikedBy.includes(localStorage.getItem('loggedAs'))
        $div.appendChild($title)
        $div.appendChild($description)
        $div.appendChild($reach)
        $div.appendChild($likes)
        $div.appendChild($deslikes)
        $div.appendChild($date)
        $div.appendChild($likeButton)
        $div.appendChild($deslikeButton)
    
        return $div
    }

    addLike(){
        this.wasLiked = !this.wasLiked
        let liker = localStorage.getItem('loggedAs')
        
    }

}