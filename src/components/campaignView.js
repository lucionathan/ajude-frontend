const BASE_URL = "http://localhost:8080";


export class CampaignView{
    constructor(shortUrl){
        console.log("aqui" + shortUrl)
        this.id;
        this.shortName;
        this.shortUrl = shortUrl;
        this.description;
        this.date;
        this.likes;
        this.deslikes;
        this.likedBy;
        this.deslikedBy;
        this.goal;
        this.donated;
        this.owner;
        this.commentaries;
        this.status;
        this.request();
    }

    request(){
            fetch(BASE_URL+`/campaign/${this.shortUrl}`).then(res => {
                console.log(res)
                return res.json()
            }).then(res => {
                console.log(res)
                this.id = res.id;
                this.shortName = res.shortName;
                this.description = res.description;
                this.date = res.date;
                this.likes = res.likes;
                this.deslikes = res.deslikes;
                this.likedBy = res.likedBy;
                this.deslikedBy = res.deslikedBy;
                this.goal = res.goal;
                this.donated = res.donated;
                this.owner = res.owner;
                this.status = res.status;
                this.commentaries = res.commentaries;
                this.render()
            })
    }

    render() {
        let $container = document.querySelector('#container')
        $container.innerHTML = `
        <div id="headerCampaign">
        <h1> aJuDe </h1>
        <div class="buttons">
            <button>LOGIN</button>
            <button>CADASTRO</button>
        </div>
        </div>
        <div id="campaignView">
            <div class="viewHeader">
                <h2>${this.shortName}</h2>
                <span>EXPIRA: ${this.date}</span>
            </div>
            
            <div class="viewDescription">
                <h4>objetivo</h4>
                <p class="description">${this.description}</p>
            </div>

            <h4 class="goal">meta</h4>
            <div class="goalLikes">    
                
                <div class="progressView">                   
                    <div>${this.donated}/${this.goal}</div>
                </div>

                <div class="likesDeslikes">
                    <button class="likeButton"><i class="material-icons">thumb_up</i></button>
                    <p class="likes">${this.likes}</p>
                    <button class="deslikeButton"><i class="material-icons">thumb_down</i></button>
                    <p class="deslikes">${this.deslikes}</p>
                </div>
            </div>
        </div>`
        let $div = $container.querySelector("#campaignView")
        $div.querySelector('.progressView div').style.width=`${100*this.donated/this.goal}%`
        $div.querySelector('.likeButton').addEventListener('click', () =>{
            this.addLike()
        })
        $div.querySelector('.deslikeButton').addEventListener('click', () =>{
            this.addDeslike()
        })
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
}