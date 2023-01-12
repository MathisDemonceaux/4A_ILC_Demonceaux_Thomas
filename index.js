import express from 'express';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let transactions = [];
let personnes = [];

app.get('/', (req,res)=>{
    return res.send(transactions);
});

app.get('/personnes', (req, res) => {
  return res.send(personnes);
});

app.get('/transactions', (req, res) => {
    return res.send(transactions);
  });

app.post('/personnes', (req, res) => {
    const personne = {
        id: personnes.length + 1,
        nom: req.body.nom,
        prenom: req.body.prenom,
        solde: parseInt(req.body.solde || 0) 
    }
    personnes.push(personne);
    return res.send(personne);
});

app.post('/transactions', (req, res) => {
    const P1 = personnes.find(p => p.id === parseInt(req.body.P1));
    const P2 = personnes.find(p => p.id === parseInt(req.body.P2));
    if(!P1 || !P2 || P1.solde-parseInt(req.body.somme) >=0){
        const transaction = {
            P1: req.body.P1,
            P2: req.body.P2,
            t: Date.now(),
            s: parseInt(req.body.somme)
        }
        P1.solde = P1.solde - parseInt(req.body.somme);
        P2.solde = P2.solde + parseInt(req.body.somme);
        transactions.push(transaction);
        return res.send(transaction);
    }
    else{
        return res.status(404).send('La personne P1 n\'a pas assez d\'argent');
    }
});

app.delete('/personnes/:id', (req, res) => {
    const personne = personnes.find(p => p.id === parseInt(req.params.id));
    if (!personne) {
        return res.status(404).send('La personne n\'existe pas');
    }
    else {
        const index = personnes.indexOf(personne);
        personnes.splice(index, 1);
        return res.send(personne);
    }
});


app.listen(3000);