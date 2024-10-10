import { Schema, model } from 'mongoose';

export interface SessionType {
    key: string;
    data: object;
}

const sessionSchema = new Schema<SessionType>({
    key: { type: String, unique: true, required: true },
    data: { type: Object, required: true },
});

export const Session = model<SessionType>('Session', sessionSchema);