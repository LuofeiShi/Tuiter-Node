/**
 * @file Implements DAO managing data storage of Like. Uses mongoose LikeModel
 * to integrate with MongoDB
 */
import LikeDaoI from "../interfaces/LikeDaoI";
import LikeModel from "../mongoose/likes/LikeModel";
import Like from "../models/likes/Like";

/**
 * @class LikeDao Implements Data Access Object managing data storage
 * of Users
 * @property {LikeDao} likeDao Private single instance of LikeDao
 */
export default class LikeDao implements LikeDaoI {
    private static likeDao: LikeDao | null = null;

    /**
     * Creates singleton DAO instance
     * @returns LikeDao
     */
    public static getInstance = (): LikeDao => {
        if(LikeDao.likeDao === null) {
            LikeDao.likeDao = new LikeDao();
        }
        return LikeDao.likeDao;
    }

    private constructor() {}

    /**
     * Uses LikeModel to retrieve all users liked a given tuit
     * @param {string} tid the primary key of a tuit
     * @returns Promise To be notified when the users are retrieved from database
     */
    findAllUsersThatLikedTuit = async (tid: string): Promise<Like[]> =>
        LikeModel
            .find({tuit: tid})
            .populate("likedBy")
            .exec();

    /**
     * Check if there's a likes document in the database for user/tuit combination
     * @param {string} uid the primary key of a user
     * @param {string} tid the primary key of a tuit
     * @returns Promise To be notified if the user likes the given tuit
     */
    checkUserLikedTuit = async (uid: string, tid: string): Promise<any> =>
            LikeModel.findOne({tuit: tid, likedBy: uid});

    /**
     * Uses LikeModel to retrieve all tuits liked by a given user
     * @param {string} uid the primary key of a user
     * @returns Promise To be notified when the Likes are retireved from database
     */
    findAllTuitsLikedByUser = async (uid: string): Promise<Like[]> =>
        LikeModel
            .find({likedBy: uid})
            .populate({
                path: "tuit",
                populate: {
                    path: "postedBy"
                }
            })
            .exec();

    /**
     * Uses LikeModel to insert a like into the database
     * @param {string} uid the primary key of a user who like a tuit
     * @param {string} tid the primary key of a tuit liked by a user
     * @returns Promise To be notified when a like is inserted into the database
     */
    userLikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.create({tuit: tid, likedBy: uid});

    /**
     * Uses LikeModel to remove a like from the database
     * @param {string} uid the primary key of a user who unlike a tuit
     * @param {string} tid the primary key of a tuit unliked by a user
     * @returns Promise To be notified when a like is removed from the database
     */
    userUnlikesTuit = async (uid: string, tid: string): Promise<any> =>
        LikeModel.deleteOne({tuit: tid, likedBy: uid});

    /**
     * Count how many users liked a tuit
     * @param {string} tid the primary key of a tuit
     * @returns Promise Return the number of count
     */
    countHowManyLikedTuit = async (tid: string): Promise<any> =>
        LikeModel.count({tuit: tid});
}