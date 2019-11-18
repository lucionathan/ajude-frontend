const BASE_URL = "http://localhost:8080";

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
        let $tempGoal = document.createElement('p')
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
        $likeButton.innerText = this.likedBy.includes(localStorage.getItem('loggedAs'))
        let $deslikeButton = document.createElement('button')
        $deslikeButton.innerText = this.deslikedBy.includes(localStorage.getItem('loggedAs'))
        $deslikeButton.addEventListener('click', () =>{
            this.addDeslike()
        })
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
        $div.appendChild($header)
        $div.appendChild($description)
        $div.appendChild($reach)
        $div.appendChild($footer)
    
        return $div
    }

    addLike(){
        if(this.wasLiked){
            this.wasLiked = false;
            this.likes--;
        }else{
            this.wasLiked = true;
            this.likes++;
        }
        let $likeButton = document.querySelector(`#c${this.id} .campaignFooter .likeButton`)
        let $likes = document.querySelector(`#c${this.id} .campaignFooter .likes`)
        $likeButton.innerText = this.wasLiked;
        $likes.innerText = this.likes
        console.log("running")
        
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

    addDeslike(){
        if(this.wasDesliked){
            this.wasDesliked = false;
            this.deslikes--;
        }else{
            this.wasDesliked = true;
            this.deslikes++;
        }
        let $deslikeButton = document.querySelector(`#c${this.id} .campaignFooter .deslikeButton`)
        let $deslikes = document.querySelector(`#c${this.id} .campaignFooter .deslikes`)
        $deslikeButton.innerText = this.wasDesliked;
        $deslikes.innerText = this.deslikes
        console.log("running deslike")
        
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
        $div.querySelector('.progress p').innerText = `${this.donated}/${this.goal}`
        $div.querySelector('.campaignFooter .likes').innerText = this.likes;
        $div.querySelector('.campaignFooter .deslikes').innerText = this.deslikes;
        $div.querySelector('.campaignFooter .deslikeButton').innerText = this.wasDesliked
        $div.querySelector('.campaignFooter .likeButton').innerText = this.wasLiked
        
    }
}