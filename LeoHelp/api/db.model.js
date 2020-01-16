const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({ 
    name : {
        type : String
    },
    user_name : {
        type : String
    },
    password : {
        type : String
    },
    unique_key : {
        type : String
    },
    phone : {
        type : Number
    },
    emergencyContacts : [String],
    longitude : {
        type : Number //float
    },
    latitude : {
        type : Number
    },
    email : {
        type : String
    },
    area : {
        type : String
    },
    inTrouble : {
        type : Boolean // 0 no, 1 yes
    }
});

let DRO = new Schema({
    name : {
	   type: String
    },
    user_name : {
        type : String
    },
    password : {
        type : String
    },
    phone_no : {
	   type: String
    },
    email : {
        type : String
    },
    latitude : {
        type : String
    },
    longitude : {
        type : String
    },
    area : {
        type : String
    }
});

user = mongoose.model('user', user);
DRO = mongoose.model('DRO', DRO);
var my_schemas = {'user': user, 'DRO': DRO};
module.exports = my_schemas;


/*

{
    "name" : "xyz",
    "unique_key" : "312312",
    "phone" : 920183,
    "emergencyContacts" : [12312, 123, 123],
    "longitude" : 1,
    "latitude" : 1,
    "email" : "ihsfs",
    "area" :"lisdhfils",
    "introuble" : 0
}

*/
