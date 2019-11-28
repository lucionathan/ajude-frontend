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

        let $byLikes =  document.querySelector("#orderByLikesProfile");
        let $byDate =  document.querySelector("#orderByDateProfile");
        let $byGoal =  document.querySelector("#orderByGoalProfile");

        $byGoal.className='activeOption'
        $byDate.addEventListener('click', () => {
            this.sortMethod = this.orderByDate
            $byLikes.className=''
            $byGoal.className=''
            $byDate.className='activeOption'
            this.sort()
            this.updateCampaigns()
        })
        $byLikes.addEventListener('click', () => {
            this.sortMethod = this.orderByLikes
            $byLikes.className='activeOption'
            $byGoal.className=''
            $byDate.className=''
            this.sort()
            this.updateCampaigns()
        })

        $byGoal.addEventListener('click', () => {
            this.sortMethod = this.orderByRemaining
            $byLikes.className=''
            $byGoal.className='activeOption'
            $byDate.className=''
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
        let $feed = document.querySelector('#listCampaigns')
        campaigns.forEach(c => {
            if(this.checkArray(this.userCampaigns, c.shortUrl)) {
                let draftCampaing = new Campaign(c.id, c.shortName, c.shortUrl, c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated, c.owner)
                this.userCampaigns.push(draftCampaing)
            }
        })

        this.shown = this.userCampaigns
        this.sort()
        this.shown.forEach(campaign =>{
            let typeClass = campaign.owner === this.email ? "created" : "contributed"
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
        $name.innerText = `Nome: ${firstName} ${lastName}`
        let $email = document.querySelector('#email')
        $email.innerText = `Contato: ${email}`
        let $change = document.querySelector('#changePasswordProfile')
        $change.addEventListener('click', () =>{
            router.navigateToChangePassword()
        })
        if(!(email === localStorage.getItem('loggedAs'))){
            $change.className='hidden'
        }
            
    
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