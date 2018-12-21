const mongoose = require('mongoose');

const {Schema} = mongoose;

const accountSchema = new Schema({
    accountEmail : {
        type:String,
        required:true,
        unique:true,
    },
    accountPwd : {
        type:String,
        required:true,
    },
    accountName : {
        type:String,
        required:true,
    },
    accountGrade : {
        type:String,
        required:true,
    },
    profilePicture : {
        type:String,
        required:true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
      },
})

module.exports = mongoose.model('account', accountSchema)