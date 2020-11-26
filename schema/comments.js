var mongoose = require('mongoose');
var Schema = mongoose.Schema
var Populate = require("../util/autopopulate");
ObjectId = Schema.ObjectId;
const Comments = new Schema({
comment :String,    
postId :String,
commentedBy : { type: Schema.Types.ObjectId, ref: "User", required: true },
comments: [{type: Schema.Types.ObjectId, ref: "Comments"}]
},{timestamps: {createdAt: 'created_at'}});
Comments
    .pre('findOne', Populate('commentedBy'))
    .pre('find', Populate('commentedBy'))
    .pre('findOne', Populate('comments'))
    .pre('find', Populate('comments'))
module.exports = mongoose.model('Comments', Comments);