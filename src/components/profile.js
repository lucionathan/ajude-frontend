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
        this.userCampaigns = [];
        this.sortMethod = this.orderByRemaining;
        $container.innerHTML = '';
        this.email = email;
        fetch(`${URL_BACKEND}user/${this.email}`, {
        'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
        }).then(res => {return res.json()
        }).then(res => {
            console.log(res)
            this.populateCampaigns(res.campaigns);
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
            this.updateCampaigns()
        })
        document.querySelector("#orderByLikesProfile").addEventListener('click', () => {
            this.sortMethod = this.orderByLikes
            this.sort()
            this.updateCampaigns()
        })

        document.querySelector("#orderByGoalProfile").addEventListener('click', () => {
            this.sortMethod = this.orderByRemaining
            this.sort()
            this.updateCampaigns()
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
        this.userCampaigns.sort(this.sortMethod)
    }

    populateCampaigns(campaigns){
        console.log(campaigns)
        let $feed = document.querySelector('#listCampaigns')
        campaigns.forEach(c => {
            if(this.checkArray(this.userCampaigns, c.shortUrl)) {
                let draftCampaing = new Campaign(c.id, c.shortName, c.shortUrl, c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated, c.owner)
                this.userCampaigns.push(draftCampaing)
            }
            console.log(this.userCampaigns)
        })

        this.shown = this.userCampaigns
        this.sort()
        this.shown.forEach(campaign =>{
            let typeClass = campaign.owner === this.email ? "created" : "contributed"
            console.log(campaign.owner)
            console.log(this.email)

            console.log(typeClass)
            $feed.appendChild(campaign.render(typeClass))
        })
    }

    updateCampaigns(){
        let $feed = document.querySelector('#listCampaigns')
        $feed.innerHTML = ''
        this.shown.forEach(campaign =>{
            $feed.appendChild(campaign.render())
        })
    }

    showByFilter(text){
        if(text){           
            this.shown = this.userCampaigns.filter(campaign => campaign.description.includes(text) || campaign.shortName.includes(text))
            this.updateCampaigns()
        }else{
            this.shown = this.userCampaigns
            this.updateCampaigns()
        }
    }

    render(firstName, lastName, email) {
        let $name = document.querySelector('#name')
        $name.innerHTML = `<div id="nameContent">${firstName} ${lastName}</div>`
        let $email = document.querySelector('#email')
        $email.innerHTML = `<div id="emailContent">${email}</div>`
    }

    checkArray(campaigns, url) {
        let returnVar = true;
        campaigns.forEach(element => {
            if(element.shortUrl == url) {
                returnVar = false;
            }
        })

        return returnVar;
    }   
}