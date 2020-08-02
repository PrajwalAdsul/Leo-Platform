import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import LoggedIn from './LoggedIn';
import Header from '../Styling/Header';
var firebase = require('firebase/app');
require('firebase/auth');
require('firebase/storage');

var firebaseConfig = {
    apiKey: "AIzaSyAZjmXR1XCzKcJ8ZLJ1ByUq-cm4MIr5f40",
    authDomain: "dropbox-8805b.firebaseapp.com",
    storageBucket: "dropbox-8805b.appspot.com",
    databaseURL: "https://dropbox-8805b.firebaseio.com"
  };
firebase.initializeApp(firebaseConfig);

var storage = firebase.storage();
var storageref = firebase.storage().ref();
var file = null;
var uploadTask = null;
var filenames = new Set();

/*
 * Class to implement sign up functionality for user
 */
export default class Form extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			name : "",
			user_name : "",
			category : "",
			description : "",
			image_url : "",
			token : null,
			contact_back : false
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {

		var {name, value} = event.target
		if (name == "contact_back"){
			value = !this.state.contact_back
		}
		this.setState({
			[name]: value
		})
	}

	onSubmit = async e => {
			const data = {
				user_name : this.props.user_name,
				token :  await localStorage.getItem('token'),
				category : this.state.category,
				description : this.state.description,
				image_url : this.state.image_url,
				contact_back : this.state.contact_back
			}
			// await axios.post('http://localhost:5000/LeoHelp/addUser', data)
			console.log(data.contact_back)
			await axios.put('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/user/complaint', data)
			.then(response => {
				this.setState({
					user_name : "",
					complaint : "",
					category : "",
					description : "",
					image_url : "",
					contact_back : false
				});
				window.location.reload();
			})
			.catch(error => {
				//console.log(error.response);
				this.setState({
						errorText : error.response.data.msg
					});
			});
			
	}

	onChange = (event) => {
		file = event.target.files[0];
	};

	uploadImage = async e => {
		// do uploading to firebase here
		// firebase will return url of uploaded image
		var image_url = "";
		if (file != null) {
	    	var p = document.createElement("p");
	    	var div = document.getElementById("storage");
	    	p.innerHTML = "Uploading...";
	    	p.setAttribute("id", "status");
	    	div.appendChild(p);
	      try {
	        uploadTask = storageref.child(file.name).put(file);
	        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
	          function(snapshot) {
	            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
	            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
	            console.log('Upload is ' + progress + '% done');
	            switch (snapshot.state) {
	              case firebase.storage.TaskState.PAUSED: // or 'paused'
	                console.log('Upload is paused');
	                break;
	              case firebase.storage.TaskState.RUNNING: // or 'running'
	                console.log('Upload is running');
	                break;
	              case firebase.storage.TaskState.PROGRESS:
	                console.log('Upload is in progress');
	                break;
	              default:
	                alert(snapshot.state);
	                break;
	            }
	          }
	          , function(error) {

	          // A full list of error codes is available at
	          // https://firebase.google.com/docs/storage/web/handle-errors
	          switch (error.code) {
	            case 'storage/unauthorized':
	              // User doesn't have permission to access the object
	              console.log(error.code);
	              break;
	            case 'storage/canceled':
	              // User canceled the upload
	              console.log(error.code);
	              break;
	            case 'storage/unauthenticated':
	              // User is unauthenticated to access the object
	              console.log(error.code);
	              break;
	            case 'storage/object-not-found':
	              // User object-not-found the upload
	              console.log(error.code);
	              break;
	            case 'storage/bucket-not-found':
	              // User bucket-not-found the upload
	              console.log(error.code);
	              break;
	            case 'storage/project-not-found':
	              // User project-not-found the upload
	              console.log(error.code);
	              break;
	            case 'storage/quota-exceeded':
	              // User quota-exceeded the upload
	              console.log(error.code);
	              break;
	            case 'storage/invalid-url':
	              // User invalid-url the upload
	              console.log(error.code);
	              break;
	            case 'storage/invalid-argument':
	              // User invalid-argument the upload
	              console.log(error.code);
	              break;
	            case 'storage/unknown':
	              // Unknown error occurred, inspect error.serverResponse
	              console.log(error.code);
	              break;
	            default:
	              console.log("109"+error.code);
	              break;
	          }
	        }
	        , function() {
	          // Upload completed successfully, now we can get the download URL
	          var p = document.getElementById("status");
	          p.innerHTML = "Uploaded Successfully";
	          uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
	          	p.remove();
	          	this.setState({
					"image_url" : downloadURL
				});
	          }.bind(this));
	          
	        }.bind(this));
	      } catch(error) {
	        console.log(error.code);
	      }
	    }
		// at the end
		this.setState({
			"image_url" : image_url
		});
		console.log(image_url);
	}

	render() {
		return (
			<div>
				<center>
					<div className="jumbotron shadow-lg new-jumbotron">
				
					<h2>FO<span className="change-color">RM</span></h2>
					<hr />

					<form onSubmit = {this.onSubmit}  className="login-form">
						<div className="form-group">
							<div className="row">
								<div className="col-md-5">
									<label htmlFor="name">category:</label>
								</div>
								<div className="col-md-7">
									<input type="text" className="form-control" value={this.state.category} name="category" id="category" placeholder="category" onChange={this.handleChange} required/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<div className="row">
								<div className="col-md-5">
									<label htmlFor="name">description:</label>
								</div>
								<div className="col-md-7">
									<input type="text" className="form-control" value={this.state.description} name="description" id="description" placeholder="description" onChange={this.handleChange} required/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<div className="row">
								<div className="col-md-5">
									<label htmlFor="name">Select a file to upload:</label>
								</div>
								<div className="col-md-7" id="storage">
									<input type = "file" className="form-control" id = "myid" onChange={this.onChange} multiple/>
								</div>
							</div>
						</div>					
						<center> <button type="button" onClick={this.uploadImage} >uploadImage</button></center>

						<div className="form-group">
							<div className="row">
								<div className="col-md-10">
									<label htmlFor="name">Do you want us to contact you back?</label>
								</div>
								<div className="col-md-2">
									<input type="checkbox" className="form-control" name="contact_back" id="contact_back" onChange={this.handleChange} required/>
								</div>
							</div>
						</div>

						<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary">Submit</button></center>
											
					</form>
				
				</div>
			</center>
			</div>
		)
	}
}
