const BASE_URL = "https://ajude-psoft.herokuapp.com";
import {Router} from '../router.js'
const router = new Router()
export class Commentary{
    constructor(comment){
        this.comment = comment;
    }

    render(){
        let $comment = document.createElement("div")
        $comment.id = `co${this.comment.id}`
        $comment.className = "commentary"
        $comment.innerHTML = `
        <h5 id="ownerEmail">${this.comment.email}</h5>
        <div class="textBox">
            <p>${this.comment.text}</p>
            <div class="buttons">
                <button id="delComment">deletar</button>
                <button id="newComment">responder</button>
                <button id="showAnswers">respostas(<span id="answerCount">${this.countActiveAnswer()}</span>)</button>
            </div>
        </div>

        <div class="newComment" style="display: none;">
            <span>deixe sua resposta a baixo</span>
            <textarea name="text" rows="5" cols="8" wrap="soft" id="textComent"> </textarea>
            <div class="buttons">
                <button class="sendComentary">enviar</button>
            </div>
        </div>

        <div class="answers" style="display: none;">
            
        </div>
        `

        if(localStorage.getItem('loggedAs') == this.comment.email){
            $comment.querySelector('#delComment').style.display = "block"
            $comment.querySelector('#delComment').addEventListener('click', () => {
                this.delComment(this.comment.father, this.comment.id, `#co${this.comment.id}`)
            })
        }

        $comment.querySelector("#ownerEmail").addEventListener('click', () => {
            router.navigateToProfile(this.comment.email)
        })

        $comment.querySelector("#newComment").addEventListener('click', () =>{
            if(this.checkLogin()){
                this.open()
            }     
        })

        $comment.querySelector("#showAnswers").addEventListener('click', () =>{
            this.showAnswers()
        })

        $comment.querySelector(".newComment .sendComentary").addEventListener('click', () =>{
            this.createComent($comment.querySelector(".newComment #textComent").value)
        })
        return $comment
    }

    checkLogin(){
        if(!localStorage.getItem('token')){
            alert('Você precisa estar logado para isso!');
            return false;
        }
        return true;
    }

    delComment(father, id, divID){
        fetch(BASE_URL+"/campaign/commentary",{
            'method' : 'DELETE',
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'},
            'body' : `{
                "father" : ${father},
                "id" : ${id},
                "shortUrl" : ${JSON.stringify(this.comment.shortUrl)}
            }`
        }).then(res => {
            return res.json()
            
        }).then(res => {
            let comt = document.querySelector(divID)
            comt.parentNode.removeChild(comt)
            if(divID.startsWith('#ans')){
                document.querySelector("#answerCount").innerHTML = parseInt(document.querySelector("#answerCount").innerHTML) - 1
            }
            
        })
    }

    countActiveAnswer(){
        let i = 0;
        this.comment.answer.forEach(element => {
            if(element.active){
                i = i + 1;
            }
        })
        return i;
    }

    showAnswers(){
        let $div = document.querySelector(`#co${this.comment.id} .answers`)
        if($div.style.display === "flex"){
            $div.style.display = "none"
        }else{
            $div.innerHTML = ""
            this.comment.answer.forEach(element => {
                if(element.active){
                    let $answer = document.createElement("div")
                    $answer.id = `ans${element.id}`
                    $answer.innerHTML = `
                    <div class="answerBox">
                        <h5 id="ownerEmail">${element.email}</h5>
                        <p>${element.text}</p>
                    </div>
                    `
                    $answer.querySelector("#ownerEmail").addEventListener('click', () => {
                        router.navigateToProfile(element.email)
                    })
                    if(localStorage.getItem('loggedAs') == element.email){
                        let $btn = document.createElement('div')
                        $btn.innerHTML = "<button>deletar comentario</button>"
                        $btn.className = "delAnswer"
                        $btn.addEventListener('click', () =>{
                            this.delComment(element.father, element.id, `#ans${element.id}`)
                        })
                        $answer.appendChild($btn)
                    }
                    $div.appendChild($answer)
                }
            });
            if($div.childElementCount > 0){
                $div.style.display = "flex"
            }
            

        }
    }

    open(){
        let $div = document.querySelector(`#co${this.comment.id} .newComment`)
        if($div.style.display === "none"){
            $div.style.display = "flex"
        }else{
            $div.style.display = "none"
        }
    }

    createComent(text){
        fetch(BASE_URL+`/campaign/commentary/answer`, {
            'method' : 'POST',
            'headers' : {'Authorization':`Bearer ${localStorage.getItem('token')}`,'Content-Type' : 'application/json'},
            'body' : `{
                "text" : ${JSON.stringify(text)},
                "email" : ${JSON.stringify(localStorage.getItem('loggedAs'))},
                "father" : ${this.comment.id},
                "shortUrl" : ${JSON.stringify(this.comment.shortUrl)}
            }`
        }).then((res) =>{
            return res.json()
        }).then(res => {
            this.open()
            this.comment.answer.push(res)
            document.querySelector("#answerCount").innerHTML = parseInt(document.querySelector("#answerCount").innerHTML) + 1
        }) 
    }

}
