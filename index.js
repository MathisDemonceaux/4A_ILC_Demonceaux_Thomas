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
app.post('/personnes', (req, res) => {
    const personne = {
        id: personnes.length + 1,
        nom: req.body.nom,
        prenom: req.body.prenom,
    }
    personnes.push(personne);
    return res.send(personne);
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