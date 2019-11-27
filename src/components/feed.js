import {Campaign} from './campaign.js'
import {Router} from '../router.js'
import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;
const router = new Router()
export class Feed{
    


    constructor(){
        let $container = document.querySelector('#container')
        this.feedCampaigns = []
        this.sortMethod = this.orderByRemaining
        $container.innerHTML = ''
        this.email = localStorage.getItem("loggedAs")
        fetch(`${URL_BACKEND}/campaign`)
        .then(res => {return res.json()})
        .then(res => {
            this.populateFeed(res);
        })
        
        let $template = document.querySelector('#dashBoard')
        $container.appendChild($template.content.querySelector('div').cloneNode(true))
        let $button = document.querySelector('#logoutButton')
        let $inputFilter = document.querySelector('#feedFilter')
        $inputFilter.addEventListener("input", () =>{
            this.showByFilter($inputFilter.value)
        })

        document.querySelector("#orderByDate").addEventListener('click', () => {
            this.sortMethod = this.orderByDate
            this.sort()
            this.updateFeed()
        })
        document.querySelector("#orderByLikes").addEventListener('click', () => {
            this.sortMethod = this.orderByLikes
            this.sort()
            this.updateFeed()
        })

        document.querySelector("#orderByGoal").addEventListener('click', () => {
            this.sortMethod = this.orderByRemaining
            this.sort()
            this.updateFeed()
        })

        document.querySelector("#backendQuery").addEventListener('click', () =>{
            this.backSearch()
        })
        
        $button.addEventListener('click', () =>{
            localStorage.removeItem("token")
            localStorage.removeItem("loggedAs")
            router.navigateToLogin()
        })

    }

    backSearch(){
        let subString = document.querySelector("#stringQuery").value
        let active = document.querySelector("#activeQuery").checked
        if(subString){
            fetch(`${URL_BACKEND}campaign/substring?substring=${subString}&status=${active}`)
            .then(res => res.json())
            .then((res) =>{
                this.populateFeed(res)
            })
        }else{
            fetch(`${URL_BACKEND}/campaign`)
            .then(res => {return res.json()})
            .then(res => {
                this.populateFeed(res);
        })
        }
    }

    orderByRemaining(c1,c2){
        return (c1.goal - c1.donated) - (c2.goal - c2.donated)
    }

    orderByLikes(c1,c2){
        return c2.likes - c1.likes
    }

    orderByDate(c1, c2){
        return new Date(c1.date) - new Date(c2.date)
    }

    sort(){
        this.feedCampaigns.sort(this.sortMethod)
    }

    populateFeed(campaigns){
        let $feed = document.querySelector('#campaignFeedList')
        this.feedCampaigns = []
        $feed.innerHTML =''

        for(let i = 0; i < min(5, campaigns.length); i++) 
            this.feedCampaigns.push(new Campaign(campaigns[i].id,campaigns[i].shortName, campaigns[i].shortUrl,campaigns[i].description, campaigns[i].date, campaigns[i].likes, campaigns[i].deslikes, campaigns[i].pessoasLike, campaigns[i].pessoasDeslike, campaigns[i].goal, campaigns[i].donated));
        this.shown = this.feedCampaigns
        if(this.feedCampaigns.length == 0){
            let $p = document.createElement('p')
            $p.innerText = 'Aparentemente nenhuma campanha foi achada.'
            $p.style.width = "100%;"
            $p.style.textAlign = 'center'
            $feed.appendChild($p)
        }
        this.sort()
        this.shown.forEach(campaign =>{
            $feed.appendChild(campaign.render())
        })
    }


    updateFeed(){
        let $feed = document.querySelector('#campaignFeedList')
        $feed.innerHTML = ''
        this.shown.forEach(campaign =>{
            $feed.appendChild(campaign.render())
        })
    }

    showByFilter(text){
        if(text){           
            this.shown = this.feedCampaigns.filter(campaign => campaign.description.includes(text) || campaign.shortName.includes(text))
            this.updateFeed()
        }else{
            this.shown = this.feedCampaigns
            this.updateFeed()
        }
    }
}

function min(a,b){
    if(a > b){
        return b
    }else{
        return a
    }
}