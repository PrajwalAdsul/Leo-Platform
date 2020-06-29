
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 8080;
const LeoHelp = express.Router()
const fetch = require('node-fetch');
var multer  = require('multer');
var upload = multer({ dest: 'uploads/' });
var Binary = require('mongodb').Binary;
var fs = require('fs');

const schemas = require('./db.model');

user = schemas.user;	
DRO = schemas.DRO;
doctor = schemas.doctor;

app.use(cors());
app.use(bodyParser.json());
app.use('/LeoHelp', LeoHelp);

mongoose.connect('mongodb+srv://praj:pra@cluster0-jpt7l.mongodb.net/Leo?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, });
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(process.env.PORT || 5000);

LeoHelp.route('/renameDoc').post( async (req, res) => {
	try{
 	console.log("&&&");
	await fs.readdir('uploads/', function (err, files) {
	    //handling error
	   	var flag = true;
	    //listing all files using forEach
	    files.forEach(function (file) {
	        // Do whatever you want to do with the file
	        console.log(file); 
	       	
	        if(!(file[0] == 'd' && file[1] == 'o' && file[2] == 'c')){
	        fs.rename('uploads/' + file, 'uploads/doc' + req.body.user_name + 'username' + req.body.name, function(err) {
			    if ( err ) console.log('ERROR: ' + err);
			});

	    }
		 });
	});
	}
	catch(e){
	} 
	res.status(200).json({'msg' : "great"});   
});

LeoHelp.route('/getDocs').post( async (req, res) => {
	try{
		await fs.readdir('uploads/', function (err, files) {
	   	var flag = true;
	    let lis = [];
	    console.log(req.body.user_name);
	    for(var i = 0; i < files.length; i++){
	    	if(files[i][0] == 'd' && files[i][1] == 'o' && files[i][2] == 'c'){
	    		if(files[i].split('doc')[1].split('username')[0] == req.body.user_name){
		    	try{
			    	filename = files[i].split('username')[1];
			    	lis.push(filename)
			    }
			    catch(e){

			    }
				}
			}
	    }
		res.status(200).json({'data' : lis});	
   	    });
	}
	catch(e){
		res.status(400).json({'msg' : 'No such directory'});	
   	
	}

});

app.get('/download', (req, res ) => {
	res.download('./uploads/docprajqzmp.png', 'user-facing-filename.png', (err) => {
	  if (err) {
	  	console.log("hello");
	    //handle error
	    return
	  } else {
	    //do something
	  }
	});
});


app.post('/uploadDoc',upload.single('file'), (req, res) => {
   
});// Login for user
LeoHelp.route('/login').post(function(req, res){
    const user_name = req.body.user_name;
    const password = req.body.password;

    user.find(function(err, usr){
        flag = 1;
        if(err) {
            console.log(err)
        }else {
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
		 console.log("**");
		 console.log(data);
		 if(data !== null){
			res.status(200).json({'msg': " login successful"});    	 	
		 }
		 res.status(400).json({'msg': " login unsuccessfull"});
   	}
	catch(e){
		 res.status(400).json({'msg': "error"});
	}  
});

// Get Near By Doctor
LeoHelp.route('/nearByDoctor').get(async (req, res) => {    
	try{
	    doctor.find(function(err, dc){
	        flag = 1;
	        if(err) {
	            console.log(err)
	        }else {
	        	lat = req.body.latitude;
	        	long = req.body.longitude;
	            var r = [];
	            var dist = 1000000;
	            var one = 1000000, two = 100000, three = 100000;
	            var onee = null, twoe = null, threee = null;
	            for(index = 0; index < dc.length; index++) {
	    			var temp = Math.sqrt(lat * lat + long * long);            
	    			if(temp < one && onee == null){
	    				one = temp;
	    				console.log("one");
	    				onee = dc[index];
	    			}
	    			else if(temp < two && twoe == null){
	    				two = temp;
	    				console.log("two");
	    				twoe = dc[index];
	    			}
	    			else if(temp < three && threee == null){
	    				three = temp;
	    				console.log("three");
	    				threee = dc[index];
	    			}

	    			// r.push(dc[index]);
	    			// if(temp < dist){
	    			// 	dist = temp;
	    			// 	r.push(dc[index]);
	    			// }
	            }
	            r.push(onee);
	            r.push(twoe);
	            r.push(threee);
	    		res.status(200).json(r);      
	        }
	    })
	}	
    catch(e){
 	   res.status(400).json({'msg' : 'error'});
	}
});

// Add a new user
LeoHelp.route('/addUser').post(function(req, res) {
	try{
	   	 if(req.body.user_name.length != 0 && req.body.phone.toString().length >= 8 && req.body.password.length >= 8 && req.body.name.length != 0 )
		  {  
		  	let cr = new user(req.body);
		    cr.save()
		        .then(cr => {
		            res.status(200).json({'message ': cr.user_name + " added successfully"});
		        })
		        .catch(err => {
		            res.status(400).json({Error: err});
		        });
		    }
		    else
		    {
		    	res.status(400).json({'msg' : " bad username or password"});
		    }
	}
	catch(e){
			res.status(400).json({'msg' : " Wrong entries"});	
	}
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
	req.body.user_name = req.body.user_name.replace('"', '');
	req.body.user_name = req.body.user_name.replace('"', '');
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

// View all marked allUsers
LeoHelp.route('/allMarkedUsers').get(async (req, res) => {
    user.find(function(err, usr){
        flag = 1;
        if(err) {
            console.log(err)
        }else {
            var r = [];
            for(index = 0; index < usr.length; index++) {
                if(usr[index].inTrouble == true) {
                  r.push(usr[index]);
                }
            }
    		res.status(200).json(r);      
        }
    })
});


// Get ECs from username
LeoHelp.route('/getECs').post(async (req, res) => {
	console.log(req.body);
	req.body.user_name = req.body.user_name.replace('"', '');
	req.body.user_name = req.body.user_name.replace('"', '');
	console.log(req.body);
	let data = await user.findOne({user_name : req.body.user_name });
	if(data != null){
		res.status(200).json(data.emergencyContacts)
	}
	res.status(400).json({'msg' : ' errror'});
});

// Delete all users
LeoHelp.route('/deleteAllUsers').delete( async (req, res) => {
	await user.remove({});
    res.status(200).json({'result ': " All users deleted successfully"});  
});

// Upadate ECs, query by user_name
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
			res.status(400).json({'msg' : 'error'});
		else
			console.log(data);
	}
	)
	res.status(200).json({'msg' : neww});
});

// Mark an user in trouble
LeoHelp.route('/markTrouble').put(async (req, res) => {
	req.body.user_name = req.body.user_name.replace('"', '');
	req.body.user_name = req.body.user_name.replace('"', '');

	console.log("****************");
	console.log(req.body.user_name);
	console.log("****************");
	
	let data = await user.findOne({user_name : req.body.user_name });
	let start = "http://api.opencagedata.com/geocode/v1/json?key=4a4590286e2c474ca287e179cd718be9&q=";
	let mid = "%2C+";
	let end = "&pretty=1&no_annotations=1";
	let url = start + req.body.latitude + mid + req.body.longitude + end;
	let settings = { method: "Get" };
	await fetch(url, settings)
	    .then(res => res.json())
	    .then((json) => {
	    	formatted = json.results[0].formatted;
	     });
	req.body.area = formatted;
	console.log(req.body.area);
	console.log(formatted);

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

// Unmark inTrouble (false) for an user
LeoHelp.route('/unmarkTrouble').put( async (req, res) => {
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

// Mark an user in trouble who doesnt have Leo app
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
		    });
	}
	catch(e){
		res.status(400).json({Error: "Error unmarking user in trouble"});
	}
	res.status(200).json({"msg" : " Correct"});
});


// Delete a user's account given a user_name
LeoHelp.route('/deleteUser').delete( async (req, res) => {
	let data = await user.findOne({user_name : req.body.user_name });
	if(data == null)
		res.status(400).json({Error: "No such username"});	
    // console.log("**********\n" + data + "\n*************\n");
	user.deleteOne({ _id: data._id }, function(err, results) {
	       if (err){
			 res.status(400).json({"msg" : " InCorrect"});       
	         throw err;
	       }
	       console.log("success");
      }
    );
	res.status(200).json({"msg" : " Correct"});
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


// Check if user exists
LeoHelp.route('/DROloginIn').post( async (req, res) => {
	try{
 		 let data = await DRO.findOne({user_name : req.body.user_name, password : req.body.password });
		 console.log("**");
		 console.log(data);
		 if(data !== null){
			res.status(200).json({'msg': " login successful"});    	 	
		 }
		 res.status(400).json({'msg': " login unsuccessfull"});
   	}
	catch(e){
		 res.status(400).json({'msg': "error"});
	}  
});

// Delete all DROs
LeoHelp.route('/deleteAllDROs').delete( async (req, res) => {
	await DRO.remove({});
    res.status(200).json({'result ':  " All DROs deleted successfully"});  
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

// Delete a DRO's account given a user_name
LeoHelp.route('/deleteDRO').delete( async (req, res) => {
	let data = await DRO.findOne({user_name : req.body.user_name });
	if(data == null)
		res.status(400).json({Error: "No such username"});	
    // console.log("**********\n" + data + "\n*************\n");
	DRO.deleteOne({ _id: data._id }, function(err, results) {
	       if (err){
			 res.status(400).json({"msg" : " InCorrect"});       
	         throw err;
	       }
	       console.log("success");
      }
    );
	res.status(200).json({"msg" : " Correct"});
});

// Add a new Doctor
LeoHelp.route('/addDoctor').post(function(req, res) {
    let cr = new doctor(req.body);
    cr.save()
        .then(cr => {
            res.status(200).json({'message ': cr.name + " added successfully"});
        })
        .catch(err => {
            res.status(400).json({Error: "Error adding new user"});
        });
});

// View all marked allUsers
LeoHelp.route('/applications').get(async (req, res) => {
    doctor.find(function(err, dc){
        flag = 1;
        if(err) {
            console.log(err)
        }else {
            var r = [];
            for(index = 0; index < dc.length; index++) {
                if(dc[index].status == false) {
                  r.push(dc[index]);
                }
            }
    		res.status(200).json(r);      
        }
    })
});

LeoHelp.route('/approveDoctor').put(async (req, res) => {
	let data = await doctor.findOne({user_name : req.body.user_name });
	data.status = true;
	data.applicationStatusComment = "Doctor is approved";
	await doctor.findByIdAndUpdate(data._id, {
		$set : data
	},	(error, data) => {
		if(error)
			res.status(400).json({'msg' : 'error'});
		else
			console.log(data);
	}
	)

	res.status(200).json({'msg' : data});
});

LeoHelp.route('/getDoctor').post(async (req, res) => {
	console.log("********");
	console.log(req.body);
	let data = await doctor.findOne({user_name : req.body.user_name });
	if(data == null)
		res.status(400).json({'msg' : 'error'});
	console.log("********");
	console.log(data);
	console.log("********");
	res.status(200).json(data);
});
LeoHelp.route('/updateDoctor').put(async (req, res) => {
	let data = await doctor.findOne({user_name : req.body.user_name });
	neww = {
			user_name :req.body.user_name,
			email : req.body.email,
			phone : req.body.phone,
			area : req.body.area,
			unique_key : req.body.unique_key,
			qualification : req.body.qualification,
			helpType : req.body.helpType,
			hospital : req.body.hospital,
			hospitalLocation : req.body.hospitalLocation,
			degreeType : req.body.degreeType,
			college : req.body.college,
			qualification : req.body.qualification,
			startFreeTime : req.body.startFreeTime,
			endFreeTime : req.body.endFreeTime,
			isFree : req.body.isFree,
			longitude : req.body.longitude,
			latitude : req.body.latitude,
			status : req.body.status,
			applicationStatusComment : req.body.applicationStatusComment
	}	
	await doctor.findByIdAndUpdate(data._id, {
		$set : neww
	},	(error, data) => {
		if(error)
			res.status(400).json({'msg' : 'error'});
		else
			console.log(data);
	}
	)
	res.status(200).json({'msg' : neww});
});
// Check if user exists
LeoHelp.route('/doctorloginIn').post( async (req, res) => {
	try{
 		 let data = await doctor.findOne({user_name : req.body.user_name, password : req.body.password });
		 // console.log("**");
		 // console.log(data);
		 if(data !== null){
			res.status(200).json({'msg': " login successful"});    	 	
		 }
		 res.status(400).json({'msg': " login unsuccessfull"});
   	}
	catch(e){
		 res.status(400).json({'msg': "error"});
	}  
});

// View all Doctors
LeoHelp.route('/allDoctors').get(function(req, res) {
    doctor.find(function(err, doctor) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(doctor);
	}
    });
});

// Delete all Doctors
LeoHelp.route('/deleteAllDoctors').delete( async (req, res) => {
	await doctor.remove({});
    res.status(200).json({'result ':  " All Doctors deleted successfully"});  
});

// Delete a doctor's account given a user_name
LeoHelp.route('/deleteDoctor').delete( async (req, res) => {
	let data = await doctor.findOne({user_name : req.body.user_name });
	if(data == null)
		res.status(400).json({Error: "No such username"});	
    // console.log("**********\n" + data + "\n*************\n");
	doctor.deleteOne({ _id: data._id }, function(err, results) {
	       if (err){
			 res.status(400).json({"msg" : " InCorrect"});       
	         throw err;
	       }
	       console.log("success");
      }
    );
	res.status(200).json({"msg" : " Correct"});
});

