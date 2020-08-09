const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const PORT = 8080;
const LeoHelp = express.Router();
const fetch = require("node-fetch");
var multer = require("multer");
var upload = multer({ dest: "uploads/" });
var Binary = require("mongodb").Binary;
var fs = require("fs");
var nodemailer = require('nodemailer');
var bcrypt = require('bcryptjs');
var otps = []

var mailHost = process.env.GMAIL_HOST;
var mailUser = process.env.GMAIL_USER;
var mailPass =  process.env.GMAIL_PASS;
var transporter = nodemailer.createTransport({
    host: mailHost,
    port: 465,
    secure: true, // use SSL
    auth: {
        user: mailUser,
        pass: mailPass
    }
});

const schemas = require("./db.model");

user = schemas.user;
DRO = schemas.DRO;

fir = schemas.fir;
police = schemas.police;

app.use(cors());
app.use(bodyParser.json());
app.use("/LeoHelp", LeoHelp);

var atlas_url = process.env.ATLAS_URL

mongoose.connect(atlas_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

app.listen(process.env.PORT || 5000);

// get current date and time
function getDateTime(){
  let date_ob = new Date();
  let date = ("0" + date_ob.getDate()).slice(-2);
  let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
  let year = date_ob.getFullYear();
  let hours = date_ob.getHours();
  let minutes = date_ob.getMinutes();
  let seconds = date_ob.getSeconds();
  return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

// to remove otp from memory
function removeotp(v){
  for(var i = 0; i < otps.length; i++){
    if(otps[i] == v){
      otps.splice(i, 1);
      break;
    }
  }
}

// for JWT functionality
const JSRSASign = require("jsrsasign");
// const key = process.env.JWT_KEY;
const key = "leoisgreat";
const header = {
  alg: "HS512",
  typ: "JWT"
};

var sHeader = JSON.stringify(header);
const algorithm = "HS512";

generateToken = async (user_name) => {
  const claims = {
    user_name: user_name,
    datetime : getDateTime()
  }
  var sPayload = JSON.stringify(claims);
  const sJWT = JSRSASign.jws.JWS.sign("HS512", sHeader, sPayload, key);
  return sJWT;
}

authenticateToken = async (token) => {
  try{
    return  JSRSASign.jws.JWS.verifyJWT(token, key, {
      alg: [algorithm]
    });
  }
  catch(e){
    return false;
  }
}


LeoHelp.route("/fir").post(async (req, res) => {
  try {
        let cr = new fir(req.body);
        cr.save()
              .then(cr => {
                res.status(200).json(cr);
              })
              .catch(err => {
                console.log(err);
                res.status(400).json({ "msg" : err });
              });
    } catch (err){
      console.log(err);
    res.status(400).json({ "msg" : err });
    }
});

LeoHelp.route("/all_firs").get(async (req, res) => {
    fir.find(function(err, user) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(user);
      }
    });
  // }
});

LeoHelp.route("/forget_password").post(async (req, res) => {
  try { 
    var otp = Math.floor(
      Math.random() * (1000000 - 100000) + 100000
    );
    
    let mail_html = start_forget_password_html + otp + end_forget_password_html;
    // setup e-mail data
    var mailOptions = {
        from: '"Leo " <agniotridrushtadyumna@gmail.com>', // sender address (who sends)
        to: req.body.email, // list of receivers (who receives)
        subject: 'OTP for sign up confirmation', // Subject line
        text: 'Leo', // plaintext body
        attachments: [{
             filename: 'Logo.png',
             path: __dirname + '/Logo.png',
             cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
        }],
        html: mail_html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(400).json({ "msg" : error });  
            return;
        }
    });

    let v = {
      "user_name" : req.body.user_name,
      "email" : req.body.email,
      "otp" : otp 
    };

    for(var i = 0; i < otps.length; i++){
      if(otps[i].user_name == v.user_name && otps[i].email == v.email){
        otps.splice(i, 1);
        break;
      }
    }

    otps.push(v);
    setTimeout(removeotp, 300000, v);
    res.status(200).json({"msg" : "otp sent successfully"});
  } catch (e) {
    res.status(400).json({ "msg" : e });  
  }
});


LeoHelp.route("/otp").post(async (req, res) => {
  try {
    var otp = Math.floor(
      Math.random() * (1000000 - 100000) + 100000
    );

    let mail_html = start_html + otp + end_html;
    // setup e-mail data
    var mailOptions = {
        from: '"Leo " <agniotridrushtadyumna@gmail.com>', // sender address (who sends)
        to: req.body.email, // list of receivers (who receives)
        subject: 'OTP for sign up confirmation', // Subject line
        text: 'Leo', // plaintext body
        attachments: [{
             filename: 'Logo.png',
             path: __dirname + '/Logo.png',
             cid: 'logo' //my mistake was putting "cid:logo@cid" here! 
        }],
        html: mail_html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(400).json({ "msg" : error });  
            return;
        }
    });

    let v = {
      "user_name" : req.body.user_name,
      "email" : req.body.email,
      "otp" : otp 
    };

    for(var i = 0; i < otps.length; i++){
      if(otps[i].user_name == v.user_name && otps[i].email == v.email){
        otps.splice(i, 1);
        break;
      }
    }

    otps.push(v);
    setTimeout(removeotp, 300000, v);
    res.status(200).json({"msg" : "otp sent successfully"});
  } catch (e) {
    res.status(400).json({ "msg" : e });  
  }
});

// check if user has entered correct otp
LeoHelp.route("/validate/otp").post(async (req, res) => {
  let v = {
          "user_name" : req.body.user_name,
          "email" : req.body.email,
          "otp" : req.body.otp 
        };
  let flag = false;
  for(var i = 0; i < otps.length; i++){
    if(v.user_name == otps[i].user_name && v.email == otps[i].email && v.otp == otps[i].otp){
      flag = true;
      break;
    }
  }
  if(flag == true){
     res.status(200).json({ Success: 1 });
  }
  else
     res.status(400).json({ Success: 0 });
});

// Add a new user
LeoHelp.route("/user/add").post(async (req, res) => {
  try {
    if( 
      req.body.user_name.length != 0 &&
      req.body.phone.toString().length >= 8 &&
      req.body.password.length >= 8 &&
      req.body.name.length != 0) {
         let v = {
          "user_name" : req.body.user_name,
          "email" : req.body.email,
          "otp" : req.body.otp 
        };
        let flag = false;
        for(var i = 0; i < otps.length; i++){
          if(v.user_name == otps[i].user_name && v.email == otps[i].email && v.otp == otps[i].otp){
            otps.splice(i, 1);
            flag = true;
            break;
          }
        }
        req.body.datetime = getDateTime();

        if(flag == false){
           res.status(400).json({"msg" : "incorrect otp or otp expired"});
           return;
        }
        else{       
            let data = await user.findOne({ user_name: req.body.user_name });
            if (data != null) res.status(400).json({"msg" : "username already used"});
            else{
              var salt = bcrypt.genSaltSync(12);
              req.body.password = bcrypt.hashSync(req.body.password, salt);
              req.body.log = []
              req.body.log.push({"operation" : " SignUp", "ip" : req.connection.remoteAddress, "datetime" : req.body.datetime, "text" : "Username : " + req.body.user_name  + 
                ", Name : " + req.body.name + ", Phone : " + req.body.phone + 
                ", Email : " + req.body.email + " User successfully registered"});
            
              let cr = new user(req.body);
              ////
              try{
                cr.redirect_to_police = false;
                console.log("here");
              }
              catch(e){
                console.log(e);
              }
              ////

              let token = await generateToken(req.body.user_name);
              cr.set("token", token);
              cr.save()
                .then(cr => {
                  res.status(200).json(cr);
                })
                .catch(err => {
                  console.log(err);
                  res.status(400).json({ "msg" : err });
                });
            }
       }
    } else {
      res.status(400).json({ "msg" : " bad username or password \n phone number should be 10 in length \n no field can be empty\n" });
    }
  } catch (e) {
    res.status(400).json({ "msg" : e });
  }
});

// Check if user exists
LeoHelp.route("/user/login").post(async (req, res) => {
  try {
    let data = await user.findOne({
      user_name: req.body.user_name//,
    });
    if (data !== null && bcrypt.compareSync(req.body.password, data.password)) {
      data.log.push({"operation" : "SignIn ", "ip" : req.connection.remoteAddress, "datetime" : getDateTime(), "text" : req.body.user_name + " Signed into Leo"});
          
      await user.findByIdAndUpdate(
        data._id,
        {
          $set: data
        },
        (error, data) => {
          if (error) res.status(400).json({ msg: e });
        }
      );
        let token = await generateToken(req.body.user_name);
        data.set("token", token);
        res.status(200).json(data);
        return;
    }
    else{
      res.status(400).json({ msg: " login unsuccessfull" });
      return;
    }
  } catch (e) {
    res.status(400).json({ msg: e });
  }
});

// Get Information of user from its user_name
LeoHelp.route('/user/get').post(async (req, res) => {
  if(! await authenticateToken(req.body.token)){
    res.status(401).json({"msg" : "user not authenticated"});
    return;
  }
  req.body.user_name = req.body.user_name.replace('"', '');
  req.body.user_name = req.body.user_name.replace('"', '');
  let data = await user.findOne({user_name : req.body.user_name });
  if(data != null){
    res.status(200).json(data)
  }
  else
    res.status(400).json({'msg' : 'No user with given user_name'});
});

// check if user with given user_name exists
LeoHelp.route("/user/exists").post(async (req, res) => {
  let data = await user.findOne({ user_name: req.body.user_name });
  if(data != null){
     res.status(400).json({ Success: 0 });
  }
  else
     res.status(200).json({ Success: 1 });
});

// Get ECs from username
LeoHelp.route("/user/emergency_contacts").post(async (req, res) => {
  if(! await authenticateToken(req.body.token)){
    res.status(401).json({"msg" : "user not authenticated"});
    return;
  }
  req.body.user_name = req.body.user_name.replace('"', "");
  req.body.user_name = req.body.user_name.replace('"', "");
  let data = await user.findOne({ user_name: req.body.user_name });
  if (data != null) {
    res.status(200).json(data.emergencyContacts);
    return;
  }
  res.status(400).json({ msg: " errror" });
});

// Upadate ECs, query by user_name
LeoHelp.route("/user/update/emergency_contacts").put(async (req, res) => {
  if(! await authenticateToken(req.body.token)){
    res.status(401).json({"msg" : "user not authenticated"});
    return;
  }
  let data = await user.findOne({ user_name: req.body.user_name });
  if(data == null){
    res.status(400).json({ msg: "No such user" });
    return;
  }
  data.emergencyContacts = [
      req.body.ec1,
      req.body.ec2,
      req.body.ec3,
      req.body.ec4,
      req.body.ec5
    ];
  data.datetime = getDateTime();
  data.log.push({"operation" : "Update EmergencyContacts ", "ip" : req.connection.remoteAddress, "datetime" : data.datetime,  
                  "text" : " emergency contacts updated to " + String(data.emergencyContacts)});
      
  await user.findByIdAndUpdate(
    data._id,
    {
      $set: data
    },
    (error, data) => {
      if (error) res.status(400).json({msg : error});
    }
  );
  res.status(200).json({ msg: data });
});


// Mark an user in trouble
LeoHelp.route("/user/redirect_to_police").put(async (req, res) => {
  try {
    let data = await user.findOne({ user_name: req.body.user_name });
    data.redirect_to_police = true;
    data.type = "app-redirect";
    user.findByIdAndUpdate(
      data._id,
      {
        $set: data
      },
      (error, data) => {
        //Requiring user data after marking the trouble
        if (error) {
          res.status(400).json({ err: error.message });
        } else {
          res.status(200).json(data);
        }
      }
    );
  }
  catch(e){
      res.status(400).json({ "msg" : e });  
  }
});

// recreate_password
LeoHelp.route("/user/recreate_password").put(async (req, res) => {
  
  req.body.user_name = req.body.user_name.replace('"', "");
  req.body.user_name = req.body.user_name.replace('"', "");
  let data = await user.findOne({ user_name: req.body.user_name });
  
  if(data == null){ 
      res.status(400).json({ err : "No usuch user_name "});
      return;
  }

  var salt = bcrypt.genSaltSync(12);
  req.body.password = bcrypt.hashSync(req.body.password, salt);
  
  data.password = req.body.password;
  let data1 = data;
  user.findByIdAndUpdate(
    data._id,
    {
      $set: data
    },
    (error, data) => {
      //Requiring user data after marking the trouble
      if (error) {
        res.status(400).json({ err: error.message });
      } else {
        res.status(200).json(data1);
      }
    }
  );
});

// Mark an user in trouble
LeoHelp.route("/user/mark_trouble").put(async (req, res) => {
  if(req.body.token == "bot"){
      req.body.datetime = getDateTime();
      req.body.remoteAddress = "0";
      req.body.log.push({"operation" : "Mark Trouble ", "type" : "bot", "ip" : req.connection.remoteAddress, "datetime" : req.body.datetime,
                  "text" : "Username : " + req.body.user_name  + ", Phone : " + req.body.phone + ", Marked in trouble through bot"});
      let cr = new user(req.body);      
      cr.save()
        .then(cr => {
          // Requiring user data after registering
          res.status(200).json(cr);
        })
        .catch(err => {
          res.status(400).json({ Error: err });
        });
        return;
  }
  // authenticate platform user
  if(! await authenticateToken(req.body.token)){
    res.status(401).json({"msg" : "user not authenticated"});
    return;
  }
  req.body.user_name = req.body.user_name.replace('"', "");
  req.body.user_name = req.body.user_name.replace('"', "");
  let data = await user.findOne({ user_name: req.body.user_name });
  
  if(data == null){ 
      return;
  }

  // get area for given latitude and longitude
  let start =
    "http://api.opencagedata.com/geocode/v1/json?key=4a4590286e2c474ca287e179cd718be9&q=";
  let mid = "%2C+";
  let end = "&pretty=1&no_annotations=1";
  let url = start + req.body.latitude + mid + req.body.longitude + end;
  let settings = { method: "Get" };
  await fetch(url, settings)
    .then(res => res.json())
    .then(json => {
      formatted = json.results[0].formatted;
    });
  req.body.area = formatted;


  req.body.datetime = getDateTime();

  req.body.log = data.log;

  req.body.log.push({"operation" : "Mark Trouble ", "ip" : req.connection.remoteAddress, "datetime" : req.body.datetime,
                  "text" : "Username : " + req.body.user_name  + ", Name : " + req.body.name + ", Phone : " + req.body.phone + 
                  ", Email : " + req.body.email + ", Area : " + req.body.area + ", latitude " + req.body.latitude + ", longitude " + 
                  req.body.longitude +  ", Marked in trouble"});
           
  user.findByIdAndUpdate(
    data._id,
    {
      $set: req.body
    },
    (error, data) => {
      //Requiring user data after marking the trouble
      if (error) {
        res.status(400).json({ err: error.message });
      } else {
        res.status(200).json(req.body);
      }
    }
  );
});

// Register a complaint
LeoHelp.route("/user/complaint").put(async (req, res) => {
   try {
      let data = await user.findOne({ user_name: req.body.user_name });
      data.complaint = true;
      data.category = req.body.category;
      data.description = req.body.description;
      data.image_url = req.body.image_url;
      data.log.push({"operation" : " Registering complaint ", "ip" : req.connection.remoteAddress, "datetime" : getDateTime(),  
                  "text" : "Username : " + req.body.user_name + " registered a complaint"});  
      data.save();
      console.log("done");
      res.status(200).json({Success : 1});
      return;
    }
    catch (e) {
      console.log(e);
      res.status(400).json({"msg" : e});
      return;
    } 
    res.status(400).json({Success : 0});
});

// Unmark inTrouble (false) for an user
LeoHelp.route("/user/unmark_trouble").put(async (req, res) => {
  try {
    if(! await authenticateToken(req.body.token)){
      res.status(401).json({"msg" : "user not authenticated"});
      return;
    }
    let data = await user.findOne({ user_name: req.body.user_name });
    data.inTrouble = false;
    data.longitude = req.body.longitude;
    data.latitude = req.body.latitude;
    data.contact_back = req.body.contact_back;

    try{
      data.user_unmark = req.body.user_unmark;  
    }
    catch(e){
      console.log(e);
    }
    //data.user_mark = req.body.user_mark;

    data.datetime = getDateTime();
     
    data.log.push({"operation" : " Unmark Trouble ", "ip" : req.connection.remoteAddress, "datetime" : data.datetime,  
                  "text" : "Username : " + req.body.user_name + " UnMarked from trouble"});  
    data.save();
    
    res.status(200).json({data});
    return;
  } catch (e) {
    res.status(400).json({ Error: " Error unmarking user in trouble" });
    return;
  }
  res.status(400).json({ "message ": req.body.user_name + " is unmarked " });
});


// Unmark inTrouble (false) for an user
LeoHelp.route("/user/unmark_trouble_bot").put(async (req, res) => {
  try {
    let data = await user.findOne({ user_name: req.body.user_name });
    data.inTrouble = false;
    data.save();
    res.status(200).json({data});
    return;
  } catch (e) {
    res.status(400).json({ Error: " Error unmarking user in trouble" });
    return;
  }
  res.status(400).json({ "message ": req.body.user_name + " is unmarked " });
});

LeoHelp.route("/user/logout").post(async (req, res) => {
  try {
     if(! await authenticateToken(req.body.token)){
      res.status(401).json({"msg" : "user not authenticated"});
      return;
    }
    let data = await user.findOne({
      user_name: String(req.body.user_name)//,
    });
    data.log.push({"operation" : "Signout ", "ip" : req.connection.remoteAddress, "datetime" : getDateTime(), "text" : req.body.user_name + " SignedOut Leo"});
   
    await user.findByIdAndUpdate(
      data._id,
      {
        $set: data
      },
      (error, data) => {
        if (error) res.status(400).json({ msg: e });
        else {
          res.status(200).json({Success : 1})
          return;
        }
      }
    );
   
  }catch (e) {
    res.status(400).json({ msg: e});
  }
});

// Mark an user in trouble who doesnt have Leo app
LeoHelp.route("/user/sms_trouble").post(async (req, res) => {
  try {
    let start = "https://api.opencagedata.com/geocode/v1/json?q=";
    let mid = req.body.area;
    let end = "&key=4a4590286e2c474ca287e179cd718be9";
    let url = start + mid + end;
    let settings = { method: "Get" };
    await fetch(url, settings)
      .then(res => res.json())
      .then(json => {
        let n = req.body.name;
        let p = req.body.phone;
        let e = req.body.emergencyContacts;
        let a = json.results[0].formatted;
        let formatted = json.results[0].formatted;

        let u = {
          type : "app",
          name: n,
          user_name: n,
          phone: p,
          emergencyContacts: e,
          area: a,
          email : "",
          inTrouble: true,
          latitude: json.results[0].bounds.northeast.lat,
          longitude: json.results[0].bounds.northeast.lng,
          datetime : getDateTime()
        };

        let cr = new user(u);

        cr.save()
          .then(cr => {
            res
              .status(200)
              .json({Success : 1});
          })
          .catch(err => {
            res.status(400).json({ "msg": err });
          });
      });
      return;
  } catch (e) {
    console.log(e)
    res.status(400).json({ Error: e});
  }
  res.status(200).json({Success : 1});
});

// Check if dro exists
LeoHelp.route("/dro/login").post(async (req, res) => {
  try {
    let data = await DRO.findOne({
      user_name: req.body.user_name//,
      // password: req.body.password
    });
    
    if (data !== null && bcrypt.compareSync(req.body.password, data.password)) {
      let token = await generateToken(req.body.user_name);
      res.status(200).json({"token" : token});
      return;
    }
    res.status(400).json({ msg: " login unsuccessfull" });
  } catch (e) {
    res.status(400).json({ msg: e});
  }
});

// View all users
LeoHelp.route("/allUsers").get(async (req, res) => {
  user.find(function(err, user) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json(user);
    } 
  });
});

// View all users
LeoHelp.route("/dro/all_users").post(async (req, res) => {
  let token = req.body.token;

  req.body.user_name = req.body.user_name.replace('"', "");
  req.body.user_name = req.body.user_name.replace('"', "");
  req.body.password = req.body.password.replace('"', "");
  req.body.password = req.body.password.replace('"', "");
  
  if(! await authenticateToken(token)){
    console.log("DRO not authenticated");
    res.status(400).json({"msg" : "DRO not authenticated"});
    return;
  }
  let data = await DRO.findOne({
    user_name: req.body.user_name//,
    // password: req.body.password
  });
  if (data == null) {
      console.log("DRO not validated");
      res.status(400).json({"msg" : "DRO not validated"});
      return;
  }
  if(bcrypt.compareSync(req.body.password, data.password)){
    user.find(function(err, user) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(user);
      }
    });
  }
});

LeoHelp.route("/police/login").post(async (req, res) => {
  try {
    let data = await police.findOne({
      user_name: req.body.user_name//,
      // password: req.body.password
    });
    if (data !== null && req.body.password == data.password) {  
      let token = await generateToken(req.body.user_name);
      res.status(200).json({"token" : token});
      return;
    }
    res.status(400).json({ msg: " login unsuccessfull" });
  } catch (e) {
  //   res.status(400).json({ msg: e});
  }
});

// View all marked allUsers
LeoHelp.route("/police/all_users").get(async (req, res) => {
  user.find(function(err, usr) {
      if (err) {
        console.log(err);
      } else {
        var r = [];
        for (index = 0; index < usr.length; index++) {
          if (usr[index].type == "app-redirect") {
            r.push(usr[index]);
          }
        }
        res.status(200).json(r);
      }
    });
});


// View all marked allUsers
LeoHelp.route("/dro/all_marked_users").post(async (req, res) => {
  // let token = req.body.token;
  // if(! await authenticateToken(token)){
  //   res.status(400).json({"msg" : "DRO not authenticated"});
  //   return;
  // }
  let data = await DRO.findOne({
    user_name: req.body.user_name,
    password: req.body.password
  });
  if (data == null && bcrypt.compareSync(req.body.password, data.password)) {
      res.status(400).json({"msg" : "DRO not validated"});
      return;
  }
  if(bcrypt.compareSync(req.body.password, data.password)){
    user.find(function(err, usr) {
      if (err) {
        console.log(err);
      } else {
        var r = [];
        for (index = 0; index < usr.length; index++) {
          if (usr[index].inTrouble == true) {
            r.push(usr[index]);
          }
        }
        res.status(200).json(r);
      }
    });
  }
});

LeoHelp.route("/dro/user_unmarked_himself").get(async (req, res) => {
    user.find(function(err, usr) {
      if (err) {
        console.log(err);
      } else {
        var r = [];
        for (index = 0; index < usr.length; index++) {
          if (usr[index].user_unmark == true) {
            r.push(usr[index]);
          }
        }
        res.status(200).json(r);
      }
    });
  // }
});


LeoHelp.route("/contact").post(async (req, res) => {
  try {
    let mail_html = '<html><body><p>' + req.body.email + '</p><p>' + req.body.msg + '</p></body></html>';
    // setup e-mail data
    let mailOptions = {
        from: '"Leo " <agniotridrushtadyumna@gmail.com>', // sender address (who sends)
        to: "kankalps17.comp@coep.ac.in", // list of receivers (who receives)
        subject: 'contact', // Subject line
        text: 'Leo', // plaintext body
        html: mail_html // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(400).json({ "msg" : error });  
            return;
        }
    });

    mailOptions = {
        from: '"Leo " <agniotridrushtadyumna@gmail.com>', // sender address (who sends)
        to: req.body.email, // list of receivers (who receives)
        subject: 'contact', // Subject line
        text: 'Leo', // plaintext body
        html: '<html><body><p>Thanks for contacting Leo </p></body></html>' // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            res.status(400).json({ "msg" : error });  
            return;
        }
    });

    res.status(200).json({"msg" : "message sent successfully"});
    return;
  } catch (e) {
    res.status(400).json({ "msg" : e });  
  }
});

var start_forget_password_html = '<!DOCTYPE html>\
<html>\
<head>\
    <title></title>\
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
    <meta name="viewport" content="width=device-width, initial-scale=1">\
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\
    <style type="text/css">\
        @media screen {\
            @font-face {\
                font-family: \'Lato\';\
                font-style: normal;\
                font-weight: 400;\
            }\
\            @font-face {\
                font-family: \'Lato\';\
                font-style: normal;\
                font-weight: 700;\
                src: local(\'Lato Bold\'), local(\'Lato-Bold\'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format(\'woff\');\
            }\
\            @font-face {\
                font-family: \'Lato\';\
                font-style: italic;\
                font-weight: 400;\
            }\
\            @font-face {\
                font-family: \'Lato\';\
                font-style: italic;\
                font-weight: 700;\
            }\
        }\
\        /* CLIENT-SPECIFIC STYLES */\
        body,\
        table,\
        td,\
        a {\
            -webkit-text-size-adjust: 100%;\
            -ms-text-size-adjust: 100%;\
        }\
\        table,\
        td {\
            mso-table-lspace: 0pt;\
            mso-table-rspace: 0pt;\
        }\
\        img {\
            -ms-interpolation-mode: bicubic;\
        }\
\        /* RESET STYLES */\
        img {\
            border: 0;\
            height: auto;\
            line-height: 100%;\
            outline: none;\
            text-decoration: none;\
        }\
\        table {\
            border-collapse: collapse !important;\
        }\
\        body {\
            height: 100% !important;\
            margin: 0 !important;\
            padding: 0 !important;\
            width: 100% !important;\
        }\
\        /* iOS BLUE LINKS */\
        a[x-apple-data-detectors] {\
            color: inherit !important;\
            text-decoration: none !important;\
            font-size: inherit !important;\
            font-family: inherit !important;\
            font-weight: inherit !important;\
            line-height: inherit !important;\
        }\
\        /* MOBILE STYLES */\
        @media screen and (max-width:600px) {\
            h1 {\
                font-size: 32px !important;\
                line-height: 32px !important;\
            }\
        }\
\        /* ANDROID CENTER FIX */\
        div[style*="margin: 16px 0;"] {\
            margin: 0 !important;\
        }\
    </style>\
</head>\
\<body style="background-color: #DAE1E7; margin: 0 !important; padding: 0 !important;">\
    <!-- HIDDEN PREHEADER TEXT -->\
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account. </div>\
    <table border="0" cellpadding="0" cellspacing="0" width="100%">\
        <!-- LOGO -->\
        <tr>\
            <td bgcolor="#DAE1E7" align="center">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td align="center" valign="top" style="padding: 20px 10px 20px 10px;"> </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#DAE1E7" align="center" style="padding: 0px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Reset your password</h1> <img src="cid:logo" width="125" height="120" style="display: block; border: 0px;" />\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 15px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;">Need to reset your password? No problem! Just enter this One Time Pad, set another password for your account and you\'ll be on your way.</p>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 5px 30px 15px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0; text-align:center;"><b>'

var end_forget_password_html = 
'</b></p>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;">If you didn\'t request this, you can safely ignore this email.</p>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;"><b>Cheers,<br/>Team LeoCode</b></p>\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#27496D" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #FFFFFF; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;">This is a one-time email sent to verify your email address.<br/><a href="#" style = " color:#FFFFFF">LeoPlatform</a><br/>Download our App</a><br/>Chatbot available on Whatsapp and Telegram</p>\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        \
    </table>\
</body>\
</html>'



var start_html = '\
<!DOCTYPE html>\
<html>\
<head>\
    <title></title>\
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />\
    <meta name="viewport" content="width=device-width, initial-scale=1">\
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />\
    <style type="text/css">\
        @media screen {\
            @font-face {\
                font-family: \'Lato\';\
                font-style: normal;\
                font-weight: 400;\
            }\
\            @font-face {\
                font-family: \'Lato\';\
                font-style: normal;\
                font-weight: 700;\
                src: local(\'Lato Bold\'), local(\'Lato-Bold\'), url(https://fonts.gstatic.com/s/lato/v11/qdgUG4U09HnJwhYI-uK18wLUuEpTyoUstqEm5AMlJo4.woff) format(\'woff\');\
            }\
\            @font-face {\
                font-family: \'Lato\';\
                font-style: italic;\
                font-weight: 400;\
            }\
\            @font-face {\
                font-family: \'Lato\';\
                font-style: italic;\
                font-weight: 700;\
            }\
        }\
\        /* CLIENT-SPECIFIC STYLES */\
        body,\
        table,\
        td,\
        a {\
            -webkit-text-size-adjust: 100%;\
            -ms-text-size-adjust: 100%;\
        }\
\        table,\
        td {\
            mso-table-lspace: 0pt;\
            mso-table-rspace: 0pt;\
        }\
\        img {\
            -ms-interpolation-mode: bicubic;\
        }\
\        /* RESET STYLES */\
        img {\
            border: 0;\
            height: auto;\
            line-height: 100%;\
            outline: none;\
            text-decoration: none;\
        }\
\        table {\
            border-collapse: collapse !important;\
        }\
\        body {\
            height: 100% !important;\
            margin: 0 !important;\
            padding: 0 !important;\
            width: 100% !important;\
        }\
\        /* iOS BLUE LINKS */\
        a[x-apple-data-detectors] {\
            color: inherit !important;\
            text-decoration: none !important;\
            font-size: inherit !important;\
            font-family: inherit !important;\
            font-weight: inherit !important;\
            line-height: inherit !important;\
        }\
\        /* MOBILE STYLES */\
        @media screen and (max-width:600px) {\
            h1 {\
                font-size: 32px !important;\
                line-height: 32px !important;\
            }\
        }\
\        /* ANDROID CENTER FIX */\
        div[style*="margin: 16px 0;"] {\
            margin: 0 !important;\
        }\
    </style>\
</head>\
\<body style="background-color: #DAE1E7; margin: 0 !important; padding: 0 !important;">\
    <!-- HIDDEN PREHEADER TEXT -->\
    <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: \'Lato\', Helvetica, Arial, sans-serif; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;"> We\'re thrilled to have you here! Get ready to dive into your new account. </div>\
    <table border="0" cellpadding="0" cellspacing="0" width="100%">\
        <!-- LOGO -->\
        <tr>\
            <td bgcolor="#DAE1E7" align="center">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td align="center" valign="top" style="padding: 20px 10px 20px 10px;"> </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#DAE1E7" align="center" style="padding: 0px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#ffffff" align="center" valign="top" style="padding: 40px 20px 20px 20px; border-radius: 4px 4px 0px 0px; color: #111111; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 48px; font-weight: 400; letter-spacing: 4px; line-height: 48px;">\
                            <h1 style="font-size: 48px; font-weight: 400; margin: 2;">Welcome!</h1> <img src="cid:logo" width="125" height="120" style="display: block; border: 0px;" />\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#f4f4f4" align="center" style="padding: 0px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 20px 30px 15px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;">Your Leo Platform account is ready! Please confirm that this is your email address by entering this OTP:</p>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 5px 30px 15px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0; text-align:center;"><b>';

var end_html = '</b></p>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 20px 30px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;">If you didn\'t request this, you can safely ignore this email.</p>\
                        </td>\
                    </tr>\
                    <tr>\
                        <td bgcolor="#ffffff" align="left" style="padding: 0px 30px 40px 30px; border-radius: 0px 0px 4px 4px; color: #666666; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;"><b>Cheers,<br/>Team LeoCode</b></p>\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        <tr>\
            <td bgcolor="#f4f4f4" align="center" style="padding: 30px 10px 0px 10px;">\
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">\
                    <tr>\
                        <td bgcolor="#27496D" align="center" style="padding: 30px 30px 30px 30px; border-radius: 4px 4px 4px 4px; color: #FFFFFF; font-family: \'Lato\', Helvetica, Arial, sans-serif; font-size: 18px; font-weight: 400; line-height: 25px;">\
                            <p style="margin: 0;">This is a one-time email sent to verify your email address.<br/><a href="#">LeoPlatform</a><br/>Download our App</a><br/>Chatbot available on Whatsapp and Telegram</p>\
                        </td>\
                    </tr>\
                </table>\
            </td>\
        </tr>\
        \
    </table>\
</body>\
</html>';
