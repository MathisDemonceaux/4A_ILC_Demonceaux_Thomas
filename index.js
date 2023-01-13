import express from 'express';
import bodyParser from 'body-parser';
import { fs } from 'fs';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let transactions = [];
let personnes = [];

app.get('/', (req, res) => {
    return res.send(transactions.slice().sort((a, b) => b.t - a.t));
});

app.get('/personnes', (req, res) => {
    return res.send(personnes);
});

app.get('/transactions', (req, res) => {
    return res.send(transactions);
});
app.get('/transactions/:idPersonne', (req, res) => {
    return res.send(transactions.filter(t => t.P1 === parseInt(req.params.idPersonne) || t.P2 === parseInt(req.params.idPersonne)));
});

app.get('/soldePersonne/:idPersonne', (req, res) => {
    const P1 = personnes.find(p => p.id === parseInt(req.params.idPersonne));
    return res.send(P1.solde);
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
    if (!P1 || !P2 || P1.solde - parseInt(req.body.somme) >= 0) {
        let transaction = {
            P1: req.body.P1,
            P2: req.body.P2,
            t: null,
            s: parseInt(req.body.somme)
        }
        if (!req.body.date) {
            transaction.t = Date.now();
        }
        else {
            transaction.t = req.body.date;
        }
        P1.solde = P1.solde - parseInt(req.body.somme);
        P2.solde = P2.solde + parseInt(req.body.somme);
        transactions.push(transaction);
        return res.send(transaction);
    }
    else {
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
//open a csv file an import data in personnes
app.get('/importPersonnes', (req, res) => {
    const fs = require('fs');
    const csv = require('csv-parser');
    //open csv fil name personnes.csv and import data in personnes
    fs.createReadStream('personnes.csv')
        .pipe(csv())
        .on('data', (row) => {
            personnes.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
        });
});



app.listen(3000);