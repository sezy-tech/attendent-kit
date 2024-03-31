import { Types } from "mongoose";

export interface JwtPayload {
    id: string
    username: string;
    role: number;
}