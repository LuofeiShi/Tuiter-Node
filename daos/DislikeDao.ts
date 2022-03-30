/**
 * @file Implements DAO managing data storage of Dislike. Uses mongoose DislikeModel
 * to integrate with MongoDB
 */
import DislikeDaoI from "../interfaces/DislikeDaoI";
import DislikeModel from "../mongoose/dislikes/DislikeModel";
import Dislike from "../models/dislikes/Dislike";

/**
 * @class DislikeDao Implements Data Access Object managing data storage
 * of Users
 * @property {DislikeDao} DislikeDao Private single instance of DislikeDao
 */
export default class DislikeDao implements DislikeDaoI {
    private static dislikeDao: DislikeDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns DislikeDao
     */
    public static getInstance = (): DislikeDao => {
        if(DislikeDao.dislikeDao === null) {
            DislikeDao.dislikeDao = new DislikeDao();
        }
        return DislikeDao.dislikeDao;
    }

    private constructor() {}

    /**
     * Check if there's a dislike document in the database for user/tuit combination
     * @param {string} uid the primary key of a user
     * @param {string} tid the primary key of a tuit
     * @returns Promise To be notified if the user dislikes the given tuit
     */
    findAllTuitsDislikedByUser = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.findOne({tuit: tid, dislikedBy: uid});


    /**
     * Uses DislikeModel to insert a dislike into the database
     * @param {string} uid the primary key of a user who dislike a tuit
     * @param {string} tid the primary key of a tuit disliked by a user
     * @returns Promise To be notified when a dislike is inserted into the database
     */
    userDislikesTuit = async (uid: string, tid: string): Promise<Dislike> =>
        DislikeModel.create({tuit: tid, dislikedBy: uid});

    /**
     * Uses DisklikeModel to remove a dislike from the database
     * @param {string} uid the primary key of a user who undislike a tuit
     * @param {string} tid the primary key of a tuit undisliked by a user
     * @returns Promise To be notified when a dislike is removed from the database
     */
    userUndislikeTuit = async (uid: string, tid: string): Promise<any> =>
        DislikeModel.deleteOne({tuit: tid, dislikedBy: uid});

    /**
     * Count how many users disliked a tuit
     * @param {string} tid the primary key of a tuit
     * @returns Promise Return the number of count
     */
    countHowManyDislikedTuit = async (tid: string): Promise<any> =>
        DislikeModel.count({tuit: tid});
}