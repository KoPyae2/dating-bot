import { Schema, model,Document } from 'mongoose';

export interface LikeType extends Document {
    userId: string;
    memberId: string;
    status: boolean,
    message: string
}

const likeSchema = new Schema<LikeType>({
    userId: {type: String, required: true},
    memberId: {type: String, required: true},
    status: {type: Boolean, required: true},
    message: {type: String}
});

export const Like = model<LikeType>('Like', likeSchema);