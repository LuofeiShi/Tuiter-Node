import {Request, Response} from "express";

export default interface DislikeControllerI {
    findAllTuitsDislikedByUser (req: Request, res: Response): void;
    // userDislikesTuit (req: Request, res: Response): void;
    // userUndislikeTuit (req: Request, res: Response): void;
    // countHowManyDislikedTuit (req: Request, res: Response): void;
    userTogglesTuitDislikes (req: Request, res: Response): void;
};