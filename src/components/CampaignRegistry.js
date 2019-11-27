

export class CampaignRegistry
{
    constructor(){
        this.render()
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
                <input type="text" placeholder="Nome da campanha">
                <span>EXPIRA: <input type="date"></span>
            </div>
            
            <div class="viewDescription">
                <h4>objetivo</h4>
                <div class="description">
                    <input type="textarea" placeholder="Objetivo da campanha">

                </div>
                
            </div>

            <h4 class="goal">meta</h4>
            <div class="goalLikes">    
                
                <div class="progressView">                   
                    <p>Quanto deseja arrecadar?</p>
                    <input type="number">
                </div>

                <div class="likesDeslikes">
                    <button class="likeButton"><i class="material-icons">thumb_up</i></button>
                    <p class="likes">0</p>
                    <button class="deslikeButton"><i class="material-icons">thumb_down</i></button>
                    <p class="deslikes">0</p>
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


    
    postCampaign(){
    
        let shortName = document.querySelector("#shortname").value
        let description = document.querySelector("#description").value
        let date = document.querySelector("#date").value
        let goal = document.querySelector("#goal").value

        //make a register request to the api
        fetch(URL_BASE+"/campaign", {
            'method' : 'POST',
            'body' : `{"shortName": "${shortName}","description": "${description}", "date": "${date}", "goal": ${goal}, "shortUrl":"${getShortUrl(shortName)}"}`,
            'headers' : {'Content-Type' : 'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`}
        }).catch(err => {
            console.log("\n\n[DEBUG script.js register]", err)
            viewCreateCampaign()
        }).then(res =>{
            return res.json()
        }).then(res => {
            console.log(res)
            //if the request was ok, show the next page; else, go back to the login page with a warning message
            if(res.ok){
                viewLogado()
            }else{
                viewCreateCampaign()
            }
            
        })

    }

//UTIL

    getShortUrl(shortName){
    shortName = shortName.replace(/\s\s+/g, ' ')
    shortName = shortName.normalize("NFD").toLowerCase()
    shortName = shortName.split("").map(e =>{
        if(e in [".",":","?","!",",","/","|"]){
            return " "
        }else{
            return e
        }
    }).join("")
    shortName = shortName.split(" ").join("-")
    return shortName
}
}