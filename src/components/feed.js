import {Campaign} from './campaign.js'
export class Feed{
    
    orderingMethod
    feedCampaigns
    constructor(){
        let $container = document.querySelector('#container')
        const URL_BASE = "http://localhost:8080";
        this.feedCampaigns = []
        this.orderingMethod = (c1, c2) => (c1.goal - c1.donated) - (c2.goal - c2.donated)
        $container.innerHTML = ''
        this.email = localStorage.getItem("loggedAs")
        console.log(`logged as ${this.email}`)
        fetch(`${URL_BASE}/campaign`)
        .then(res => {return res.json()})
        .then(res => {
            console.log(res)
            this.populateFeed(res);
        })
        let $template = document.querySelector('#dashBoard')
        $container.appendChild($template.content.querySelector('div').cloneNode(true))
        //let $button = $container.querySelector('div').querySelector('button')
        let $button = document.querySelector('#logoutButton')
        let $addCampaignButton = document.querySelector('#addCampaignButton')
        document.querySelector("#goSearch").addEventListener('click', () =>{           
            console.log(document.querySelector("#orderOption").selectedOptions[0].value)
        })
        //location.hash ="#dash"
        //$addCampaignButton.addEventListener('click', viewCreateCampaign)
        //$button.addEventListener('click', viewLogin)

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