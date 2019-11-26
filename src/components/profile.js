import {Campaign} from './campaign.js'
import {Router} from '../router.js'
import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;
const router = new Router()

export class Profile {

    constructor(email){

        let $container = document.querySelector('#container');
        this.feedCampaigns = [];
        this.sortMethod = this.orderByRemaining;
        $container.innerHTML = '';
        this.email = email;
        fetch(`${URL_BACKEND}/user/${this.email}`, {
        'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
        }).then(res => {return res.json()
        }).then(res => {
            console.log(res)
            this.populateFeed(res.campaigns);
            this.render(res.firstName, res.lastName, this.email)
        })
        
        let $template = document.querySelector('#profile')
        $container.appendChild($template.content.querySelector('div').cloneNode(true))
        let $button = document.querySelector('#logoutButtonProfile')
        let $inputFilter = document.querySelector('#feedFilterProfile')
        $inputFilter.addEventListener("input", () =>{
            this.showByFilter($inputFilter.value)
        })

        document.querySelector("#orderByDateProfile").addEventListener('click', () => {
            this.sortMethod = this.orderByDate
            this.sort()
            this.updateFeed()
        })
        document.querySelector("#orderByLikesProfile").addEventListener('click', () => {
            this.sortMethod = this.orderByLikes
            this.sort()
            this.updateFeed()
        })

        document.querySelector("#orderByGoalProfile").addEventListener('click', () => {
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
        console.log(campaigns)
        let $feed = document.querySelector('#listCampaigns')
        campaigns.forEach(c => {
            let draftCampaing = new Campaign(c.id, c.shortName, c.shortUrl, c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated, c.owner)
            this.feedCampaigns.push(draftCampaing)
        })

        this.shown = this.feedCampaigns
        this.sort()
        this.shown.forEach(campaign =>{
            let typeClass = campaign.owner === this.email ? "created" : "contributed"
            $feed.appendChild(campaign.render(typeClass))
        })
    }

    updateFeed(){
        let $feed = document.querySelector('#listCampaigns')
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

    render(firstName, lastName, email) {
        let $name = document.querySelector('#name')
        $name.innerHTML = `<div id="nameContent">${firstName} ${lastName}</div>`
        let $email = document.querySelector('#email')
        $email.innerHTML = `<div id="emailContent">${email}</div>`
    }
}