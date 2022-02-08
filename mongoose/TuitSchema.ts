import mongoose, {Schema} from "mongoose";

const TuitSchema = new mongoose.Schema({
    tuit: {type: String, required: true},
    postOn: {type:Date, default:Date.now},
    postBy: {type: Schema.Types.ObjectId, ref:"UserModel"}
}, {collection:"tuits"});
export default TuitSchema;