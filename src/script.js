import {Feed} from './components/feed.js'
import {Login} from './components/login.js'
import {Registry} from './components/registry.js'
import { CampaignView } from './components/campaignView.js';
let $container
const URL_BASE = "https://ajude-psoft.herokuapp.com";

//SINGLE PAGE LOGIC
function routing(){
    $container = document.querySelector('#container')
    $container.innerHTML = ''
    console.log(location.hash.split("/").length)
    
    if(location.hash.split("/").length > 2){
        let data = location.hash.split("/")
        if(data[1] == 'campaign'){
            console.log(data)
            viewCampaign(data[2])
        }
    }
    else{
        switch(location.hash){
            case "":
                viewLogado()
                break
            case "#/login":
                viewLogin()
                break
            case "#/register":
                viewRegister()
                break
            case "#/dash":
                viewLogado()
                break
            case "#/campaign":
                viewCreateCampaign()
                break
            case "#/loading":
                viewLogging()
                break
        }
    }
}

routing()
window.onhashchange = routing;
function viewLogin(){
    new Login();
}

function viewLogado(){
    new Feed()
}

function viewRegister() {
    new Registry()
}

function viewCampaign(shortUrl){
    new CampaignView(shortUrl)
}

function viewCreateCampaign(){
    $container.innerHTML = ''
    let $template = document.querySelector("#registerCampaign")
    $container.appendChild($template.content.querySelector('form').cloneNode(true))
    let $button = $container.querySelector('#postCampaign')
    $button.addEventListener('click', postCampaign)
    location.hash = "#/campaign"
}

//REQUESTS LOGIC
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

//UTIL

function getShortUrl(shortName){
    shortName = shortName.replace(/\s\s+/g, ' ')
    shortName = shortName.normalize("NFD").toLowerCase()
    shortName = shortName.split("").map(e =>{
        if(e in [".",":","?","!",",","/","|"]){
            return " "
        }else{
            return e
        }
    }).join("")
    shortName = shortName.split(" ").join("-")
    return shortName
}

function disableUpdate(){
    return false
}


function viewLogging(){
    let $container = document.querySelector("#container")
    $container.innerHTML = ''
    let $template = document.querySelector('#logging')
    $container.appendChild($template.content.querySelector('div').cloneNode(true))
}