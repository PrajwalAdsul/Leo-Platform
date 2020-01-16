const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 4001;
const LeoHelp = express.Router()

const schemas = require('./db.model');
//let users = db.users;
user = schemas.user;
DRO = schemas.DRO;
//application = schemas.application;
//application = schemas.application;
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



LeoHelp.route('/addUser').post(function(req, res) {
    let cr = new user(req.body);
    if(req.body.user_name !== null && req.body.password !== null && req.body.email !== null){
    	console.log("2")
	    cr.save()
	        .then(cr => {
	            res.status(200).json({'name': cr.name + " added successfully"});
	        })
	        .catch(err => {
	            res.status(400).json({Error: "Error adding new user"});
	        });
    }
    else{
    	res.status(400).json({Error : "invalid inputs"});
    }

 });


LeoHelp.route('/addDRO').post(function(req, res) {
    let cr = new DRO(req.body);
    cr.save()
        .then(cr => {
            res.status(200).json({'name': DRO.name + " added successfully"});
        })
        .catch(err => {
            res.status(400).json({Error: "Error adding new user"});
        });
    });

LeoHelp.route('/allUsers').get(function(req, res) {
    user.find(function(err, user) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(user);
	}
    });
});

LeoHelp.route('/allDRO').get(function(req, res) {
    DRO.find(function(err, DRO) {
	if(err) {
	    console.log(err);
	} else {
	    res.status(200).json(DRO);
	}
    });
});

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

LeoHelp.route('/removeUsers').delete( async (req, res) => {
	try{
		 console.log(req.body);

		 let data = await user.findOne({__v : 0});

		 console.log(data)
		if(data !== null) {
			const dataa = await user.findByIdAndRemove({
			_id : data._id
		});
		res.send(dataa)

		}
		res.status(204).json({'name': "no record"});
		
	}
	catch(e){
		console.log("error occurred")

	}
});

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