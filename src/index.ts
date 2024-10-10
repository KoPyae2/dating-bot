import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './db';
import { setupBot } from './bot';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express & TypeScript Server');
});

app.listen(port, async () => {
    
    
    await connectToDatabase();

    console.log(`🔥 Server is running on http://localhost:${port} 🔥`);
    console.log('============================');

    const bot = await setupBot();
    bot.launch();
    console.log('🚀 Telegram is Ready 🚀');
    console.log('============================');
});