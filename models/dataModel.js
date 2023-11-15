const mongoose = require("mongoose")

const dataModelSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
     imageUrl: {
        type : String
    },
    url:{
        type : String
    }, user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
})

module.exports = mongoose.model('dataModel', dataModelSchema)