import {Campaign} from './campaign.js'
import {Router} from '../router.js'
const URL_BACKEND = "http://localhost:8080";
const URL_BASE = "http://localhost:8000";

const router = new Router()
export class Feed{
    
    sortMethod
    feedCampaigns
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
        let $addCampaignButton = document.querySelector('#addCampaignButton')
        document.querySelector("#goSearch").addEventListener('click', () =>{           
            console.log(document.querySelector("#orderOption").selectedOptions[0].value)
            switch(document.querySelector("#orderOption").selectedOptions[0].value){
                case 'orderByRemaining':
                    this.sortMethod = this.orderByRemaining;
                case 'orderByLikes':
                    this.sortMethod=this.orderByLikes;
                case 'orderByDate':
                    this.sortMethod = this.orderByDate
            }
            this.sort()
            this.updateFeed()
            return false;
        })
        
        $button.addEventListener('click', router.navigateToLogin)

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
        this.feedCampaigns.sort(this.orderingMethod)
    }

    populateFeed(campaigns){
    
        let $feed = document.querySelector('#campaignFeedList')
        campaigns.map(c => {
            this.feedCampaigns.push(new Campaign(c.id,c.shortName, c.shortUrl,c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated))
        })
        //this.sort()
        this.feedCampaigns.map(campaign =>{
            $feed.appendChild(campaign.render())
        })
    }

    updateFeed(){
        let $feed = document.querySelector('#campaignFeedList')
        $feed.innerHTML = ''
        this.feedCampaigns.map(campaign =>{
            $feed.appendChild(campaign.render())
        })
    }
}