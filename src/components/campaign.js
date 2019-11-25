import {Router} from '../router.js'
const BASE_URL = "https://ajude-psoft.herokuapp.com";
const outerShadow = "0px 4px 4px rgba(0, 0, 0, 0.25)"
const innerShadow = "inset 0px 4px 4px rgba(0, 0, 0, 0.25)"
const router = new Router()
export class Campaign{

    constructor(id,shortName, shortUrl, description, date, likes, deslikes, likedBy, deslikedBy, goal, donated){
        this.id = id;
        this.shortName = shortName;
        this.shortUrl=shortUrl;
        this.description= description;
        this.date = date;
        this.likes = likes;
        this.deslikes = deslikes;
        this.likedBy = likedBy;
        this.deslikedBy = deslikedBy
        this.goal = goal;
        this.donated = donated;
        let user = localStorage.getItem('loggedAs')
        this.wasLiked = likedBy.includes(user)
        this.wasDesliked = deslikedBy.includes(user)
    }

    render(){
        let $div = document.createElement('div')
        $div.innerHTML = `<div class="campaignHeader">
                            <h2>${this.shortName}</h2>
                            <p>${this.date}</p>
                        </div>
                        <p class="campaignDescription">${this.description}</p>
                        <div class="progress">
                            <div>${this.donated}/${this.goal}</div>
                        </div>
                        <div class="campaignFooter">
                            <button class="likeButton"><i class="material-icons">thumb_up</i></button>
                            <p class="likes">${this.likes}</p>
                            <button class="deslikeButton"><i class="material-icons">thumb_down</i></button>
                            <p class="deslikes">${this.deslikes}</p>
                            <div>
                                <button>VISITAR</button>
                            </div>
                        </div>                  
        `
        $div.id=`c${this.id}`
        $div.className="campaign"
        $div.querySelector('.progress div').style.width=`${100*this.donated/this.goal}%`
        $div.querySelector('.likeButton').addEventListener('click', () =>{
            this.addLike()
        })
        $div.querySelector('.deslikeButton').addEventListener('click', () =>{
            this.addDeslike()
        })

        $div.querySelector('.campaignFooter div button').addEventListener('click', () =>{
            router.navigateToCampaign(this.shortUrl)
        })
        return $div
    }

    addLike(){
        if(localStorage.getItem('token')){
            this.localLike()
            fetch(`${BASE_URL}/campaign/updateLikeDeslike`, {
                'method' : 'PUT',
                'body' : `{"shortUrl": "${this.shortUrl}", "choice":"like"}`,
                'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
            }).then((res) =>{
                return res.json()
            }).then((res) =>{
                this.updateCampaign(res).then(() => this.onUpdate())
            })          
        }else{
            alert('YOU HAVE TO LOGIN TO DO THAT')
        }
    }

    localLike(){
        if(this.wasLiked){
            this.wasLiked = false;
            this.likes--;
        }else{
            this.wasLiked = true;
            this.likes++;
        }
        let $likeButton = document.querySelector(`#c${this.id} .campaignFooter .likeButton`)
        let $likes = document.querySelector(`#c${this.id} .campaignFooter .likes`)
        $likeButton.querySelector('i').style.textShadow = this.wasLiked ? '' : outerShadow;
        $likes.innerText = this.likes
    }

    localDeslike(){
        if(this.wasDesliked){
            this.wasDesliked = false;
            this.deslikes--;
        }else{
            this.wasDesliked = true;
            this.deslikes++;
        }
        let $deslikeButton = document.querySelector(`#c${this.id} .campaignFooter .deslikeButton`)
        let $deslikes = document.querySelector(`#c${this.id} .campaignFooter .deslikes`)
        $deslikeButton.querySelector('i').style.textShadow = this.wasDesliked ? '' : outerShadow;
        $deslikes.innerText = this.deslikes
    }

    addDeslike(){
        if(localStorage.getItem('token')){
            this.localDeslike()
            
            fetch(`${BASE_URL}/campaign/updateLikeDeslike`, {
                'method' : 'PUT',
                'body' : `{"shortUrl": "${this.shortUrl}", "choice":"deslike"}`,
                'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
            }).then((res) =>{
                return res.json()
            }).then((res) =>{
                this.updateCampaign(res).then(() => this.onUpdate())
            })
        }else{
            alert('YOU HAVE TO BE LOGIN TO DO THAT')
        }
    }

    
    async updateCampaign(newCampaign){
        this.id = newCampaign.id;
        this.shortName = newCampaign.shortName;
        this.shortUrl=newCampaign.shortUrl;
        this.description= newCampaign.description;
        this.date = newCampaign.date;
        this.likes = newCampaign.likes;
        this.deslikes = newCampaign.deslikes;
        this.likedBy = newCampaign.pessoasLike;
        this.deslikedBy = newCampaign.pessoasDeslike
        this.goal = newCampaign.goal;
        this.donated = newCampaign.donated;
        let user = localStorage.getItem('loggedAs')
        this.wasLiked = newCampaign.pessoasLike.includes(user)
        this.wasDesliked = newCampaign.pessoasDeslike.includes(user)
    }

    onUpdate(){
        let $div = document.querySelector(`#c${this.id}`)
        $div.querySelector('.campaignHeader h2').innerText = this.shortName
        $div.querySelector('.campaignHeader p').innerText = this.date
        $div.querySelector('.campaignDescription').innerText = this.description
        $div.querySelector('.progress div').innerText = `${this.donated}/${this.goal}`
        $div.querySelector('.campaignFooter .likes').innerText = this.likes;
        $div.querySelector('.campaignFooter .deslikes').innerText = this.deslikes;
        $div.querySelector('.campaignFooter .deslikeButton i').style.textShadow = this.wasDesliked ? '' : outerShadow
        $div.querySelector('.campaignFooter .likeButton i').style.textShadow = this.wasLiked ? '' : outerShadow;
        
    }
}