import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

// why i am getting error 401
// i have already created an account on openai.com
// i have already created an api key
// i have already created an environment variable
// i have already installed openai-api
// i have already installed dotenv
// i have already installed express
// i have already installed cors



dotenv.config();
console.log(process.env.OPENAI_API_KEY);

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}); 
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', async(req, res) => { 
    res.status(200).send({
        message: 'Hello from SmartSearch',
    });
});
app.post('/', async(req, res) => {
    try{
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
    });
    res.status(200).send({
        bot : response.data.choices[0].text,
    });
}catch(error){
    console.log(error);
    res.status(500).send({error});
}
});
app.listen(2000, () => {
    console.log('Server is running on port 2000 http://localhost:5000');
});