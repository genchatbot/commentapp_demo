var mongoose = require('mongoose');
var Schema = mongoose.Schema
const Populate = require("../util/autopopulate");
ObjectId = Schema.ObjectId;
const Posts = new Schema({
title :String,    
description :String,
postedBy:{type: Schema.Types.ObjectId, ref: "User", required: true },
comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }]
},{timestamps: {createdAt: 'created_at'}});
Posts
    .pre('findOne', Populate('postedBy','comments'))
    .pre('find', Populate('postedBy'))
module.exports = mongoose.model('Posts', Posts);