import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import csv from 'csv-parser';

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
    return res.status(201).send(personne);
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
        const hashContent = `${transaction.P1},${transaction.P2},${transaction.s},${transaction.t}`;
        transaction.h = crypto.createHash('sha256').update(hashContent).digest('hex');
        P1.solde = P1.solde - parseInt(req.body.somme);
        P2.solde = P2.solde + parseInt(req.body.somme);
        transactions.push(transaction);
        return res.status(201).send(transaction);
    }
    else {
        return res.status(403).send('La personne P1 n\'a pas assez d\'argent');
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

app.post('/importPersonnes', (req, res) => {
    req
        .pipe(csv())
        .on('data', (row) => {
            personnes.push(row);
        })
        .on('end', () => {
            res.send(personnes);
        });
});

app.post('/importTransactions', (req, res) => {
    req
        .pipe(csv())
        .on('data', (row) => {
            transactions.push({
                ...row,
                h: crypto.createHash('sha256').update(`${row.P1},${row.P2},${row.s},${row.t}`).digest('hex')
            });
        })
        .on('end', () => {
            res.send(transactions);
        });
});

app.post('/verifierTransaction', (req, res) => {
    const transaction = transactions.find(t => t.h === req.body.h);
    if (!transaction) {
        return res.status(404).send('La transaction n\'existe pas');
    }
    else {
        const hashContent = `${transaction.P1},${transaction.P2},${transaction.s},${transaction.t}`;
        const hash = crypto.createHash('sha256').update(hashContent).digest('hex');
        if (hash === transaction.h) {
            return res.send('La transaction est valide');
        }
        else {
            return res.status(400).send('La transaction est invalide');
        }
    }
});

app.listen(3000, () => {
    console.log('Server is up and running on port number 3000');
});
