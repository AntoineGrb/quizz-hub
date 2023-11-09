//INITIER LE QUIZ
if (process.env.NODE_ENV !== 'test') { // Le code ici sera exécuté uniquement si l'environnement n'est pas en mode test
    initQuiz();
}

async function initQuiz() {
    const pathName = getPathName();
    const data = await fetchData(pathName);
    deployData(data)
}

function getPathName() {
    //Récupérer le nom de la page actuelle
    const fullPathName = window.location.pathname;
    const parts = fullPathName.split("/");
    const pathName = parts[parts.length - 1].split(".")[0] //Deux actions de split en une seule ligne
    return pathName;
}

async function fetchData(pathName) {
    try {
        const response = await fetch(`../src/data/data-${pathName}.json`);
        
        if (!response.ok) {
            throw new Error("Erreur réseau ou fichier non trouvé");
        }

        const data = await response.json();
        console.log(data);
        return data;

    } catch (error) {
        console.error("Erreur lors de la récupération du JSON:", error);
    }
}

function deployData(data) {
    const main = document.querySelector("main")
    for (let i=0 ; i < data.length - 1 ; i++ ) {
        //Construire les choix avec une boucle interne map
        const choicesHTML = data[i].choices.map(choice => 
            `<div class="question__choice">
                <input type="checkbox" id="${choice.id}" /> 
                <div class="checkmark checkmark-${choice.type}"></div>
                <label for="${choice.id}" class="label-${choice.type}"> ${choice.label}  </label>
            </div>`
        ).join('') //Convertir le tableau résultant en une chaine unique

        main.insertAdjacentHTML("beforeend" , 
            `<div class="question ${data[i].id}">
                <h3 class="question__title"> ${data[i].title} </h3>
                <img class="question__img" src="${data[i].img}" />
                ${choicesHTML}
            </div>
            <div class="answer a${i+1}">
                <p> <span> </span> </p> <br/>
                <p> ${data[i].answer} </p>
            </div>`
        )
    }
    ListeningQuizResponses(data);
}
    
//GERER LA REPONSE AU QUIZ
let count = {
    answers:0,
    goodAnswers:0
}

function ListeningQuizResponses(data) {

    let inputs = document.querySelectorAll("input")
    inputs.forEach(input => {
        input.addEventListener("click" , (e) => {
            
            //Récupère l'id du clic (ex q1r1)
            const id = e.target.getAttribute("id");

            //On en déduit toutes les infos de la réponse à partir de cet id
            let responseInfos = getResponseInfos(id);

            //On compte les scores
            count = countScores(responseInfos, count);
            console.log(count)

            //On met à jour le DOM en conséquence
            updateDOMAfterResponse(responseInfos);

            //Tester la fin du quiz et affichage des résultats finaux
            testingIsQuizCompleted(data, count)
        })
    })
}

function getResponseInfos(id) {
    //On en déduit l'id de la question et du choix correspondant  
    const questionId = id.slice(0, id.length-2) //ex q1
    const answerId = `a${id.slice(1, id.length-2)}` //ex r1

    //On en déduit la valeur de la classe de l'élément label
    const labelElement = document.querySelector(`label[for='${id}']`);
    const labelElementClassValue = labelElement.getAttribute("class");

    let responseInfos = {
        questionId,
        answerId,
        labelElement,
        labelElementClassValue
    }

    return responseInfos
}

function updateDOMAfterResponse(responseInfos) {
    //Comportement du DOM après réponse
    responseInfos.labelElement.classList.toggle("checked")
    const answer = document.querySelector(`.${responseInfos.answerId}`)
    answer.style.display = "block"
    
    //Pour les bonnes réponses
    if (responseInfos.labelElementClassValue === "label-true") {
        answer.style.borderColor = "green"
        document.querySelector(`.${responseInfos.answerId} p`).innerText = "👏 Correct !"
        document.querySelector(`.${responseInfos.answerId} p`).style.color = "seagreen"
    }

    //Pour les mauvaises réponses
    else if (responseInfos.labelElementClassValue === "label-false") {
        answer.style.borderColor = "red"
        document.querySelector(`.${responseInfos.answerId} p`).innerText = "👎 Faux !"
        document.querySelector(`.${responseInfos.answerId} p`).style.color = "rgb(190, 39, 47)"
    }
    else return

    //Désactiver les checkboxes après la réponse
    const questionInputs = document.querySelectorAll(`.${responseInfos.questionId} input`);
    questionInputs.forEach(input => {
        input.setAttribute("disabled" , "disabled")
    })

    //Scroll auto
    window.scrollBy({
        top:250,
        behavior:"smooth"
    });
}

function countScores(responseInfos, count) {
    if (responseInfos.labelElementClassValue === "label-true") {
        count.answers++
        count.goodAnswers++
    }

    else if (responseInfos.labelElementClassValue === "label-false") {
        count.answers++
    }

   return count;
}

function testingIsQuizCompleted(data, count) {
    if (count.answers === (data.length - 1)) {

        document.querySelector('.results__score').innerText = `${count.goodAnswers} / ${count.answers}`
        if (count.goodAnswers <= 0.5*count.answers) {
            document.querySelector('.results__text1').innerText = "Oh non..."
            document.querySelector('.results__text2').innerText = `${data[data.length - 1].resultBad}`
            document.querySelector(".results > img").setAttribute("src" , `${data[data.length - 1].imgBad}`)
        }

        else if (count.goodAnswers <= 0.8*count.answers) {
            document.querySelector('.results__text1').innerText = "Pas mal !"
            document.querySelector('.results__text2').innerText = `${data[data.length - 1].resultAvg}`
            document.querySelector(".results > img").setAttribute("src" , `${data[data.length - 1].imgAvg}`)
        }

        else {
            document.querySelector('.results__text1').innerText = "Bravo !"
            document.querySelector('.results__text2').innerText = `${data[data.length - 1].resultGood}`
            document.querySelector(".results > img").setAttribute("src" , `${data[data.length - 1].imgGood}`)
        }

        //Affichage du bloc
        const results = document.querySelector('.results')
        results.style.display = "block"
    }
}

function add(a,b) {
    return a+b
}

module.exports = {
    add
}
