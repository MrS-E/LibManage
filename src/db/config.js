const server = '127.0.0.1:27017'//'bibliothek.ohk107k.mongodb.net'
const database = 'bibliothek'
const username = undefined //'web'
const password = undefined

exports.mongodbUri = username?`mongodb://${username}:${password}@${server}/${database}`:`mongodb://${server}/${database}`
