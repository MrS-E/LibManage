import mongoose from "mongoose";

const { db } = mongoose.connection;
const gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });

module.exports = gfs