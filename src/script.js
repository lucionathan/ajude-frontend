import {Feed} from './components/feed.js'
import {Login} from './components/login.js'
import {Registry} from './components/registry.js'
import { CampaignView } from './components/campaignView.js';
import { CampaignRegistry } from './components/CampaignRegistry.js';
import {Router} from '../router.js'
import { Profile } from './components/profile.js';
import { Reset } from './components/reset.js';
import { ChangePassword } from './components/changePassword.js';
import { Recover } from './components/recover.js';

const router = new Router()
let $container

import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;

//SINGLE PAGE LOGIC
function routing(){
    $container = document.querySelector('#container')
    $container.innerHTML = ''    
    if(location.hash.split("/").length > 2){
        let data = location.hash.split("/")
        if(data[1] == 'campaign' && data[2] != "edit"){
            viewCampaign(data[2])
        }else if(data[1] == 'profile'){
            viewProfile(data[2])
        }else if(data[1] == 'reset'){
            viewReset(data[2])
        }
        if(data[1] == 'campaign' && data[2] == 'edit'){
            viewEditCampaign(data[3])
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
            case "#/profile":
                viewProfile()
                break
            case "#/recover":
                viewRecover()
                break 
            case "#/changePassword":
                viewChangePassword()
                break 
            case "#/reset":
                viewReset()
                break    
            case "#/forgot":
                viewForgot()
        }
    }
    if(location.hash != "#/login" && location.hash != "#/register"){
        if(localStorage.getItem('token')){
            $loggedHeader.style.display = "flex"
            $guestHeader.style.display = "none"
        }else{
            $loggedHeader.style.display = "none"
            $guestHeader.style.display = "flex"
        }
    }else{
        $loggedHeader.style.display = "none"
        $guestHeader.style.display = "none"
    }
}

let $loggedHeader = document.querySelector('#loggedInHeader')
$loggedHeader.querySelector("#logoutButton").addEventListener('click', ()=>{
        localStorage.removeItem('token')
        localStorage.removeItem('loggedAs')
        routing()
})
$loggedHeader.querySelector("#goToProfileButton").addEventListener('click', ()=>{
    router.navigateToProfile(localStorage.getItem('loggedAs'))
})
let $guestHeader = document.querySelector('#guestHeader')
$guestHeader.querySelector("#loginButton").addEventListener('click', ()=>{
    router.navigateToLogin()
})
$guestHeader.querySelector("#registerButton").addEventListener('click', ()=>{
    router.navigateToRegister()
})

document.querySelector("#guestHeader .ajude").addEventListener('click', () =>{
    router.navigateToDashBoard()
})

document.querySelector("#loggedInHeader .ajude").addEventListener('click', () =>{
    router.navigateToDashBoard()
})

if(localStorage.getItem('token')){
    $loggedHeader.style.display = "flex"
    $guestHeader.style.display = "none"
}else{
    $loggedHeader.style.display = "none"
    $guestHeader.style.display = "flex"
}



routing()
window.onhashchange = routing
function viewLogin(){
    dontIncludeHeader()
    new Login();
}

function viewLogado(){
    includeHeader(localStorage.getItem('loggedAs'))
    new Feed()
}

function viewRegister() {
    dontIncludeHeader()
    new Registry()
}

function viewCampaign(shortUrl){
    includeHeader(localStorage.getItem('loggedAs'))
    new CampaignView(shortUrl)
}

function viewCreateCampaign(){
    includeHeader(localStorage.getItem('loggedAs'))
    new CampaignRegistry()
}


function viewProfile(email) {
    includeHeader(localStorage.getItem('loggedAs'))
    new Profile(email);
}

function viewForgot() {
    dontIncludeHeader()
    new Recover();
}

function viewReset(token) {
    dontIncludeHeader()
    new Reset(token);
}


function viewChangePassword() {
    includeHeader(localStorage.getItem('loggedAs'))
    new ChangePassword();
}

function viewEditCampaign(shortUrl){
    includeHeader(localStorage.getItem('loggedAs'))
    new CampaignRegistry(shortUrl)

}

function includeHeader(email){
    if(email){
        $guestHeader.className= 'hidden'
        $loggedHeader.className = ''
    }else{
        $loggedHeader.className = 'hidden'
        $guestHeader.className = ''
    }
}

function dontIncludeHeader(){
    $guestHeader.className= 'hidden'
    $loggedHeader.className = 'hidden'
}

function viewLogging(){
    let $container = document.querySelector("#container")
    $container.innerHTML = ''
    let $template = document.querySelector('#logging')
    $container.appendChild($template.content.querySelector('div').cloneNode(true))
}