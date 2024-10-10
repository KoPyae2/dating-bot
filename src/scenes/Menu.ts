import { Scenes } from "telegraf";
import { constant } from "../utils/constant";
import { hideButton, likeButton, menuButton, profileButton, returnMenuButton, viewProfileButton, waitButton } from "../utils/button";
import TelegramService from "../services/TelegramService";
import { DatabaseHelper } from "../helpers/dbHelper";

export class MenuSceneGenerator {

    Main() {
        const main = new Scenes.BaseScene('main');

        main.enter(async (ctx: any) => {
            await ctx.reply(constant.SCENES_TEXT.main_enter, {
                ...menuButton
            });
        });

        main.on('text', async (ctx: any) => {
            switch (ctx.message.text) {
                case constant.BUTTON_TEXT.view_profiles:
                    await ctx.scene.enter('view');
                    break;
                case constant.BUTTON_TEXT.my_profile:
                    await ctx.scene.enter('profile');
                    break;
                case constant.BUTTON_TEXT.likes:
                    await ctx.scene.enter('likes');
                    break;
                case constant.BUTTON_TEXT.hide_profile:
                    await ctx.scene.enter('hide');
                    break;
                default:
                    await ctx.reply(constant.SCENES_TEXT.register_wrong_asnwer);
                    break;
            }

        });

        return main;
    }


    View() {
        const view = new Scenes.BaseScene('view');

        view.enter(async (ctx: any) => {
            const telegram = new TelegramService(ctx);
            const isPrivate = await telegram._getPrivateForwardsType(ctx);

            if (isPrivate) {
                await ctx.reply(constant.SCENES_TEXT.private_forwards);
                return await ctx.scene.enter('main');
            }
            const { age, wantedGender, history, city } = ctx.session;
            const result = await telegram._findProfile(age, wantedGender, history, city);
            if (result) {
                const { chatId, name, age, city, description, photo } = result;
                ctx.session.memberId = chatId;
                console.log(11111, ctx.session.memberId);


                if (description != constant.BUTTON_TEXT.skip) await ctx.replyWithPhoto({ url: photo }, { caption: `Name - ${name}\nAge - ${age}\nCity - ${city}\nAbout - ${description}`, ...viewProfileButton });
                else await ctx.replyWithPhoto({ url: photo }, { caption: `Name - ${name}\nAge - ${age}\nCity - ${city}`, ...viewProfileButton });
            } else {
                await ctx.reply(constant.SCENES_TEXT.view_error);
                return ctx.scene.enter('main');
            }
        });
        view.on('text', async (ctx: any) => {
            try {
                switch (ctx.message.text) {
                    case constant.BUTTON_TEXT.view_like:
                        await DatabaseHelper.newLike({ userId: ctx.chat.id, memberId: ctx.session.memberId });
                        await ctx.telegram.sendMessage(ctx.session.memberId, constant.SCENES_TEXT.view_like);
                        await DatabaseHelper.pushHistory({ ctx: ctx, memberId: ctx.session.memberId });
                        await ctx.scene.enter('view');
                        break;
                    case constant.BUTTON_TEXT.view_message:
                        await DatabaseHelper.pushHistory({ ctx: ctx, memberId: ctx.session.memberId });
                        await ctx.scene.enter('viewmessage');
                        break;
                    case constant.BUTTON_TEXT.view_unlike:
                        await DatabaseHelper.pushHistory({ ctx: ctx, memberId: ctx.session.memberId });
                        await ctx.scene.enter('view');
                        break;
                    case constant.BUTTON_TEXT.return_menu:
                        await ctx.scene.enter('main');
                        break;
                    default:
                        await ctx.reply(constant.SCENES_TEXT.register_wrong_asnwer);
                        break;
                }
            }
            catch (err) {
                console.log('error in view', err);
            }
        });

        return view;
    }

    ViewMessage() {
        const view_message = new Scenes.BaseScene('viewmessage');

        view_message.enter(async (ctx: any) => {
            await ctx.reply(constant.SCENES_TEXT.view_message_enter);
        });

        view_message.on('text', async (ctx: any) => {
            await DatabaseHelper.newLikeMessage({ userId: ctx.chat.id, memberId: ctx.session.memberId, message: ctx.message.text });
            try {
                await ctx.telegram.sendMessage(ctx.session.memberId, constant.SCENES_TEXT.view_like);
            }
            catch (err) {
                console.log('error in view message', err);
            }
            await ctx.scene.enter('view');
        });

        view_message.on('message', async (ctx) => {
            return await ctx.reply(constant.SCENES_TEXT.view_message_error);
        });

        return view_message;
    }

    Profile() {
        const profile = new Scenes.BaseScene('profile');

        profile.enter(async (ctx: any) => {
            await ctx.reply(constant.SCENES_TEXT.register_approve_enter, {
                ...profileButton
            });

            const { name, age, city, description, photo } = ctx.session;



            if (description != constant.BUTTON_TEXT.skip) {
                await ctx.replyWithPhoto({ url: photo }, { caption: `Name - ${name}\nAge - ${age}\nCity - ${city}\nAbout - ${description}` });
                return await ctx.reply(constant.SCENES_TEXT.profile_enter);
            }
            else {
                await ctx.replyWithPhoto({ url: photo }, { caption: `Name - ${name}\nAge - ${age}\nCity - ${city}` });
                return await ctx.reply(constant.SCENES_TEXT.profile_enter);
            }
        });

        profile.on('text', async (ctx: any) => {
            switch (ctx.message.text) {
                case constant.BUTTON_TEXT.change_profile:
                    await ctx.scene.enter('name');
                    break;
                case constant.BUTTON_TEXT.change_photo_profile:
                    await ctx.scene.enter('newphoto');
                    break;
                case constant.BUTTON_TEXT.change_text_profile:
                    await ctx.scene.enter('newdescription');
                    break;
                case constant.BUTTON_TEXT.return_menu:
                    await ctx.scene.enter('main');
                    break;
                default:
                    await ctx.reply(constant.SCENES_TEXT.register_wrong_asnwer);
                    break;
            }
        });

        return profile;
    }

    Likes() {
        const likes = new Scenes.BaseScene('likes');
        likes.enter(async (ctx: any) => {
            const telegram = new TelegramService(ctx);
            const isPrivate = await telegram._getPrivateForwardsType(ctx);

            if (isPrivate) {
                await ctx.reply(constant.SCENES_TEXT.private_forwards);
                return await ctx.scene.enter('main');
            }

            const result = await DatabaseHelper.checkLikes({ memberId: ctx.chat.id });

            if (result) {
                const { userId, message } = result;
                const data = await DatabaseHelper.checkUser({ chatId: userId });
                if (!data) {
                    await ctx.reply(constant.SCENES_TEXT.likes_error);
                    return await ctx.scene.enter('main');
                }
                const { name, age, city, description, photo } = data;

                if (message) {
                    if (description != constant.BUTTON_TEXT.skip) await ctx.replyWithPhoto({ url: photo }, { caption: `${constant.SCENES_TEXT.likes_enter}\n\nName  - ${name}\nAge - ${age}\nCity - ${city}/nAbout - ${description}\n\n${constant.SCENES_TEXT.likes_message_for_you} ${message}`, ...likeButton });
                    else await ctx.replyWithPhoto({ url: photo }, { caption: `${constant.SCENES_TEXT.likes_enter}\n\nName - ${name}\nAge - ${age}\nCity - ${city}\n\n${constant.SCENES_TEXT.likes_message_for_you} ${message}`, ...likeButton });
                } else {
                    if (description != constant.BUTTON_TEXT.skip) await ctx.replyWithPhoto({ url: photo }, { caption: `${constant.SCENES_TEXT.likes_enter}\n\nName - ${name}\nAge - ${age}\nCity - ${city}\nAbout - ${description}`, ...likeButton });
                    else await ctx.replyWithPhoto({ url: photo }, { caption: `${constant.SCENES_TEXT.likes_enter}\n\nName - ${name}\nAge - ${age}\nCity - ${city}`, ...likeButton });
                }
            } else {
                await ctx.reply(constant.SCENES_TEXT.likes_error);
                return await ctx.scene.enter('main');
            }
        });

        likes.on('text', async (ctx: any) => {
            const data = await DatabaseHelper.checkLikes({ memberId: ctx.chat.id });
            if (!data) {
                return await ctx.scene.enter('main');
            }
            const { userId, memberId } = data;

            const telegram = new TelegramService(ctx);
            const name = await telegram._getMemberUsername(ctx, userId);

            const link_member = `<a href="tg://user?id=${memberId}">${ctx.message.from.first_name}</a>`
            const link_user = `<a href="tg://user?id=${userId}">${name}</a>`

            if (ctx.message.text === constant.BUTTON_TEXT.view_like) {
                try {
                    await ctx.telegram.sendMessage(userId, constant.SCENES_TEXT.likes_message + link_member, {
                        parse_mode: 'HTML',
                    });
                }
                catch (err) {
                    console.log('error on give like', err);
                }

                await ctx.reply(constant.SCENES_TEXT.likes_message_user + link_user, {
                    parse_mode: 'HTML',
                });
                data.status = false;
                await data.save();
                return await ctx.scene.enter('likes');
            } else {
                data.status = false;
                await data.save();
                return await ctx.scene.enter('likes');
            }
        });
        return likes;
    }

    ChangePhoto() {
        const photo = new Scenes.BaseScene('newphoto');

        photo.enter(async (ctx: any) => {
            await ctx.reply(constant.SCENES_TEXT.register_enter_photo, {
                ...returnMenuButton
            });
        });

        photo.on('photo', async (ctx: any) => {
            const photoURLStart = ctx.message.photo[ctx.message.photo.length - 1].file_id;

            const photoURLEnd = `https://api.telegram.org/bot${process.env.BOT_TOKEN}/getFile?file_id=${photoURLStart}`;

            await fetch(photoURLEnd).then(async (res) => await res.text())
                .then(async (text) => {
                    const textMatch = text.match(/[a-zA-Z]*\/[a-zA-Z0-9_]*.[a-zA-Z]*/g);
                    let photoURL = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${textMatch}`;
                    ctx.session.photo = photoURL;
                    await ctx.reply(constant.SCENES_TEXT.update_photo);
                    await ctx.scene.enter('main');
                });
        });

        photo.on('message', async (ctx: any) => {
            switch (ctx.message.text) {
                case constant.BUTTON_TEXT.return_menu:
                    await ctx.scene.enter('main');
                    break;
                default:
                    await ctx.reply(constant.SCENES_TEXT.update_photo_error);
                    break;
            }
        });

        return photo;
    }

    ChangeDescription() {
        const description = new Scenes.BaseScene('newdescription');

        description.enter(async (ctx: any) => {
            await ctx.reply(constant.SCENES_TEXT.register_enter_description, {
                ...returnMenuButton
            }
            );
        });

        description.on('text', async (ctx: any) => {
            const currentDescription = ctx.message.text;

            if (currentDescription && currentDescription != constant.BUTTON_TEXT.return_menu) {
                ctx.session.description = currentDescription;
                await ctx.reply(constant.SCENES_TEXT.update_description);
                await ctx.scene.enter('main');
            } else if (currentDescription === constant.BUTTON_TEXT.return_menu) await ctx.scene.enter('main');
        });

        description.on('message', async (ctx) => {
            return await ctx.reply(constant.SCENES_TEXT.update_description_error);
        });

        return description;
    }

    Hide() {
        const hide = new Scenes.BaseScene('hide');

        hide.enter((ctx) => {
            ctx.reply(constant.SCENES_TEXT.hide_enter, {
                ...hideButton
            });
        });

        hide.on('text', async (ctx: any) => {
            switch (ctx.message.text) {
                case constant.BUTTON_TEXT.yes:
                    const data = await DatabaseHelper.checkUser({ chatId: ctx.from.id });
                    if (!data) {
                        return await ctx.scene.enter('main');
                    }

                    await ctx.reply(constant.SCENES_TEXT.hide_yes, {
                        ...waitButton
                    });

                    data.status = false;
                    data.save();

                    await ctx.scene.enter('wait');
                    break;
                case constant.BUTTON_TEXT.no:
                    await ctx.scene.enter('main');
                    break;
                default:
                    await ctx.reply(constant.SCENES_TEXT.register_wrong_asnwer);
                    break;
            }
        });

        return hide;
    }

    Wait() {
        const wait = new Scenes.BaseScene('wait');

        wait.on('text', async (ctx: any) => {
            switch (ctx.message.text) {
                case constant.BUTTON_TEXT.view_profiles:
                    const data = await DatabaseHelper.checkUser({ chatId: ctx.from.id });
                    if (!data) {
                        return await ctx.scene.enter('main');
                    }

                    await ctx.scene.enter('main');
                    data.status = true;
                    await data.save();
                    break;
                default:
                    await ctx.reply(constant.SCENES_TEXT.register_wrong_asnwer);
                    break;
            }
        });

        return wait;
    }
}