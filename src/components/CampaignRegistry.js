import {Router} from '../router.js'
const router = new Router()
import * as c from '../config/env.js'
const config = c.config()
const URL_BASE = config.URL_BASE;
const URL_BACKEND = config.URL_BACKEND;
export class CampaignRegistry
{
    constructor(name = "", data = "", description = "", goal = 0){
        this.name = name
        this.data = data
        this.description = description
        this.goal = goal
        this.render()
    }

    render() {
        let $container = document.querySelector('#container')
        $container.innerHTML = `
        <div id="campaignView">
            <div class="viewHeader">
                <input id="createShortName" type="text" placeholder="Nome da campanha" value="${this.name}">
                <span>EXPIRA: <input id="createExpireDate" type="date" value="${this.data}"></span>
            </div>
            
            <div class="viewDescription">
                <h4>objetivo</h4>
                <div class="description">
                    <input id="createDescription" type="textarea" placeholder="Objetivo da campanha" value="${this.description}">
                </div>
                
            </div>

            <h4 class="goal">meta</h4>
            <div class="goalCreate">    
                
                <div class="metaCreate">                   
                    <p>Quanto deseja arrecadar?</p>
                    <input min=0 id="createGoal" type="number" value="${this.goal}">
                </div>

                <button id="submitCampanha">
                    <i class="material-icons">add_box</i>
                </button>
            </div>
            <div id="displayError">
            </div>
        </div>`
        let $div = $container.querySelector("#campaignView")

        $container.querySelector("#submitCampanha").addEventListener('click', () => {
            let shortName = $container.querySelector('#createShortName').value
            let expireDate = $container.querySelector('#createExpireDate').value
            let description = $container.querySelector('#createDescription').value
            let goal = $container.querySelector('#createGoal').value
            this.postCampaign(shortName, expireDate, description, goal)
        })

    }


    
    postCampaign(shortName, expireDate, description, goal){
        //make a register request to the api
        let date = this.getRightDate(expireDate)
        fetch(URL_BACKEND+"campaign", {
            'method' : 'POST',
            'body' : `{"shortName": "${shortName}","description": "${description}", "date": "${date}", "goal": ${goal}, "shortUrl":"${this.getShortUrl(shortName)}"}`,
            'headers' : {'Content-Type' : 'application/json', 'Authorization':`Bearer ${localStorage.getItem('token')}`}
        }).catch(err => {
            console.log("\n\n[DEBUG script.js register]", err)
        }).then(res =>{
            console.log(res)
            if(res.status == 400){
                this.displayAlreadyExists(shortName)
            }else if(res.status==500){
                this.displayAuthentication()
            }
            else{
                return res.json()
            }
        }).then(res => {
            if(res){
                router.navigateToCampaign(res.shortUrl)
            }
        })
    }

    getRightDate(formdate){
        let data = formdate.split('-')
        return `${data[2]}/${data[1]}/${data[0]}`
    }


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

    displayAlreadyExists(shortName){
        let $p = document.createElement('p')
        $p.innerText = `Já existe uma campanha chamada ${shortName}, por favor escolha outro nome`

        let $div = document.querySelector('#displayError')
        $div.appendChild($p)
        setTimeout(() => {
            $div.innerHTML = ''
        }, 2000);
    }

    displayAuthentication(){        
        let $p = document.createElement('p')
        $p.innerText = `Por favor, logue para criar campanhas.`

        let $div = document.querySelector('#displayError')
        $div.appendChild($p)
        setTimeout(() => {
            $div.innerHTML = ''
        }, 2000);
    }
}