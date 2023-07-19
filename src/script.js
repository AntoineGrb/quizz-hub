//SCRIPT AFFICHER LE QUIZZ
    //Récupérer le fichier de données
    async function fetchData() {
        try {
            const response = await fetch("../src/data/data-quizz-onepiece.json");
            
            if (!response.ok) {
                throw new Error("Erreur réseau ou fichier non trouvé");
            }
    
            const data = await response.json();
            console.log(data);
            deployData(data)
    
        } catch (error) {
            console.error("Erreur lors de la récupération du JSON:", error);
        }
    }
    
    fetchData();

    //Déployer le quizz sur le DOM
    function deployData(data) {
        const main = document.querySelector("main")
        for (let i=0 ; i < data.length ; i++ ) {
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
        responseToQuiz();
    }
    

//SCRIPT REPONDRE AU QUIZZ
function responseToQuiz() {
    let count = 0;
    let score = 0;

    let inputs = document.querySelectorAll("input")
    inputs.forEach(input => {
        input.addEventListener("click" , (e) => {
            //Récupère les id de la réponse et de la question
            const id = e.target.getAttribute("id")
            const questionId = id.slice(0,2)
            const answerId = `a${id.slice(1,2)}`

            //Déterminer si la réponse est bonne ou fausse
            const label = document.querySelector(`label[for='${id}']`)
            const labelClass = label.getAttribute("class")

            //Comportement du DOM après réponse
            label.classList.toggle("checked")
            const answer = document.querySelector(`.${answerId}`)
            answer.style.display = "block"
            
            if (labelClass === "label-true") {
                answer.style.borderColor = "green"
                document.querySelector(`.${answerId} p`).innerText = "👏 Correct !"
                document.querySelector(`.${answerId} p`).style.color = "seagreen"

                //Compteur
                count++
                score++
            }
            else if (labelClass === "label-false") {
                answer.style.borderColor = "red"
                document.querySelector(`.${answerId} p`).innerText = "👎 Faux !"
                document.querySelector(`.${answerId} p`).style.color = "rgb(190, 39, 47)"

                //Compteur
                count++
            }
            else return

            //Désactiver les checkboxes après la réponse
            const questionInputs = document.querySelectorAll(`.${questionId} input`);
            questionInputs.forEach(input => {
                input.setAttribute("disabled" , "disabled")
            })

            //Résultats finaux
            console.log("count : " , count , "score : " , score)
            if (count === 8) {

                document.querySelector('.results__score').innerText = `${score} / ${count}`
                if (score <= 4) {
                    document.querySelector('.results__text1').innerText = "Oh non..."
                    document.querySelector('.results__text2').innerText = "Tu ne connais pas du tout ton sujet ! C’est dommage… On ne peut pas dire que tu sois fan de One Piece."
                    document.querySelector(".results > img").setAttribute("src" , "../Images/baggy-enervé.gif")
                }

                else if (score <= 6) {
                    document.querySelector('.results__text1').innerText = "Pas mal !"
                    document.querySelector('.results__text2').innerText = "Tu maitrise bien ton sujet, on voit bien que apprécie One Piece mais il te reste du chemin avant de devenir un vrai mugiwara."
                    document.querySelector(".results > img").setAttribute("src" , "../Images/sanji-pouce.gif")
                }

                else {
                    document.querySelector('.results__text1').innerText = "Bravo !"
                    document.querySelector('.results__text2').innerText = "Tu maitrise parfaitement ton sujet ! On voit bien que tu es un grand fan de One Piece."
                    document.querySelector(".results > img").setAttribute("src" , "../Images/sanji-heureux.gif")
                }

                //Affichage du bloc
                const results = document.querySelector('.results')
                results.style.display = "block"
            }
        })
    })
}
