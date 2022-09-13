import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader: string | string[] = req.headers['authorization'];
    if (!authHeader) {
        res.status(401);
    }
    if (typeof authHeader === 'string') {
        const token = authHeader.split(' ')[1];
        await jwt.verify(token, process.env.ACCESS_TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.status(401);
            }
            next();
        });
    }
};