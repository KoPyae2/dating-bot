import { Like, LikeType } from "../db/models/like";
import { Session } from "../db/models/session";
import { User, UserType } from "../db/models/user";

// Define interfaces for the parameters used in methods
interface SaveSessionParams {
    key: string;
    data: any;
}

interface LoadSessionParams {
    key: string;
}

interface CheckUserParams {
    chatId: string;
}

interface NewLikeParams {
    userId: string;
    memberId: string;
}

interface NewLikeMessageParams extends NewLikeParams {
    message: string;
}

interface CheckLikesParams {
    memberId: string;
}

interface PushHistoryParams {
    ctx: any;
    memberId: string;
}

export class DatabaseHelper {
    private constructor() {
        throw new ReferenceError(`Class ${this.constructor.name} cannot be initialized!`);
    }

    static async saveSession({ key, data }: SaveSessionParams): Promise<void> {
        await Session.findOneAndUpdate({ key }, { data }, { upsert: true });
    }

    static async loadSession({ key }: LoadSessionParams): Promise<any> {
        const session = await Session.findOne({ key });
        return session?.data || {}; // Ensure a safe fallback to an empty object
    }

    static async checkUser({ chatId }: CheckUserParams): Promise<UserType | null> {
        return await User.findOne({ chatId }).exec();
    }

    static async newLike({ userId, memberId }: NewLikeParams) {
        const like = new Like({ userId, memberId, status: true });
        return await like.save();
    }

    static async newLikeMessage({ userId, memberId, message }: NewLikeMessageParams) {
        const like = new Like({ userId, memberId, status: true, message });
        return await like.save();
    }

    static async checkLikes({ memberId }: CheckLikesParams):Promise<LikeType | null> {
        return await Like.findOne({ memberId, status: true }).exec();
    }

    static async pushHistory({ ctx, memberId }: PushHistoryParams): Promise<void> {
        if (ctx.session.history) {
            ctx.session.history.push(memberId);
        } else {
            ctx.session.history = [memberId]; // Initialize history if undefined
        }
    }
}
