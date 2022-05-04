//required mongoose package to define the schema
const mongoose = require('mongoose')
//defined schema for user document
const empSchema = new mongoose.Schema({

    name: {type: String,required: true},
    age:{type: Number,required: true},
    email: {type: String,required: true,unique: true,
        validate: {
            validator: function (v) {
                return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(v);
            },
            message: "Please enter a valid email"
        },
    },
    password: {type: String,required: true},
    department:{type: String,required: true},
    isDeleted: {type:Boolean,default:false} 

    },{ timestamps: true })

module.exports = mongoose.model('employee', empSchema)