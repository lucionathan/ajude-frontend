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
        let $addCampaignButton = document.querySelector('#addCampaignButton')
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
        
        $button.addEventListener('click', () =>{
            localStorage.removeItem("token")
            localStorage.removeItem("loggedAs")
            router.navigateToLogin()
        })

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