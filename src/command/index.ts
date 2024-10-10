import { constant } from '../utils/constant';
import { startButton } from '../utils/button';

// Define the start function with proper type annotations
export const start = async (ctx: any): Promise<void> => {
    await ctx.reply(constant.CMD_TEXT.start, {
        ...startButton,
    });
    await ctx.scene.enter('start');
}

