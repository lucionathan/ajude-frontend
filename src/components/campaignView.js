import { Commentary } from "./commentary.js";
import * as c from '../config/env.js'
const config = c.config()
const BASE_URL = config.URL_BACKEND;


export class CampaignView{

    constructor(shortUrl){
        this.shortUrl = shortUrl;
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
                this.render()
            })
    }

    render() {
        let $top = document.createElement("div")
        $top.id = "headerCampaign"
        $top.innerHTML = `<h1> aJuDe </h1>
        <div class="buttons">
            <button>LOGIN</button>
            <button>CADASTRO</button>
        </div>`
        document.querySelector("body").after($top)
        let $container = document.querySelector('#container')
        $top.after($container)
        $container.innerHTML = `

        <div id="campaignView">
            <div class="viewHeader">
                <h2>${this.shortName}</h2>
                <span id="campaignStatus">STATUS: ${this.status}</span>
                <span>EXPIRA: ${this.date}</span>
            </div>
            
            <div class="viewDescription">
                <h4>objetivo</h4>
                <p class="description">${this.description}</p>
            </div>

            <h4 class="goal">meta</h4>
            <div class="goalLikes">    
                
                <div class="progressView">                   
                    <div><span id="donated">${this.donated}</span>/<span id="goal">${this.goal}</span></div>
                </div>
                <div class="owner">
                    <p>criador: ${this.owner}</p>
                </div>
                <div class="likesDeslikes">
                    <button class="likeButton"><i class="material-icons">thumb_up</i></button>
                    <p class="likes">${this.likes}</p>
                    <button class="deslikeButton"><i class="material-icons">thumb_down</i></button>
                    <p class="deslikes">${this.deslikes}</p>
                </div>
            </div>

            <div class="commentaryBox">
                <h4>comentários</h4>
                <div class="comentaries">
                    
                </div>
                
                <div class="newCommentBTN">
                    <button>COMENTAR</button>
                </div>

                <div class="newCommentMAIN" style="display: none;">
                    <span>escreva seu novo comentário abaixo</span>
                    <textarea name="text" rows="5" cols="8" wrap="soft" id="textComent"> </textarea>
                    <div class="buttons">
                        <button class="sendComentaryMAIN">enviar</button>
                    </div>
                </div>
            </div>

            <div class="campaignBTNs">
                <button class="donateBTN">FAZER DOAÇÃO</button>
            </div>

            <div id="modal-donate" class="modal-container">
                <div class="modal">
                    <button class="closeModal">x</button>
                    <h3>Faça uma doação para esta campanha</h3>
                    <input type="number" id="donationValue" placeholder="digite o valor que gostaria de doar">
                    <button type="button" class="button" id="sendDonate">DOAR</button>
                </div>
            </div>
        </div>`
        
        let $donateBTN = $container.querySelector(".campaignBTNs .donateBTN")
        $donateBTN.addEventListener('click', () => {
            if(this.checkLogin()){
                this.openModal()
            }
            
        })

        let $closeModal = $container.querySelector(".modal .closeModal")
        $closeModal.addEventListener('click', () => {
            this.closeModal()
        })

        let $sendDonation = $container.querySelector(".modal #sendDonate")
        $sendDonation.addEventListener('click', () => {
            let $donationValue = $container.querySelector(".modal #donationValue").value
            this.sendDonation($donationValue)
        })

        this.populateCommentaries()

        if(this.owner === localStorage.getItem('loggedAs')){
            let $editBTN = document.createElement('button')
            let $shutBTN = document.createElement('button')
            $editBTN.innerHTML = "EDITAR"
            $shutBTN.innerHTML = "ENCERRAR"
            $shutBTN.addEventListener('click', () =>{
                this.shutCampaign()
            })
            let $container = document.querySelector("#campaignView .campaignBTNs")
            $container.appendChild($shutBTN)
            $container.appendChild($editBTN)
        }

        let $newCommentBTN = $container.querySelector('.newCommentBTN')
        $newCommentBTN.addEventListener('click', () => {
            if(this.checkLogin()){
                this.openNewComment()
            }
        })

        let $sendBTN = $container.querySelector('.sendComentaryMAIN')
        $sendBTN.addEventListener('click', () => {
            this.sendComment($container.querySelector(".newCommentMAIN #textComent").value)
        })

        let $div = $container.querySelector("#campaignView")
        $div.querySelector('.progressView div').style.width=`${100*this.donated/this.goal}%`
        $div.querySelector('.likeButton').addEventListener('click', () =>{
            this.addLike()
        })
        $div.querySelector('.deslikeButton').addEventListener('click', () =>{
            this.addDeslike()
        })
    }

    checkLogin(){
        if(!localStorage.getItem('token')){
            alert('Você precisa estar logado para isso!');
            return false;
        }
        return true;
    }

    shutCampaign(){
        fetch(BASE_URL+`/campaign/${this.shortUrl}/end`, {
            'method' : 'PUT',
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'},
        }).then(res => {
            return res.json()
        }).then(res => {
            this.status = res.status
            document.querySelector("#campaignStatus").innerHTML = this.status
        })
    }

    sendDonation(value){
        fetch(BASE_URL+`/campaign/${this.shortUrl}/donation`, {
            'method' : 'POST',
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'},
            'body' : `{
                "donatedValue": ${value}
            }`
        }).then(res => {
            return res.json()
        }).then(res => {
            this.donated = res.donated
            this.goal = res.goal
            document.querySelector("#donated").innerHTML = this.donated
            document.querySelector("#goal").innerHTML = this.goal
            const $modal = document.querySelector("#modal-donate")
            $modal.classList.remove('show')
            let $div = document.querySelector("#campaignView")
            $div.querySelector('.progressView div').style.width=`${100*this.donated/this.goal}%`
            if(this.donated == this.goal){
                alert("Obrigado, graças a você atingimos a meta. :)")
            }else if(this.donated < this.goal){
                alert(`Obrigado, graças a você estamos só a ${this.goal - this.donated} da nossa meta :)`)
            }else{
                alert(`Obrigado, atingimos nossa meta.`)
            }
        })
    }

    openModal(){
        const $modal = document.querySelector("#modal-donate")
        $modal.classList.add('show')
        $modal.addEventListener('click', (e) => {
            if(e.target.id === "modal-donate"){
                $modal.classList.remove('show')
            }
        })
    }

    closeModal(){
        const $modal = document.querySelector("#modal-donate")
        $modal.classList.remove('show')
    }

    sendComment(text){
        fetch(BASE_URL+`/campaign/commentary/`, {
            'method' : 'POST',
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'},
            'body' : `{
                "text" : ${JSON.stringify(text)},
                "email" : ${JSON.stringify(localStorage.getItem('loggedAs'))},
                "father" : ${-666},
                "shortUrl" : ${JSON.stringify(this.shortUrl)}
            }`
        }).then((res) =>{
            return res.json()
        }).then(res => {
            console.log(res)
            this.openNewComment()
            this.commentaries.push(res)
            this.populateCommentaries()
        })
    }

    openNewComment(){
        let $btn = document.querySelector("#campaignView .newCommentBTN")
        
        if($btn.style.display === "none"){
            $btn.style.display = "flex"
        }else{
            $btn.style.display = "none"
        }
        let $div = document.querySelector(`#campaignView .newCommentMAIN`)
        if($div.style.display === "none"){
            $div.style.display = "flex"
        }else{
            $div.style.display = "none"
        }
    }

    populateCommentaries(){
        let $comentaryBox = document.querySelector(".comentaries")
        let coment;
        $comentaryBox.innerHTML = ""
        this.commentaries.forEach(element => {
            if(element.active){
                coment = new Commentary(element)
                $comentaryBox.appendChild(coment.render())
            }
        });
        if($comentaryBox.childElementCount < 1){
            $comentaryBox.innerHTML = "Ainda não tem nenhum comentário nessa campanha ainda, seja o primeiro :)"
            $comentaryBox.style.padding = "10px"
        }
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