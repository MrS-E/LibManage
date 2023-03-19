const objects = require("../src/db/models/object");

exports.all = function (req, res, next){
    objects.find()
        .then((doc)=>{
            res.send(doc)
        })
}

exports.find = function (req, res, next){
    const term = {$regex: req.query.find, $options: "i"}
    objects.find({$or: [{title: term}, {author: term}, {publisher: term}, {isbn: term}, {keywords: term}, {blurb: term}]})
        .then((doc)=>{
            res.send(doc)
        })
}

exports.detail = function (req, res, next){
    const term = req.params.id;
    objects.find({_id: term})
        .then((doc)=>{
            res.send(doc)
        })
}