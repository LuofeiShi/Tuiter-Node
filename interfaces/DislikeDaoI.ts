import Dislike from "../models/dislikes/Dislike";

/**
 * @file Declares API for Dislikes related data access object methods
 */
export default interface DislikeDaoI {
    findAllTuitsDislikedByUser (tid: string, uid: string): Promise<Dislike[]>;
    userDislikesTuit (tid: string, uid: string): Promise<any>;
    userUndislikeTuit (tid: string, uid: string): Promise<any>;
    countHowManyDislikedTuit (tid: string): Promise<any>;
};