
export class Commentary{
    constructor(comment){
        this.comment = comment;
    }

    render(){
        let $comment = document.createElement("div")
        $comment.id = "commentary"
        $comment.innerHTML = `
        <h5>${this.comment.email}</h5>
        <div class="textBox">
            <p>${this.comment.text}</p>
            <div class="buttons">
                <button>comentar</button>
                <button>comentarios(${this.comment.answer.length})</button>
            </div>
        </div>
        `

        return $comment
    }
}