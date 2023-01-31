// import the required modules
import crypto from 'crypto';
import express from 'express';
import bodyParser from 'body-parser';
import csv from 'csv-parser';

// create express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// define the storage for the data
let transactions = [];
let personnes = [];

// get all transactions sorted by timestamp
app.get('/', (req, res) => {
    return res.send(transactions.slice().sort((a, b) => b.t - a.t));
});

// get all poeple
app.get('/personnes', (req, res) => {
    return res.send(personnes);
});

// get all transactions
app.get('/transactions', (req, res) => {
    return res.send(transactions);
});

// get all transactions for a person
app.get('/transactions/:idPersonne', (req, res) => {
    // this returns transactions where idPersonne is either P1 or P2
    return res.send(transactions.filter(t => t.P1 === parseInt(req.params.idPersonne) || t.P2 === parseInt(req.params.idPersonne)));
});

// get transactions for a specific person (sorted by date)
app.get('/soldePersonne/:idPersonne', (req, res) => {
    // this finds the person with the id idPersonne and returns its balance
    const P1 = personnes.find(p => p.id === parseInt(req.params.idPersonne));
    return res.send(P1.solde);
});

// get the balance of a person
app.post('/personnes', (req, res) => {
    // we create a new person with the data sent in the request
    const personne = {
        id: personnes.length + 1,
        nom: req.body.nom,
        prenom: req.body.prenom,
        solde: parseInt(req.body.solde || 0)
    }
    // we add the new person to the list of people
    personnes.push(personne);
    // we return the new person
    return res.status(201).send(personne);
});

// create a new transaction
app.post('/transactions', (req, res) => {
    // we find the two persons involved in the transaction
    const P1 = personnes.find(p => p.id === parseInt(req.body.P1));
    const P2 = personnes.find(p => p.id === parseInt(req.body.P2));
    // we check that the two persons exist and that P1 has enough money
    if (!P1 || !P2 || P1.solde - parseInt(req.body.somme) >= 0) {
        // we create the transaction
        let transaction = {
            P1: req.body.P1,
            P2: req.body.P2,
            t: null,
            s: parseInt(req.body.somme)
        }
        // if no date is provided, we use the current date
        if (!req.body.date) {
            transaction.t = Date.now();
        }
        else {
            transaction.t = req.body.date;
        }
        // we compute the hash of the transaction
        const hashContent = `${transaction.P1},${transaction.P2},${transaction.s},${transaction.t}`;
        transaction.h = crypto.createHash('sha256').update(hashContent).digest('hex');
        // we update the balance of the two persons
        P1.solde = P1.solde - parseInt(req.body.somme);
        P2.solde = P2.solde + parseInt(req.body.somme);
        // we add the transaction to the list of transactions
        transactions.push(transaction);
        // and we return the transaction
        return res.status(201).send(transaction);
    }
    else {
        // if P1 does not have enough money, we return an error
        return res.status(403).send('La personne P1 n\'a pas assez d\'argent');
    }
});

// delete a person
app.delete('/personnes/:id', (req, res) => {
    // we find the person to delete
    const personne = personnes.find(p => p.id === parseInt(req.params.id));
    // if the person does not exist, we return an error
    if (!personne) {
        return res.status(404).send('La personne n\'existe pas');
    }
    else {
        // else we delete the person
        const index = personnes.indexOf(personne);
        personnes.splice(index, 1);
        // and we return the deleted person
        return res.send(personne);
    }
});

// post a CSV file to import people in the database
app.post('/importPersonnes', (req, res) => {
    // we parse the CSV file from the request
    req
        .pipe(csv())
        .on('data', (row) => {
            // and we add each person to the list of people
            personnes.push(row);
        })
        .on('end', () => {
            res.send(personnes);
        });
});

// post a CSV file to import transactions in the database
app.post('/importTransactions', (req, res) => {
    // we parse the CSV file from the request
    req
        .pipe(csv())
        .on('data', (row) => {
            // and we add each transaction to the list of transactions, with its computed hash
            transactions.push({
                ...row,
                h: crypto.createHash('sha256').update(`${row.P1},${row.P2},${row.s},${row.t}`).digest('hex')
            });
        })
        .on('end', () => {
            // we return the list of transactions at the end
            res.send(transactions);
        });
});

// verify the hash of a transaction
app.post('/verifierTransaction', (req, res) => {
    // we find the transaction with the hash h
    const transaction = transactions.find(t => t.h === req.body.h);
    // if the transaction does not exist, we return an error
    if (!transaction) {
        return res.status(404).send('La transaction n\'existe pas');
    }
    else {
        // else we compute the hash of the transaction
        const hashContent = `${transaction.P1},${transaction.P2},${transaction.s},${transaction.t}`;
        const hash = crypto.createHash('sha256').update(hashContent).digest('hex');
        // and we compare it to the hash in the transaction
        if (hash === transaction.h) {
            return res.send('La transaction est valide');
        }
        else {
            return res.status(400).send('La transaction est invalide');
        }
    }
});

// start the server on port 3000
app.listen(3000, () => {
    console.log('Server is up and running on port number 3000');
});
