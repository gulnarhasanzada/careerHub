import bcrypt, { compare } from "bcrypt";

const SALT_ROUNDS = 12;

export const hashPassword = async (password: string): Promise<string> => {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    return bcrypt.hash(password, salt);
}

export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(password, hashedPassword);
}

export const validatePassword = (password: string): {isValid: boolean, errors: string[]}=>{
    const errors: string[] = [];

    if(password.length < 8){
        errors.push("Password must be at least 8 characters long")
    }

    if(!/[A-Z]/.test(password)){
        errors.push('Password must contain at least one uppercase letter');
    }

    if(!/[a-z]/.test(password)){
        errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
        errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {isValid: errors.length === 0, errors}
}

