const BASE_URL = "http://localhost:8080";


export class CampaignView{
    constructor(shortUrl){
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
                return res.json()
            }).then(res => {
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
            })
    }

    render() {
        let $container = document.querySelector('#container')
        $container.innerHTML = `
        <div class="campaignView">
            <div class="viewHeader>
                <h2>${this.shortName}</h2>
                <span>EXPIRA: ${this.date}</span>
            </div>
            
            <div class="viewDescription">
                <h4>objetivo</h4>
                <p>${this.description}</p>
            </div>

            <div class="goalLikes">    

                <div class="progress">
                    <h4>meta</h4>
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
        let $div = $container.querySelector(".campaignView")
        $div.querySelector('.progress div').style.width=`${100*this.donated/this.goal}%`
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
}