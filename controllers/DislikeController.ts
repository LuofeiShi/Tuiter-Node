/**
 * @file Controller RESTful Web service API for dislikes resource
 */
import {Express, Request, Response} from "express";
import DislikeDao from "../daos/DislikeDao";
import LikeDao from "../daos/LikeDao";
import TuitDao from "../daos/TuitDao";
import DislikeControllerI from "../interfaces/DislikeControllerI";

/**
 * @class DislikeController Implements RESTful Web service API for dislikes resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/dislikes/:tid to retrieve all the tuits disliked by a user
 *     </li>
 *     <li>PUT /api/users/:uid/dislikes/:tid to toggle dislikes a tuit
 *     </li>
 * </ul>
 * @property {DislikeDao} dislikeDao Singleton DAO implementing dislikes CRUD operations
 * @property {DislikeController} DislikeController Singleton controller implementing
 * RESTful Web service API
 */
export default class DislikeController implements DislikeControllerI {
    private static dislikeDao: DislikeDao = DislikeDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static dislikeController: DislikeController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return TuitController
     */
    public static getInstance = (app: Express): DislikeController => {
        if(DislikeController.dislikeController === null) {
            DislikeController.dislikeController = new DislikeController();
            app.get("/api/users/:uid/dislikes", DislikeController.dislikeController.findAllTuitsDislikedByUser);
            app.put("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.userTogglesTuitDislikes);
            app.get("/api/users/:uid/dislikes/:tid", DislikeController.dislikeController.checkUserDislikedTuit);
        }
        return DislikeController.dislikeController;
    }

    private constructor() {}

    /**
     * Retrieves all tuits disliked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user disliked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were disliked
     */
    findAllTuitsDislikedByUser = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        let userId = uid === 'me' && profile ?
            // @ts-ignore
            profile._id: uid;
        if (userId === 'me') {
            res.sendStatus(404);
        } else {
            try {
                let dislikes = await DislikeController.dislikeDao.findAllTuitsDislikedByUser(userId);
                const tuits = dislikes.map(likes => likes.tuit);
                res.json(tuits);
            } catch (e) {
                res.sendStatus(404);
            }
        }
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is disliking the tuit
     * and the tuit being disliked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new dislikes that was inserted in the
     * database
     */
    userTogglesTuitDislikes = async (req: Request, res: Response) => {
        const dislikeDao = DislikeController.dislikeDao;
        const tuitDao = DislikeController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        if (userId === 'me') {
            res.sendStatus(404);
        } else {
            try {
                const userAlreadyDislikedTuit = await dislikeDao.checkUserDislikesTuit(userId, tid);
                const dislikes = await dislikeDao.countHowManyDislikedTuit(tid);
                let tuit = await tuitDao.findTuitById(tid);
                if (userAlreadyDislikedTuit) {
                    // discard dislike
                    await dislikeDao.userUndislikeTuit(userId, tid);
                    tuit.stats.dislikes = dislikes - 1;
                } else {
                    // check if user has liked the tuit
                    const likeDao = LikeDao.getInstance();
                    const userAlreadyLikedTuit = await likeDao.checkUserLikedTuit(userId, tid);
                    if (userAlreadyLikedTuit) {
                        // discard the like, adjust the number of like in total
                        const likes = await likeDao.countHowManyLikedTuit(tid);
                        tuit.stats.likes = likes - 1;
                        await likeDao.userUnlikesTuit(userId, tid);
                    }
                    await dislikeDao.userDislikesTuit(userId, tid);
                    tuit.stats.dislikes = dislikes + 1;
                }
                await tuitDao.updateLikes(tid, tuit.stats);
                res.sendStatus(200);
            } catch (e) {
                res.sendStatus(404);
            }
        }
    }

    /**
     * Check if the user has already disliked the tuit
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user, and the tid representing the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON object containing the dislike objects or null
     */
    checkUserDislikedTuit = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        if (userId === 'me') {
            res.sendStatus(404);
        } else {
            let tuit = await DislikeController.dislikeDao.checkUserDislikesTuit(userId, tid);
            if (tuit) {
                const data = {'dislike' : true};
                res.json(data);
            } else {
                const data = {'dislike' : false};
                res.json(data);
            }
        }
    }
};