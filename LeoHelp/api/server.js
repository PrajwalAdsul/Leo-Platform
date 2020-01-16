const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4001;
const LeoHelp = express.Router()
const fetch = require('node-fetch');

var fs = require('fs');

const schemas = require('./db.model');

user = schemas.user;
DRO = schemas.DRO;

app.use(cors());
app.use(bodyParser.json());
app.use('/LeoHelp', LeoHelp);

mongoose.connect('mongodb://127.0.0.1:27017/Leo', {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(PORT, () => {
    console.log('App running on port $(PORT)');
});

// 
LeoHelp.route('/login').post(function(req, res){
    const user_name = req.body.user_name;
    const password = req.body.password;

    user.find(function(err, usr){
        // console.log('Entered')
        flag = 1;
        if(err) {
            console.log(err)
        }else {
            // console.log(usr)
            for(index = 0; index < usr.length; index++) {
                if(usr[index].user_name == user_name && usr[index].password == password) {
                    res.status(200).json({Success: 1})
                    flag = 0
                    break;
                }
            }
            if(flag) {
                res.status(400).json({Success: 0})
            }
        }
    })
});

// Check if user exists
LeoHelp.route('/loginIn').post( async (req, res) => {
	try{
 		 let data = await user.findOne({user_name : req.body.user_name, password : req.body.password });
		 console.log(data)
		 if(data !== null){
			 res.status(200).json({'msg': " login successful"});    	 	
		 }
		res.status(204).json({'msg': " login unsuccessfull"});
   	}
	catch(e){
		 res.status(204).json({'msg': "error"});
	}  
});

// Add a new user
LeoHelp.route('/addUser').post(function(req, res) {
    let cr = new user(req.body);
    cr.save()
        .then(cr => {
            res.status(200).json({'message ': cr.user_name + " added successfully"});
        })
        .catch(err => {
            res.status(400).json({Error: "Error adding new user"});
        });
    });

// Add a new DRO
LeoHelp.route('/addDRO').post(function(req, res) {
    let cr = new DRO(req.body);
    cr.save()
        .then(cr => {
            res.status(200).json({'message ': cr.name + " added successfully"});
        })
        .catch(err => {
            res.status(400).json({Error: "Error adding new user"});
        });
    });

// Get ECs from username
LeoHelp.route('/getECs').post(async (req, res) => {
	console.log(req.body);

	let data = await user.findOne({user_name : req.body.user_name });
	if(data != null){
		res.status(200).json(data.emergencyContacts)
	}
	res.status(400).json({'msg' : ' errror'});
});

// View all users
LeoHelp.route('/allUsers').get(function(req, res) {
    user.find(function(err, user) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(user);
	}
    });
});

// View all DROs
LeoHelp.route('/allDROs').get(function(req, res) {
    DRO.find(function(err, DRO) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(DRO);
	}
    });
});

// Delete all users
LeoHelp.route('/deleteAllUsers').delete( async (req, res) => {
	await user.remove({});
    res.status(200).json({'result ': " All users deleted successfully"});  
});

// Delete all DROs
LeoHelp.route('/deleteAllDROs').delete( async (req, res) => {
	await DRO.remove({});
    res.status(200).json({'result ':  " All DROs deleted successfully"});  
});

LeoHelp.route('/markTrouble').put(async (req, res) => {
	let data = await user.findOne({user_name : req.body.user_name });
	user.findByIdAndUpdate(data._id, {
		$set : req.body
	},	(error, data) => {
		if(error)
			console.log(error);
		else
			console.log(data);
	}
	)
	res.status(200).json({'msg' : 'msg'});
});

LeoHelp.route('/updateEC').put(async (req, res) => {
	let data = await user.findOne({user_name : req.body.user_name });
	neww = {
		 name : data.name,
	    user_name : req.body.user_name,
	    password : data.password,
	    unique_key : data.unique_key,
	    phone : data.phone,
	    emergencyContacts : [req.body.ec1, req.body.ec2, req.body.ec3, req.body.ec4, req.body.ec5],
	    longitude : data.longitude,
	    latitude : data.latitude,
	    email : data.email,
	    area : data.area,
	    inTrouble : data.inTrouble
	}
	
	await user.findByIdAndUpdate(data._id, {
		$set : neww
	},	(error, data) => {
		if(error)
			res.status(400).json({'msg' : 'error'});//console.log(error);
		else
			console.log(data);
	}
	)
	res.status(200).json({'msg' : neww});
});

// Mark a user in trouble
LeoHelp.route('/markTroublee').post( async (req, res) => {
	try{
		 let data = await user.findOne({user_name : req.body.user_name });
		 console.log(data);
		 data = _.extend(data, req.body);
		 console.log(data);
		/*
			Code to trigger authority, contacts
		*/
			
		  console.log("api");
		
		let start = "http://api.opencagedata.com/geocode/v1/json?key=4a4590286e2c474ca287e179cd718be9&q=";
		let mid = "%2C+";
		let end = "&pretty=1&no_annotations=1";
		let url = start + req.body.latitude + mid + req.body.longitude + end;
 		let settings = { method: "Get" };
		await fetch(url, settings)
		    .then(res => res.json())
		    .then((json) => {
		    	
		    	let continent = json.results[0].components.continent;
		    	let country_code = json.results[0].components.country_code;
		    	let country = json.results[0].components.country;
		    	let postcode = json.results[0].components.postcode;
		    	let state = json.results[0].components.state;
		    	let state_district = json.results[0].components.state_district;
		    	
		    	formatted = json.results[0].formatted;
		    	data.area = formatted;
		    });
		 data.inTrouble = true;
		 data.longitude = req.body.longitude;
		 data.latitude = req.body.latitude;
		 data.area = formatted;
		 data.save();
		 //console.log(data);
	}
	catch(e){
		res.status(400).json({Error: "Error marking user in trouble"});
	}
	res.status(200).json({'message ' : req.body.user_name + " is marked introuble at latitude " + req.body.latitude + " and " + req.body.longitude});	
});

// Unmark inTrouble (false) for an user
LeoHelp.route('/unmarkTrouble').post( async (req, res) => {
	try{
		 let data = await user.findOne({user_name : req.body.user_name });
		 console.log(data);
		 data.inTrouble = false;
		 data.longitude = req.body.longitude;
		 data.latitude = req.body.latitude;
		 data.save();
		 console.log(data);
	}
	catch(e){
		res.status(400).json({Error: "Error unmarking user in trouble"});
	}
	res.status(400).json({'message ' : req.body.user_name + " is unmarked "});	
});

LeoHelp.route('/markMobileUser').post( async (req, res) => {
	try{
		let start = "https://api.opencagedata.com/geocode/v1/json?q=";
		let mid = req.body.area;
		let end = "&key=4a4590286e2c474ca287e179cd718be9";
		let url = start + mid + end;
		let settings = { method: "Get" };
		await fetch(url, settings)
		    .then(res => res.json())
		    .then((json) => {
		    	/*
		    	let continent = json.results[0].components.continent;
		    	let country_code = json.results[0].components.country_code;
		    	let country = json.results[0].components.country;
		    	let postcode = json.results[0].components.postcode;
		    	let state = json.results[0].components.state;
		    	let state_district = json.results[0].components.state_district;
		    	*/
		    	let n = req.body.name;
		    	let p = req.body.phone;
		    	let e = req.body.emergencyContacts;
		    	let a = json.results[0].formatted;
     	    	let formatted = json.results[0].formatted;
		    
     	    	let u = {
     	    		name : n,
     	    		user_name : n,
     	    		phone : p,
     	    		emergencyContacts : e,
     	    		area : a,
     	    		inTrouble : true,
     	    		latitude : json.results[0].bounds.northeast.lat,
     	    		longitude : json.results[0].bounds.northeast.lng
     	    	};
     	    
     	    	let cr = new user(u);
		    	
		    	cr.save()
		        .then(cr => {
		            res.status(200).json({'message ': cr.name + " added successfully"});
		        })
		        .catch(err => {
		            res.status(400).json({Error: "Error adding new user"});
		        });

		    	/*
		    	console.log(json.results[0].bounds.northeast.lat);
		    	console.log(json.results[0].bounds.northeast.lng);
		    	console.log(formatted);
		    	*/

				/*		    	
                DRO.find(function(err, cr){
                    if(err) {
                        console.log(err)
                    }else {
                        let sum = 1000000000;
                        let mDRO = DRO[0];
                        for(index = 0; index < DRO.length; index++) {
                             if(Math.difference(DRO[index].latitude - cr.latitude) + 
                              Math.difference(DRO[index].longitude - cr.longitude) < sum )
                            {
                                sum = Math.difference(DRO[index].latitude - cr.latitude) + 
                                  Math.difference(DRO[index].longitude - cr.longitude);
                                 mDRO = DRO[index];
                            }
                        }
                    }
                });
				
				res.status(200).json({"assigned DRO is " : mDRO});			
	
			*/
		    });
	}
	catch(e){
		res.status(400).json({Error: "Error unmarking user in trouble"});
	}
	res.status(200).json({"msg" : " Correct"});
});