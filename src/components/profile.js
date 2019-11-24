const URL_BACKEND = "http://localhost:8080";
import {Campaign} from './campaign.js'


export class Profile {

    sortMethod
    userCampaigns
    constructor(email) {
        this.email = email;
        let $container = document.querySelector('#container');
        this.userCampaigns = [];
        this.sortMethod = this.orderByRemaining
        $container.innerHTML = ''


        fetch(`${URL_BACKEND}/user/${email}`, {
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
        }).then((res) =>{
            return res.clone().json()
        }).then((response) =>{
            let campaignsTemp = [];
            this.render(response.firstName, response.lastName, email);
            response.donations.forEach(element => {
                if(this.checkArray(campaignsTemp, element.campaign.shortUrl)){
                    campaignsTemp.push(element.campaign)
                }
            })
            this.populateCampaigns(campaignsTemp, "created")
        })

        console.log(this.userCampaigns)

        fetch(`${URL_BACKEND}/campaign/user/${email}`, {
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
        }).then((res) =>{return res.clone().json()

        }).then((response) =>{
            console.log(response)        
            this.populateCampaigns(response, "contributed");
        })  

        let $template = document.querySelector('#profile')
        $container.appendChild($template.content.querySelector('div').cloneNode(true))

    }
    
    populateCampaigns(campaigns, typeClass){

        let $userView = document.querySelector('#listCampaigns')
        campaigns.map(c => {
            this.userCampaigns.push(new Campaign(c.id,c.shortName, c.shortUrl,c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated))
        })

        this.userCampaigns.map(campaign =>{
            $userView.appendChild(campaign.render(typeClass))
        })
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