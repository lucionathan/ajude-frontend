import {Router} from '../router.js'
const BACK_URL = "https://ajude-psoft.herokuapp.com/";
const dark = "#3B839A"
const light = "#30b4ba"
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

    render(typeClass){
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
                            <button class="visitCampaignButton">
                                <div>
                                    <p>Visitar</p>
                                </div>
                            </button>
                        </div>                  
        `
        $div.id=`c${this.id}`
        
        if(typeClass == "created") {
            $div.className="created"
        } else if(typeClass == "contributed") { 
            $div.className="contributed"
        } else {
            $div.className="campaign"
        }
        
        $div.querySelector('.progress div').style.width=`${100*min(this.donated,this.goal)/this.goal}%`
        $div.querySelector('.likeButton').addEventListener('click', () =>{
            this.addLike()
        })
        $div.querySelector('.deslikeButton').addEventListener('click', () =>{
            this.addDeslike()
        })

        $div.querySelector('.visitCampaignButton').addEventListener('click', () =>{
            router.navigateToCampaign(this.shortUrl)
        })

        $div.querySelector('.deslikeButton i').style.color = this.wasDesliked ? dark : light
        $div.querySelector('.likeButton i').style.color = this.wasLiked ? dark : light;
        return $div
    }

    addLike(){
        if(localStorage.getItem('token')){
            this.localLike()
            fetch(`${BACK_URL}/campaign/updateLikeDeslike`, {
                'method' : 'PUT',
                'body' : `{"shortUrl": "${this.shortUrl}", "choice":"like"}`,
                'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
            }).then((res) =>{
                return res.json()
            }).then((res) =>{
                if(res.status == 500){
                    alert('YOUR TOKEN HAS EXPIRED, PLEASE LOGIN AGAIN TO TRY AGAIN')
                    localStorage.removeItem('loggedAs')
                    localStorage.removeItem('token')
                }else{
                    this.updateCampaign(res).then(() => this.onUpdate())
                }
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
        let $deslikeButton = document.querySelector(`#c${this.id} .campaignFooter .deslikeButton`)
        let $likeButton = document.querySelector(`#c${this.id} .campaignFooter .likeButton`)
        let $likes = document.querySelector(`#c${this.id} .campaignFooter .likes`)
        $likeButton.querySelector('i').style.color = this.wasLiked ? dark : light;
        $deslikeButton.querySelector('i').style.color = this.wasDesliked ? dark : light;

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
        let $likeButton = document.querySelector(`#c${this.id} .campaignFooter .likeButton`)
        let $deslikeButton = document.querySelector(`#c${this.id} .campaignFooter .deslikeButton`)
        let $deslikes = document.querySelector(`#c${this.id} .campaignFooter .deslikes`)
        $deslikeButton.querySelector('i').style.color = this.wasDesliked ? dark : light;
        $likeButton.querySelector('i').style.color = this.wasLiked ? dark : light;

        $deslikes.innerText = this.deslikes
    }

    addDeslike(){
        if(localStorage.getItem('token')){
            this.localDeslike()
            
            fetch(`${BACK_URL}/campaign/updateLikeDeslike`, {
                'method' : 'PUT',
                'body' : `{"shortUrl": "${this.shortUrl}", "choice":"deslike"}`,
                'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'}
            }).then((res) =>{
                return res.json()
            }).then((res) =>{
                if(res.status == 500){
                    alert('YOUR TOKEN HAS EXPIRED, PLEASE LOGIN AGAIN TO TRY AGAIN')
                    localStorage.removeItem('loggedAs')
                    localStorage.removeItem('token')
                }else{
                    this.updateCampaign(res).then(() => this.onUpdate())
                }
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
        $div.querySelector('.campaignFooter .deslikeButton i').style.color = this.wasDesliked ? dark : light
        $div.querySelector('.campaignFooter .likeButton i').style.color = this.wasLiked ? dark : light;
        
    }
}

function min(a,b){
    if(a > b){
        return b;
    }else{
        return a;
    }
}