const {getPathName, fetchData, countScores} = require('./script');

//Tester la fonction getPathName
describe("Tester la fonction getPathName pour récupérer l'url" , () => {

    it("Dois retourner le fileName quizz-harrypotter.html à partir d'un pathName" , () => {
        const pathName = 'quizz-harrypotter.html';
        expect(getPathName(pathName)).toBe('quizz-harrypotter');
    });
});

//Tester la fonction fetchData
describe("Tester la fonction fetchData pour récupérer les datas des JSON" , () => {

    it('Dois retourner des données' , async () => {
        //Mocker la réponse de la fonction fetch()
        const mockJsonData = {data:"testData"}; //Simulation d'un résultat d'API avec fetch
        fetch.mockResponseOnce(JSON.stringify(mockJsonData)); //Cette fonction configure la fonction fetch globale pour qu'elle retourne la réponse mockJsonData la prochaine fois qu'elle est appelée

        //Appeler notre fonction fetchData()
        const pathName = 'testPath'; //Peu importe ce qu'on met ici, la réponse sera attendue car mockée
        const data = await fetchData(pathName); //On appelle fetchData(). Vu que la fonction fetch() est mockée, elle va retourner la valeur prévue dans mockJsonData.

        expect(data).toEqual(mockJsonData); //On s'attend à ce que le rendu de la fonction soit égal aux data mockées.
        expect(fetch).toHaveBeenCalledWith(`../src/data/data-${pathName}.json`); //Vérifie que l'appel à fetch() a bien été fait par l'url prévue dans la fonction fetchData()
    });

    it('Dois retourner une erreur Erreur réseau ou fichier non trouvé' , async () => {
        fetch.mockReject(new Error ('Erreur réseau'));

        const pathName = 'testPath';
        await expect(fetchData(pathName)).rejects.toThrow('Erreur réseau');
    });
});

//Tester la fonction deployData (?)

//Tester la fonction getReponseInfo
//! Ne marche pas à cause de la config de jsdom, impossible de faire marcher malgré les installations
// describe("Tester la fonction getResponseInfo qui doit retourner les bonnes infos sur la réponse" , () => {

//     //Avant chaque test, créer un mock du DOM
//     beforeEach(() => {
//         document.body.innerHTML = `<label for="q2r4" class="label-true">Choix 1</label>`;
//     });

//     it("Dois retourner les bons éléments" , () => {
//         const id = "q2r4";
//         const responseInfos = getResponseInfos(id);

//         expect(responseInfos.questionId).toBe('q2');
//         expect(responseInfos.answerId).toBe('a4');
//         expect(responseInfos.labelElementClassValue).toBe('label-true');
//     });
// });

//Tester la fonction countScores
describe("Tester la fonction countScores" , () => {

    it("Dois incrémenter answers et goodAnswers en cas de bonne réponse" , () => {
        const responseInfos = {labelElementClassValue: "label-true"};
        let count = {answers:0, goodAnswers:0};

        count = countScores(responseInfos, count);

        expect(count.answers).toBe(1);
        expect(count.goodAnswers).toBe(1);
    });

    it("Dois incrémenter answers uniquement en cas de mauvaise réponse" , () => {
        const responseInfos = {labelElementClassValue: "label-false"};
        let count = {answers:0, goodAnswers:0};
        
        count = countScores(responseInfos, count);

        expect(count.answers).toBe(1);
        expect(count.goodAnswers).toBe(0);
    });
});


