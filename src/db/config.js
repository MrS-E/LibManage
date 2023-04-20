const server = '127.0.0.1:27017'; // REPLACE WITH YOUR DB SERVER
const database = 'bibliothek';      // REPLACE WITH YOUR DB NAME

exports.mogodbUri = `mongodb://${server}/${database}`