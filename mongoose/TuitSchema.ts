import mongoose from "mongoose";

const TuitSchema = new mongoose.Schema({
    tuit: {type: String, required: true},
    postOn: {type:Date, default:Date.now},
    postBy: {type: String, required: true}
}, {collection:"tuits"});
export default TuitSchema;