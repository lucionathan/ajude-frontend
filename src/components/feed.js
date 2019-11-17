import {Campaign} from './campaign.js'
export class Feed{
    
    constructor(){
        let $container = document.querySelector('#container')
        const URL_BASE = "http://localhost:8080";
        this.feedCampaigns = []
        $container.innerHTML = ''
        this.email = localStorage.getItem("loggedAs")
        console.log(`${URL_BASE}/campaign/user/${this.email}`)
        fetch(`${URL_BASE}/campaign/user/${this.email}`,{
            'headers' : {'Content-Type' : 'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`}})
            .then(res => {return res.json()})
            .then(res => {
            this.populateFeed(res);
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

    populateFeed(campaigns){
    
    
        let $feed = document.querySelector('#feed')
        campaigns.map(c => {
            this.feedCampaigns.push(new Campaign(c.shortName, c.shortUrl,c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated))
        })
    
        this.feedCampaigns.map(campaign =>{
            $feed.appendChild(campaign.render())
        })
    }
}