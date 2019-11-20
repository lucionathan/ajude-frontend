const BASE_URL = "http://localhost:8080";
const outerShadow = "0px 4px 4px rgba(0, 0, 0, 0.25)"
const innerShadow = "inset 0px 4px 4px rgba(0, 0, 0, 0.25)"
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
        $div.id=`c${this.id}`;
        $div.className = "campaign"
        let $title = document.createElement('h2')
        $title.innerText = this.shortName
        let $description = document.createElement('p')
        $description.innerText = this.description
        $description.className = "campaignDescription"
        let $reach = document.createElement('div')
        let $tempGoal = document.createElement('div')
        $tempGoal.style.width = `${100 * this.donated/this.goal}%`
        $tempGoal.innerText = `${this.donated}/${this.goal}`
        $reach.appendChild($tempGoal)
        $reach.className="progress"
        let $likes = document.createElement('p')
        $likes.innerText= this.likes
        let $deslikes = document.createElement('p')
        $deslikes.innerText= this.deslikes
        let $date = document.createElement('p')
        $date.innerText = this.date
        let $header = document.createElement('div')
        $header.className = "campaignHeader"
        $header.appendChild($title)
        $header.appendChild($date)
        let $likeButton = document.createElement('button')
        $likeButton.addEventListener('click', () =>{
            this.addLike()
        })
        $likeButton.innerHTML = `<i class="material-icons">thumb_up</i>`
        //$likeButton.innerText = this.likedBy.includes(localStorage.getItem('loggedAs'))
        let $deslikeButton = document.createElement('button')
        //$deslikeButton.innerText = this.deslikedBy.includes(localStorage.getItem('loggedAs'))
        $deslikeButton.innerHTML = `<i class="material-icons">thumb_down</i>`
        $likeButton.querySelector('i').style.textShadow = this.wasLiked ? '' : outerShadow;
        $deslikeButton.querySelector('i').style.textShadow = this.wasDesliked ? '' : outerShadow;

        $deslikeButton.addEventListener('click', () =>{
            this.addDeslike()
        })

        let $visitUsSquare = document.createElement('div')
        let $visitUs = document.createElement('a')
        $visitUs.innerText="VISITAR"
        $visitUs.href=`${BASE_URL}/campaign/${this.shortUrl}`
        $visitUsSquare.appendChild($visitUs)
        let $footer = document.createElement('div')
        $footer.className = "campaignFooter"
        $likeButton.className="likeButton"
        $deslikeButton.className="deslikeButton"
        $deslikes.className = "deslikes"
        $likes.className = "likes"
        $footer.appendChild($likeButton)
        $footer.appendChild($likes)
        $footer.appendChild($deslikeButton)
        $footer.appendChild($deslikes)
        $footer.appendChild($visitUsSquare)
        $div.appendChild($header)
        $div.appendChild($description)
        $div.appendChild($reach)
        $div.appendChild($footer)
    
        return $div
    }

    addLike(){
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