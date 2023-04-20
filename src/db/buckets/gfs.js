const mongoose = require("mongoose")

class gridfs {

    constructor() {
        const db = mongoose.connection;
        this.gfs = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' })
    }

    async search(option){
       return await this.gfs.find(option).toArray()
    }

    async get(filename){
        return new Promise(async (resolve, reject) => { //found this on: https://stackoverflow.com/questions/60084067/how-do-decode-base64-file-when-reading-from-gridfs-via-node
            // temporary variable to hold image
            const data = [];
            // create the download stream
            let downloadStream = this.gfs.openDownloadStreamByName(filename);
            downloadStream.on('data', (chunk) => {
                data.push(chunk);
            });
            downloadStream.on('error', async (error) => {
                reject(error);
            });
            downloadStream.on('end', async () => {
                // convert from base64 and write to file system
                let bufferBase64 = Buffer.concat(data)
                let bufferDecoded = bufferBase64.toString('base64');
                resolve(bufferDecoded);
            });
        });
    }

    delete(filename){
        search(filename).then(doc => {
            this.gfs.delete(mongoose.Types.ObjectId(doc[0]._id))
        })
    }
}

module.exports = new gridfs()