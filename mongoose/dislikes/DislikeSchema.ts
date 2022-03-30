/**
 * @file Implements mongoose Schema for Dislike
 * documents in the dislikes collection
 */
import mongoose, {Schema} from "mongoose";
import Dislike from "../../models/dislikes/Dislike";

/**
 * @typedef Like Represents the like of a tuit
 * @property {ObjectId} tuit the Id of a tuit liked by a user
 * @property {ObjectId} dislikedBy the Id of a user liking the tuit
 */
const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    dislikedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "dislikes"});
export default DislikeSchema;