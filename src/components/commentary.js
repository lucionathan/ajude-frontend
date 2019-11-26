const BASE_URL = "https://ajude-psoft.herokuapp.com";

export class Commentary{
    constructor(comment){
        this.comment = comment;
    }

    render(){
        let $comment = document.createElement("div")
        $comment.id = `co${this.comment.id}`
        $comment.className = "commentary"
        $comment.innerHTML = `
        <h5>${this.comment.email}</h5>
        <div class="textBox">
            <p>${this.comment.text}</p>
            <div class="buttons">
                <button id="newComment">comentar</button>
                <button id="showAnswers">comentarios(<span id="answerCount">${this.comment.answer.length}</span>)</button>
            </div>
        </div>

        <div class="newComment" style="display: none;">
            <span>dale</span>
            <textarea name="text" rows="5" cols="8" wrap="soft" id="textComent"> </textarea>
            <div class="buttons">
                <button class="sendComentary">comentar</button>
            </div>
        </div>

        <div class="answers" style="display: none;">
            
        </div>
        `
        $comment.querySelector("#newComment").addEventListener('click', () =>{
            this.open()
        })

        $comment.querySelector("#showAnswers").addEventListener('click', () =>{
            this.showAnswers()
        })

        $comment.querySelector(".newComment .sendComentary").addEventListener('click', () =>{
            this.createComent($comment.querySelector(".newComment #textComent").value)
        })
        return $comment
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
        console.log(text, localStorage.getItem('loggedAs'), this.comment.id, this.comment.shortUrl)
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
