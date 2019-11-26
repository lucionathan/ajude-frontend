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

            fetch(`${URL_BACKEND}/campaign/user/${email}`, {
                'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
            }).then((res) =>{return res.json()
                
            })
            .then((response) =>{
                response.forEach(element => {
                    if(this.checkArray(campaignsFeed, element.shortUrl)) {
                        campaignsFeed.push(element)
                    }
                });

                fetch(`${URL_BACKEND}/campaign/${email}/donated`, {
                    'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
                }).then((res) =>{return res.json();
                    
                }).then((response) =>{
                    response.forEach(campaign => {
                        if(this.checkArray(campaignsFeed, campaign.shortUrl)) {
                            campaignsFeed.push(campaign)
                        }
                    });
                    
                    this.populateCampaigns(campaignsFeed);
                    
                }) 
            })  
        })

        let $template = document.querySelector('#profile')
        $container.appendChild($template.content.querySelector('div').cloneNode(true))

        let $button = document.querySelector('#logoutButton')
        let $inputFilter = document.querySelector('#feedFilter')
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
        console.log(active)
        fetch(`${URL_BACKEND}campaign/substring?substring=${subString}&status=${active}`).then(res => console.log(res)).then(res => res.json()).then((res) =>{
            console.log(res)
            this.populateFeed(res)
        })
    }
    
    populateCampaigns(campaigns){
        let $userView = document.querySelector('#listCampaigns')
        campaigns.forEach(c => {
          const draftCampaing = new Campaign(c.id, c.shortName, c.shortUrl, c.description, c.date, c.likes, c.deslikes, c.pessoasLike, c.pessoasDeslike, c.goal, c.donated, c.owner)
          this.userCampaigns.push(draftCampaing)
        })
        
        this.userCampaigns.forEach(campaign =>{
          let typeClass = campaign.owner === this.email ? "created" : "contributed"
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

    showByFilter(text){
        if(text){           
            this.shown = this.feedCampaigns.filter(campaign => campaign.description.includes(text) || campaign.shortName.includes(text))
            this.updateFeed()
        }else{
            this.shown = this.feedCampaigns
            this.updateFeed()
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
        this.userCampaigns.sort(this.sortMethod)
    }
    
    updateFeed(){
        let $feed = document.querySelector('#listCampaigns')
        $feed.innerHTML = ''
        this.shown.forEach(campaign =>{
            $feed.appendChild(campaign.render())
        })
    }

}