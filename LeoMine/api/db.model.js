const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let area = new Schema({ 
    name : {
        type : String
    },
    crimes : [String],
    minlongitude: {
        type : Number
    },
    maxlongitude: {
        type : Number
    },
    minlatitude : {
        type : Number
    },
    maxlatitude : {
        type : Number
    }
});

let crime = new Schema({
    name : {
	   type: String
    },
    description: {
	   type: String
    },
    precautions : [String]
});

area = mongoose.model('area', area);
crime = mongoose.model('crime', crime);
var my_schemas = {'area': area, 'crime': crime};
module.exports = my_schemas;
