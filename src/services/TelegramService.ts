import { User } from '../db/models/user';
import { constant } from '../utils/constant';
import dotenv from 'dotenv';

dotenv.config();

class TelegramService {
    private client: any; // Replace 'any' with the actual type if known

    constructor(client: any) { // Replace 'any' with the actual type if known
        this.client = client;
    }

    async _findProfile(age: number, gender: string, history: string[], city: string) {
        if (gender === constant.BUTTON_TEXT.women) gender = constant.BUTTON_TEXT.woman;
        else if (gender === constant.BUTTON_TEXT.men) gender = constant.BUTTON_TEXT.man;

        let result = await User.find({ gender, status: true, city });

        if (!result.length) { // Check if result is empty
            result = await User.find({ gender, status: true });
        }
        const minAge = parseInt(process.env.MIN_AGE || '0');
        const maxAge = parseInt(process.env.MAX_AGE || '0');

        for (const user of result) {
            if (!history.includes(user.chatId)) {
                if (user.age >= (age - minAge) && user.age <= (age +maxAge)) {
                    return user; // Return the first matched user
                }
            }
        }

        return null; // Return null if no suitable profile is found
    }

    async _getMemberUsername(ctx: any, userId: string): Promise<string> {
        const chat = await ctx.telegram.getChat(userId);
        ctx.session.username = chat.first_name;
        return ctx.session.username;
    }

    async _getPrivateForwardsType(ctx: any): Promise<boolean> {
        const chat = await ctx.telegram.getChat(ctx.chat.id);
        ctx.session.has_private_forwards = chat?.has_private_forwards ?? false;
        return ctx.session.has_private_forwards;
    }
}

export default TelegramService;
