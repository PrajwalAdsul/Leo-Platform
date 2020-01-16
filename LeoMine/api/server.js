const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const csv = require('csv-parser');

const fetch = require('node-fetch');
const fs = require('fs');
const PORT = 4000;
const LeoMine = express.Router()

const schemas = require('./db.model');

crime = schemas.crime;
area = schemas.area;

app.use(cors());
app.use(bodyParser.json());
app.use('/LeoMine', LeoMine);

mongoose.connect('mongodb://127.0.0.1:27017/Leo', {useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
})

app.listen(PORT, () => {
    console.log('App running on port $(PORT)');
});

// Add a crime to crime schema
LeoMine.route('/addCrime').post(function(req, res) {
    let cr = new crime(req.body);
    cr.save()
        .then(cr => {
            res.status(200).json({'name': cr.name + " added successfully"});
        })
        .catch(err => {
            res.status(400).json({Error: "Error adding new crime"});
        });
    });

// Add an area to area schema
LeoMine.route('/addArea').post(function(req, res) {
    let cr = new area(req.body);
    cr.save()
        .then(cr => {
            res.status(200).json({'name': area.name + " added successfully"});
        })
        .catch(err => {
            res.status(400).json({Error: "Error adding new area"});
        });
    });

// Delete all areas from area schema
LeoMine.route('/deleteAllAreas').delete( async (req, res) => {
	await area.remove({});
    res.status(200).json({'result ': " All areas deleted successfully"});  
});

// Delete all crimes from crime schema
LeoMine.route('/deleteAllCrimes').delete( async (req, res) => {
	await crime.remove({});
    res.status(200).json({'result ':  " All crimes deleted successfully"});  
});

// Add areas from a CSV file (data.csv) to area schema
LeoMine.route('/addAreaCSV').post(function(req, res){
	let arr = [];
	fs.createReadStream('data.csv')
	  .pipe(csv())
	  .on('data', (row) => {
	    console.log(row.state_ut);
	    let obj = {
	    	'name' : '',
	    	'crimes' : [],
	    }
	    obj.name = row.district;
		if(obj.name !== 'total'){
			obj.name = obj.name + "," + row.state_ut;		 
		    if(row.murder > 50){
		    	obj.crimes.push('murder');
		    }
		    if(row.attempt_to_murder > 50){
		    	obj.crimes.push('attempt_to_murder');
		    }
		    if(row.culpable_homicide_not_amounting_to_murder > 50){
		    	obj.crimes.push('culpable_homicide_not_amounting_to_murder');
		    }
		    if(row.rape > 50){
		    	obj.crimes.push('rape');
		    }
		    if(row.custodial_rape > 50){
		    	obj.crimes.push('custodial_rape');
		    }
		    if(row.other_rape > 50){
		    	obj.crimes.push('other_rape');
		    }
		    if(row.kidnapping_abduction > 50){
		    	obj.crimes.push('kidnapping_abduction');
		    }		    
		    if(row.kidnapping_and_abduction_of_women_and_girls > 50){
		    	obj.crimes.push('kidnapping_and_abduction_of_women_and_girls');
		    }
		    if(row.kidnapping_and_abduction_of_others > 50){
		    	obj.crimes.push('kidnapping_and_abduction_of_others');
		    }
		    if(row.dacoity > 50){
		    	obj.crimes.push('dacoity');
		    }
		    if(row.robbery > 50){
		    	obj.crimes.push('robbery');
		    }
		    if(row.burglary > 50){
		    	obj.crimes.push('burglary');
		    }		    
		    if(row.theft > 50){
		    	obj.crimes.push('theft');
		    }
		    if(row.auto_theft > 50){
		    	obj.crimes.push('auto_theft');
		    }
		    if(row.other_theft > 50){
		    	obj.crimes.push('other_theft');
		    }
		    if(row.riots > 50){
		    	obj.crimes.push('riots');
		    }

		    if(row.criminal_breach_of_trust > 50){
		    	obj.crimes.push('criminal_breach_of_trust');
		    }
		    if(row.cheating > 50){
		    	obj.crimes.push('cheating');
		    }
		    if(row.counterfeiting > 50){
		    	obj.crimes.push('counterfeiting');
		    }
		    if(row.arson > 50){
		    	obj.crimes.push('arson');
		    }
		    if(row.hurt_grevious_hurt > 50){
		    	obj.crimes.push('hurt_grevious_hurt');
		    }
		    if(row.dowry_deaths > 50){
		    	obj.crimes.push('dowry_deaths');
		    }
		    if(row.importation_of_girls_from_foreign_countries > 50){
		    	obj.crimes.push('importation_of_girls_from_foreign_countries');
		    }
   		    if(row.causing_death_by_negligence > 50){
		    	obj.crimes.push('causing_death_by_negligence');
		    }
		    /*
		    if(row. > 50){
		    	obj.crimes.push('');
		    }*/
		    let cr = new area(obj);
		    console.log(cr);
		    cr.save();
		}
	  })
	  .on('end', () => {
	    console.log('CSV file successfully processed');
	    res.status(400).json({'msg' : "CSV file added successfully"});
	  });
	  console.log(arr);
	res.status(400).json({Error: "No errors"});
    	 
});

// add crimes from a CSV file (p.csv) to crimes (not working)
LeoMine.route('/addCrimeCSV').post(function(req, res){
	let arr = [];
	fs.createReadStream('p.csv')
	  .pipe(csv())
	  .on('data', (row) => {
	    //console.log(row);
	    let obj = {
	    	'name' : '',
	    	'description' : '',
	    	'precautions' : [],
	    }
	   	obj.name = row[0];
	   	obj.description = row[1];
 		obj.precautions.push(row[2]);
 		obj.precautions.push(row[3]);
 		obj.precautions.push(row[4]);
 		obj.precautions.push(row[5]);

	  	let cr = new crime(obj);
	 	console.log(cr);
	  	cr.save(); 
	  })
	  .on('end', () => {
	    console.log('CSV file successfully processed');
	    res.status(200).json({'msg' : " CSV file added successfully"});
	  });
	res.status(400).json({Error: "Error adding new crime"});    	 
});


LeoMine.route('/allCrimes').get(function(req, res) {
    crime.find(function(err, crime) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(crime);
	}
    });
});

LeoMine.route('/allAreas').get(function(req, res) {
    area.find(function(err, area) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(area);
	}
    });
});

// tell crimes in that area (latitude and longitude)
LeoMine.route('/tellCrimes').get(async (req, res) => {
	try{
		 console.log(req.body);

		let start = "http://api.opencagedata.com/geocode/v1/json?key=4a4590286e2c474ca287e179cd718be9&q=";
		let mid = "%2C+";
		let end = "&pretty=1&no_annotations=1";
		let url = start + req.body.latitude + mid + req.body.longitude + end;
			let settings = { method: "Get" };

		let continent, country_code, country, postcode, state, state_district;
		await fetch(url, settings)
		    .then(res => res.json())
		    .then((json) => {
				console.log("pqpqpqpqpqpqp");		    	
		    	continent = json.results[0].components.continent;
		    	country_code = json.results[0].components.country_code;
		    	country = json.results[0].components.country;
		    	postcode = json.results[0].components.postcode;
		    	state = json.results[0].components.state;
		    	state_district = json.results[0].components.state_district;
		    	/*
		    	formatted = json.results[0].formatted;
		    	data.area = formatted;*/
		    });
		    /*
		 data.inTrouble = true;
		 data.longitude = req.body.longitude;
		 data.latitude = req.body.latitude;
		 data.area = formatted;
		 data.save();
		 console.log(data);
*/
		 console.log("mzmzmzmzmz");
		 //console.log(state_district);
		 console.log("qoqoq");
		 let data = await area.findOne({name : {$regex : "*" + state_district + "*"}});


		 console.log("llll");

		 console.log(data)
		 /*
		const dataa = await applications.findByIdAndRemove({
			_id : data._id
		});*/
		res.send(data)
	}
	catch(e){
		res.status(400).json({Error: "Error"});
	}
});

/*
userRoutes.route('/removeapplication').delete( async (req, res) => {
	try{
		 console.log(req.body);

		 let data = await applications.findOne({user_name : req.body.user_name, 
		 			startup_name : req.body.startup_name, 
		 			status : req.body.status });

		 console.log(data)
		const dataa = await applications.findByIdAndRemove({
			_id : data._id
		});
		res.send(dataa)
	}
	catch(e){

	}
});
*/

/*
userRoutes.route('/userexists').post(function(req, res) {
    const user_name = req.body.user_name;
    users.find(function(err, usr) {
	if(err) {
	    console.log(err);
	} else {
	    flag = 1;
	    for(index = 0; index < usr.length; index++) {
		if(usr[index].user_name == user_name) {
		    //res.json(user_name + "res");
		    res.status(204).json({UserNameExists : 1});
		    flag = 0;
		    break;
		    //res.json(usr);
		}
		    //res.status(401).json({Success: 0, Error: "Incorrect Password"});
	    }
	    if(flag) {
		//res.status(200).json({UserNameExists: 0});
		res.json(usr);
	    }
	}
    });
});
userRoutes.route('/').post(function(req, res) {
    const user_name = req.body.user_name;
    const password = req.body.password;
    /users.findOne({ user_name }).then(user => {
        if(!user) {
            return res.status(404).json({emailnotfound: "Email not found"});
        }
        if(user.password == password) {
            return res.status(200).json({Success: "Logging In"});
        } else {
            return res.status(400).json({Error: "Incorrect Password"});
        }
    });/
    users.find(function(err, usr) {
	flag = 1;
        if(err) {
            console.log(err);
        } else {
	    //res.json(req.body);
	    for(index = 0; index < usr.length; index++) {
		if(usr[index].user_name == user_name  && usr[index].password == password) {
		//    res.json(user_name + "res");
		    res.status(200).json({Success : 1});
		    flag = 0;
		    break;
		    //res.json(usr);
		}
		    //res.status(401).json({Success: 0, Error: "Incorrect Password"});
	    }
	    if(flag) {
		res.status(401).json({Success: 0, Error: "Incorrect Password"});
	    }
	    //
	    /*
	    if(usr[0].user_name == user_name  && usr[0].password == password) {
		//res.json(user_name + "res");
		res.status(200).json({Success : 1});
		//res.json(usr);
	    } else {
		res.status(401).json({Success: 0, Error: "Incorrect Password"});
	    }
	    /
	    //
        }
    });
});
userRoutes.route('/add').post(function(req, res) {
    let usr = new users(req.body);
    usr.save()
        .then(usr => {
            res.status(200).json({'user': 'user added successfully'});
        })
        .catch(err => {
            res.status(400).json({Error: "Error Adding New User"});
        });
    });

userRoutes.route('/addstartup').post(function(req, res) {
    let startup = new startups(req.body);
    startup.save()
        .then(startup => {
	    res.status(200).json({'startup': 'startup added successfully'});
	})
        .catch(err => {
	    res.status(400).json({Error: "Error Adding new Startup"});
	});
});*/

/*
//userRoutes.route('/:u')
userRoutes.route('/addapplication').post(function(req, res) {
    let application = new applications(req.body);
    application.save()
        .then(application => {
	    res.status(200).json({'application': 'application added successfully'});
	})
        .catch(err => {
	    res.status(400).json({Error: "Error Adding new Application"});
	});
});

userRoutes.route('/applications').get(function(req, res) {
    applications.find(function(err, application) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(application);
	}
    });
});


userRoutes.route('/removeapplication').delete( async (req, res) => {
	try{
		 console.log(req.body);

		 let data = await applications.findOne({user_name : req.body.user_name, 
		 			startup_name : req.body.startup_name, 
		 			status : req.body.status });

		 console.log(data)
		const dataa = await applications.findByIdAndRemove({
			_id : data._id
		});
		res.send(dataa)
	}
	catch(e){

	}
});
*/