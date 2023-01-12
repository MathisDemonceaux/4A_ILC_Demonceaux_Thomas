import express from 'express';

const app = express();

let tuples = []
app.get('/', (req,res)=>{
    return res.send(tuples);
});

app.listen(3000);