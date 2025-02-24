import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log("Inside middleware",token);
    
    if(!token){
        res.status(401).json({message: "Access Denied"});
        return;
    }

    try{
        const verified = jwt.verify(token, process.env.JWT_SECRET as string);
        (req as any).user = verified;
        next();
    } catch(error){
        res.status(401).json({error: "Invalid or Expired Token"});
    }
}