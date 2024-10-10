import mongoose from 'mongoose';
import { Scenes, Telegraf } from 'telegraf';
import { session } from 'telegraf-session-mongodb';
import { DatabaseHelper } from '../helpers/dbHelper';
import { start } from '../command';
import { StartSceneGenerator } from '../scenes/Start';
import { RegisterSceneGenerator } from '../scenes/Register';
import { MenuSceneGenerator } from '../scenes/Menu';
import dotenv from 'dotenv';
dotenv.config();


const bot = new Telegraf(process.env.BOT_TOKEN as string);

const startSceneGenerator = new StartSceneGenerator();
const registerSceneGenerator = new RegisterSceneGenerator();
const menuSceneGenerator = new MenuSceneGenerator();
const firstScene = startSceneGenerator.FirstStep();
const nameScene = registerSceneGenerator.GetName();
const ageScene = registerSceneGenerator.GetAge();
const genderScene = registerSceneGenerator.GetGender();
const wantedGender = registerSceneGenerator.GetWantedGender()
const cityScene = registerSceneGenerator.GetCity();
const descriptionScene = registerSceneGenerator.GetDescription();
const photoScene = registerSceneGenerator.GetPhoto();
const approveScene = registerSceneGenerator.ApproveRegister();
const mainScene = menuSceneGenerator.Main();
const viewScene = menuSceneGenerator.View();
const viewMessageScene = menuSceneGenerator.ViewMessage();
const profileScene = menuSceneGenerator.Profile();
const likesScene = menuSceneGenerator.Likes();
const updateProfileScene = menuSceneGenerator.ChangePhoto();
const updateDescriptionsScene = menuSceneGenerator.ChangeDescription();
const hideScene = menuSceneGenerator.Hide();
const waitScene = menuSceneGenerator.Wait();

const stage = new Scenes.Stage<any>(
    [
        firstScene,
        nameScene,
        ageScene,
        genderScene,
        wantedGender,
        cityScene,
        descriptionScene,
        photoScene,
        approveScene,
        mainScene,
        viewScene,
        viewMessageScene,
        profileScene,
        likesScene,
        updateProfileScene,
        updateDescriptionsScene,
        hideScene,
        waitScene
    ]
);

export const setupBot = async () => {
    if (mongoose.connection.readyState !== 1) {
        throw new Error('Mongoose is not connected. Please connect to the database first.');
    }
    // Get the MongoDB Db instance from Mongoose connection
    const db = mongoose.connection.db;
    if (!db) {
        throw new Error('Database connection is not available.');
    }

    // Set up the session middleware with Mongoose Db instance
    bot.use(session(db, { collectionName: "sessions" }));
    bot.use(stage.middleware());

    bot.use(async (ctx: any, next) => {
        const sessionId = ctx.from?.id?.toString();
        if (!sessionId) {
            return next(); // Proceed to the next middleware if there is no session ID
        }

        // Load the session for the user
        ctx.session = await DatabaseHelper.loadSession({ key: sessionId });
        await next(); // Call the next middleware
        // Save the session after processing the command
        await DatabaseHelper.saveSession({ key: sessionId, data: ctx.session });
    });

    // Start command handler
    bot.start(start);

    return bot;
}