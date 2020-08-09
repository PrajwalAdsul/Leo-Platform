const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let user = new Schema({ 
    name : { type : String },
    user_name : { type : String },
    password : { type : String },
    unique_key : { type : String},
    phone : { type : Number},
    emergencyContacts : [String],
    longitude : { type : Number },
    latitude : { type : Number },
    email : { type : String},
    area : { type : String },
    inTrouble : { type : Boolean },
    datetime : {type : String},
    token : {type : String},
    log : [Object],
    type : {type : String},           // app, web, bot, redirect to police
    
    user_unmark : {type : Boolean}, // has user unmarked himself from trouble
    redirected_to_police : {type : Boolean},

    contact_back : {type : Boolean},
    complaint : {type : Boolean},
    category : {type : String},
    description : {type : String},
    image_url : {type : String}
});

let DRO = new Schema({
    name : { type: String },
    user_name : { type : String },
    password : { type : String },
    phone_no : { type: String },
    email : { type : String },
    latitude : { type : String },
    longitude : { type : String },
    area : { type : String }
});

let police = new Schema({
    user_name : { type : String },
    password : {type : String}
});

let fir = new Schema({
    date : { type : String }, 
    time : { type : String }, 
    location : { type : String },
    crime_category : { type : String }, 
    description : { type : String }
});

user = mongoose.model('user', user);
DRO = mongoose.model('DRO', DRO);
police = mongoose.model('police', police);
fir = mongoose.model('fir', fir);

var my_schemas = {'user': user, 'DRO': DRO, 'fir' : fir, 'police' : police};
module.exports = my_schemas;
