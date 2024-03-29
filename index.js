const express = require('express');
const app = express();
var cors = require("cors")
const { Hercai } = require('hercai');
require('dotenv').config();
const apiKey = process.env.HERCAI_API_KEY;

const herc = new Hercai(apiKey); 

const allowedOrigins = ['https://www.merttaylan.dev'];

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        next();
    } else {
        res.status(403).send('Access Denied');
    }
});

const PORT = 8080;

app.use(express.json());

app.use(cors());

async function getResponse(questionTemp, userId){
    let response = await herc.betaQuestion({content:questionTemp, user: userId});
    return response.reply;        
} 

app.post('/Question', async (req, res) => {
    const { question, user } = req.body;
    let answer = await getResponse(question, user);
    if(answer == null){
        answer = "I don't know";
    }
    res.status(200).send(answer);
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`)
});
