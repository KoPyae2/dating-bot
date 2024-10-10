import { Context, Scenes } from 'telegraf';
import { DatabaseHelper } from '../helpers/dbHelper';
import { constant } from '../utils/constant';
import { Message } from 'telegraf/typings/core/types/typegram';

export class StartSceneGenerator  {
    // Method to create the first step scene
    public FirstStep(): Scenes.BaseScene<Context> {
        const start = new Scenes.BaseScene<Context>('start');

        start.on('text', async (ctx: any) => {
            const message = ctx.message as Message.TextMessage;
            if(message && message.text && ctx.from){
                if (message.text === constant.BUTTON_TEXT.button_yes) {
                    const chatId = ctx.from.id.toString(); 
                    const data = await DatabaseHelper.checkUser({ chatId });
                    if (data && data.status === false) {
                        await ctx.reply(constant.SCENES_TEXT.comeback_profile);
                        // await ctx.scene.enter('main');
                        data.status = true;
                        // await data.save(); // Ensure save is awaited
                    } else if (data && data.status === true) {
                        await ctx.reply(constant.SCENES_TEXT.start_already_registed);
                        // await ctx.scene.enter('main');
                    } else {
                        await ctx.scene.enter('name');
                    }
                } else {
                    await ctx.reply(constant.SCENES_TEXT.start_no);
                    await ctx.scene.reenter();
                }
            }
        });

        return start;
    }
}

