import { UserRole } from "@career-hub/shared-types";
import { UserDocument, UserModel } from "../models/User";

export interface UserData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
}

export class UserService {
    static async findByEmail(email: string): Promise<UserDocument | null>{
        return UserModel.findOne({ email: email.toLowerCase() });
    }

    static async findById(id: string): Promise<UserDocument | null>{
        return UserModel.findById(id);
    }

    static async createUser(userData: UserData): Promise<UserDocument>{
        const newUser = new UserModel({
            ...userData,
            email: userData.email.toLowerCase()
        });

        return newUser.save();
    }

    static async updateLastLogin(userId: string): Promise<void> {
        await UserModel.findByIdAndUpdate(userId, {
            lastLoginAt: new Date(),
            updatedAt: new Date()
        })
    }

    static async emailExists(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return !!user;
    }
}