/**
 * @file Implements mongoose model to CRUD
 * documents in the dislikes collection
 */
import mongoose from "mongoose";
import DislikeSchema from "./DislikeSchema";
const LikeModel = mongoose.model("LikeModel", DislikeSchema);
export default LikeModel;