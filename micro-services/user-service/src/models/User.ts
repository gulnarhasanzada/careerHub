import mongoose, {Schema, Document} from "mongoose";
import { User as IUser, UserRole } from "@career-hub/shared-types";


export interface UserDocument extends Omit<IUser, 'id'>, Document {
    _id: mongoose.Types.ObjectId;
}

const UserSchema = new Schema<UserDocument>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.USER
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    lastLoginAt: {
        type: Date
    }
}, {
  timestamps: true
});

// Convert _id to id and remove __v for responses
UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    const { _id, __v, ...rest } = ret;
    return {
      id: _id.toString(),
      ...rest
    };
  }
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);