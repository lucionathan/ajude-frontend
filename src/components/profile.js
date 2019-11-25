const URL_BACKEND = "https://ajude-psoft.herokuapp.com";
import {Campaign} from './campaign.js'


export class Profile {

    sortMethod
    userCampaigns

    constructor(email) {
        let campaignsFeed = []
        this.email = email;
        let $container = document.querySelector('#container');
        this.userCampaigns = [];
        this.sortMethod = this.orderByRemaining
        $container.innerHTML = ''


        fetch(`${URL_BACKEND}/user/${email}`, {
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
        }).then((res) =>{
            return res.json()
        }).then((response) =>{

            this.render(response.firstName, response.lastName, email);
            
            response.donations.forEach(element => {
                if(this.checkArray(campaignsFeed, element.campaign.shortUrl)){
                    campaignsFeed.push(element.campaign)
                }
            })

            fetch(`${URL_BACKEND}/campaign/user/${email}`, {
                'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
            }).then((res) =>{return res.json()
                
            }).then((response) =>{
                response.forEach(element => {
                    if(this.checkArray(campaignsFeed, element.shortUrl)) {
                        campaignsFeed.push(element)
                    }
                });
                console.log(this.userCampaigns)
                console.log(this.campaignsFeed)
    
                this.populateCampaigns(campaignsFeed);
            })  
        })




        let $template = document.querySelector('#profile')
        $container.appendChild($template.content.querySelector('div').cloneNode(true))

    }
    
    populateCampaigns(campaigns){
        let $userView = document.querySelector('#listCampaigns')
        campaigns.forEach(c => {
          const draftCampaing = new Campaign(c.id, c.shortName, c.shortUrl, c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated, c.owner)
          this.userCampaigns.push(draftCampaing)
          console.log(this.userCampaigns)
        })
        
        this.userCampaigns.forEach(campaign =>{
          console.log(campaign.owner)
          let typeClass = campaign.owner === this.email ? "created" : "contributed"
          console.log(typeClass)
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