import { Schema, model, Document } from 'mongoose';

export interface UserType extends Document {
    chatId: string;
    name: string;
    age: number;
    gender: string,
    wantedGender: string,
    city: string,
    description: string,
    photo: string,
    status: boolean,
    registerDate: Date
}

const userSchema = new Schema<UserType>({
    chatId: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    wantedGender: { type: String, required: true },
    city: { type: String, required: true },
    description: { type: String },
    photo: { type: String, required: true },
    status: { type: Boolean, required: true },
    registerDate: { type: Date, required: true }
});

export const User = model<UserType>('User', userSchema);