import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import LoggedIn from './LoggedIn';
import Header from './Header';

export default class UserSignUp extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			name : "",
			user_name : "",
			password : "",
			confirmpassword : "",
			passwordError : "",
			usernameAlreadyTaken : "",
			phone : '',
			error : false,
			errorText : "",
			loginSuccess : false,
			otp : "",
			signUpDisable : false,
			 errors: {
		        fullName: '',
		        email: '',
		        password: '',
		        phone: ''
		      }
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const validEmailRegex = RegExp(
		  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
		);

  		const validPhoneRegex = RegExp(/^[0-9\b]+$/);

		const {name, value} = event.target
		let errors = this.state.errors;
		this.setState({
			[name]: value
		});
		switch (name) {
	      case 'email': 
	        errors.email = 
	          validEmailRegex.test(value)
	            ? ''
	            : 'Please enter a valid email address';
	        break;
	      case 'password': 
	        errors.password = 
	          value.length < 8
	            ? 'Password must be at least 8 characters'
	            : '';
	        break;
	      case 'phone' :
	      	errors.phone = 
	      		validPhoneRegex.test(value) && value.length == 10
	      		  ? ''
	      		  : 'Please put valid 10-digit Phone Number';

	       break;
	      default:
	        break;
    	}
    	this.setState({errors, [name]: value});
	}

	handleOnChangePassword = async event=> {
		event.preventDefault();
		this.setState({
			password: event.target.value
		});
	}

	handleOnChangeConfirmPassword = async event => {
		event.preventDefault();
		await this.setState({
			confirmpassword: event.target.value
		});
		if(this.state.password != this.state.confirmpassword) {
			this.setState({
				passwordError: "Passwords don't match"
			});
		}
		else{
			this.setState({
				passwordError : "Passwords match :)"
			});
		}
	}

	sha256 = async message => {
		// encode as UTF-8
	    const msgBuffer = new TextEncoder('utf-8').encode(message);                    

	    // hash the message
	    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);

	    // convert ArrayBuffer to Array
	    const hashArray = Array.from(new Uint8Array(hashBuffer));

	    // convert bytes to hex string                  
	    const hashHex = hashArray.map(b => ('00' + b.toString(16)).slice(-2)).join('');
	    return hashHex;	
	}

	bcrypt = async message => {
		var bcrypt = require('bcryptjs');
		const salt = bcrypt.genSaltSync(10);
		const hash = bcrypt.hashSync(message, salt);
		console.log(hash);
		return hash;
	}

	onSubmit = async e => {
		this.setState({
			signUpDisable : true
		});

		if(this.state.password !== this.state.confirmpassword) {
			this.setState({
				passwordError: "Passwords dont match"
			});
			this.setState({
				signUpDisable : false
			});
			return;
		} 
		e.preventDefault();
		if(this.state.password === this.state.confirmpassword) {
			const data = {
				user_name : this.state.user_name,
				password : this.state.password,
				name: this.state.name,
				phone : this.state.phone,
				email: this.state.email,
				otp : this.state.otp,
				inTrouble : false,
				latitude : 0,
				longitude : 0
			};
			data.password = await this.sha256(data.password);
			
			// await axios.post('http://localhost:5000/LeoHelp/addUser', data)
			await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/addUser', data)
			.then(response => {
				this.setState({
					user_name : "",
					loginSuccess : true
				});
			})
			.catch(error => {
				console.log(error.response);
				this.setState({
						errorText : error.response.data.msg
					});
			});
				
		} else {
		}
		this.setState({
			signUpDisable : false
		});
	}


	onOTP = async e => {
		e.preventDefault();
			const data = {
				user_name : this.state.user_name,
				name: this.state.name,
				email: this.state.email,
			};
			var res;
			var resp;


			// await axios.post('http://localhost:5000/LeoHelp/addUser', data)
			
			await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/otp', data)
			.then(response => {
				if(response.status === 200) {
					// this.setState({
					// 	inotp : response.data.otp
					// });	
				} 
				else{
				}
			})
			.catch(error => {
				console.log(error.response);
			});	
				
		}
	render() {
		const {errors} = this.state;
		if (this.state.loginSuccess == true) {
			return <Redirect push to  = "/UserSignIn" />;
		}
		return (
			<div>
			<Header />
				<center>
					<div className="jumbotron shadow-lg new-jumbotron">
				
					<h2>USER <span className="change-color">SIGN</span>UP </h2>
					<hr />

					<form onSubmit = {this.onSubmit}  className="login-form">
					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="name">Name:</label>
						</div>
						<div className="col-md-10">
						<input type="text" className="form-control" value={this.state.name} name="name" id="name" placeholder="Full Name" onChange={this.handleChange} required/>
						</div>
					</div>
					</div>

					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="email">Email:</label>
						</div>
							<div className="col-md-10">
							<input type="email" className="form-control" id="email" name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} required/>
					      <span className='errorMessage'>{errors.email}</span>
          
					</div>
					</div>
					</div>


					<div className="form-row">
					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Username:</label>
						<input type="text" name="user_name" id="user_name" className="form-control" value={this.state.user_name} placeholder="Username" onChange={this.handleChange} required/>
					</div>
						
					<div className="form-group col-md-6">
						<label htmlFor="phone" >Mobile No:</label>
						<input type="number" className="form-control" id="phone" name="phone" value={this.state.phone} placeholder="10-digit Mobile No." onChange={this.handleChange} required/>
						<h4><span className="errorMessage">{errors.phone}</span></h4>
						
					</div>
					</div>

					<div className="form-row">
					<div className="form-group col-md-6">
						<label htmlFor="password" >Password:</label>
						<input type="password" className="form-control" id="password" name="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} required/>
							<span className='errorMessage'>{errors.password}</span>
					</div>
						
					<div className="form-group col-md-6">
						<label htmlFor="confirmpassword" >Confirm Password:</label>
						<input type="password" className="form-control" name="confirmpassword" id="confirmpassword" value={this.state.confirmpassword} placeholder="Confirm Password" onChange={this.handleOnChangeConfirmPassword} />
							<span className="errorMessage">{this.state.passwordError}</span>
						</div>
					</div>

						<br/><br/>
					<div className="form-row">
					
						<div className="form-group col-md-6">
						<label htmlFor="otp" >OTP:</label>
						<input type="number" className="form-control" id="otp" name="otp" value={this.state.otp} placeholder="OTP" onChange={this.handleChange} required/>
						</div>

						<div className="form-group col-md-3">
						<center><button type="button" onClick={this.onOTP} className="btn btn-primary btn-lg">Get OTP</button></center>
						</div>
					</div> 

					<div className="form-row">
						<div className="form-group col-md-6">
						<center><button disabled = {this.state.signUpDisable} type="button" onClick={this.onSubmit} className="btn btn-primary btn-lg">SIGNUP</button></center>
						</div>
					</div>

					<h4><span className="errorMessage">{this.state.usernameAlreadyTaken}</span></h4>	
					<h4><span className="errorMessage">{this.state.errorText}</span></h4>	
						

					</form>
				
				</div>
			</center>
			</div>
		)
	}
}
