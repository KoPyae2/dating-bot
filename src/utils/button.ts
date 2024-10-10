import { Markup } from 'telegraf';
import { constant } from './constant';

export const startButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.button_yes, constant.BUTTON_TEXT.button_no]
    ])
        .oneTime()
        .resize();

export const genderButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.man, constant.BUTTON_TEXT.woman],
    ])
        .oneTime()
        .resize()

export const wantedGenderButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.men, constant.BUTTON_TEXT.women],
    ])
        .oneTime()
        .resize()

export const wantedLocationButton =
    Markup.keyboard([
        [{ text: 'Share your location', request_location: true }],
    ])
        .oneTime()
        .resize()

export const descriptionButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.skip],
    ])
        .oneTime()
        .resize()

export const approveButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.yes, constant.BUTTON_TEXT.change],
    ])
        .oneTime()
        .resize()

export const menuButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.view_profiles, constant.BUTTON_TEXT.my_profile, constant.BUTTON_TEXT.likes, constant.BUTTON_TEXT.hide_profile],
    ])
        .oneTime()
        .resize()

export const profileButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.change_profile, constant.BUTTON_TEXT.change_photo_profile, constant.BUTTON_TEXT.change_text_profile, constant.BUTTON_TEXT.return_menu],
    ])
        .oneTime()
        .resize()

export const hideButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.yes, constant.BUTTON_TEXT.no],
    ])
        .oneTime()
        .resize()

export const returnMenuButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.return_menu],
    ])
        .oneTime()
        .resize()

export const viewProfileButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.view_like, constant.BUTTON_TEXT.view_message, constant.BUTTON_TEXT.view_unlike, constant.BUTTON_TEXT.return_menu],
    ])
        .oneTime()
        .resize()

export const likeButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.view_like, constant.BUTTON_TEXT.view_unlike],
    ])
        .oneTime()
        .resize()

export const waitButton =
    Markup.keyboard([
        [constant.BUTTON_TEXT.view_profiles],
    ])
        .oneTime()
        .resize()