export class Campaign{

    constructor(shortName, shortUrl, description, date, likes, deslikes, likedBy, deslikedBy, goal, donated){
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
        $div.className = "campaign"
        let $title = document.createElement('h2')
        $title.innerText = this.shortName
        let $description = document.createElement('p')
        $description.innerText = this.description
        let $reach = document.createElement('div')
        let $tempGoal = document.createElement('p')
        $tempGoal.innerText = `${this.donated}/${this.goal}`
        $reach.appendChild($tempGoal)
        let $likes = document.createElement('p')
        $likes.innerText= this.likes
        let $deslikes = document.createElement('p')
        $deslikes.innerText= this.deslikes
        let $date = document.createElement('p')
        $date.innerText = this.date
        let $likeButton = document.createElement('button')
        $likeButton.addEventListener('click', () =>{
            this.addLike()
        })
        $likeButton.innerText = this.likedBy.includes(localStorage.getItem('loggedAs'))
        let $deslikeButton = document.createElement('button')
        $deslikeButton.innerText = this.deslikedBy.includes(localStorage.getItem('loggedAs'))
        $div.appendChild($title)
        $div.appendChild($description)
        $div.appendChild($reach)
        $div.appendChild($likes)
        $div.appendChild($deslikes)
        $div.appendChild($date)
        $div.appendChild($likeButton)
        $div.appendChild($deslikeButton)
    
        return $div
    }

    addLike(){
        this.wasLiked = !this.wasLiked
        let liker = localStorage.getItem('loggedAs')
        
    }

}