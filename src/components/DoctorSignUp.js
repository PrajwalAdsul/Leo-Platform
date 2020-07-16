import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import LoggedIn from './LoggedIn';
import Header from './Header';

export default class DoctorSignUp extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			name:"",
			user_name:"",
			password:"",
			confirmpassword: "",
			passwordError: "",
			phone:0,
			error: false,
			loginSuccess: false
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})

	}

	handleOnChangePassword = async event=> {
		event.preventDefault();
		this.setState({
			password: event.target.value
		});

		if(this.state.password !== this.state.confirmpassword) {
			this.setState({
				passwordError: "Passwords dont match"
			});
		} else {
			this.setState({
				passwordError: ""
			});
		}
	}

	handleOnChangeConfirmPassword = async event => {
		event.preventDefault();
		this.setState({
			confirmpassword: event.target.value
		});

		if(this.state.password !== this.state.confirmpassword) {
			this.setState({
				passwordError: "Incorrect Password"
			});
		} else {
			this.setState({
				passwordError: ""
			});
		}
	}


	onSubmit = async e => {

		e.preventDefault();

		if(this.state.password === this.state.confirmpassword) {

			const data = {
			user_name : this.state.user_name,
			password : this.state.password,
			name: this.state.name,
			phone : this.state.phone,
			email: this.state.email,
			latitude : 18.5293,
			longitude : 73.8565
		};
		var res;
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/addDoctor', data)
		.then(response => {
			console.log(response);
			res = response.status;
		})
		.catch(error => {
			console.log(error.response);
		});
		if(res === 200) {
			console.log("IN");
				this.setState({
				loginSuccess : true
				});
		} else this.setState({
	//		error: true,
	//		register: false
		});

		} else {
			//this.state.passwordError = "Passwords don't match"

		}

		
	}

	render() {
			if (this.state.loginSuccess == true) {
				return <Redirect push to  = "/UserSignIn" />;
			}

		return (

			<div>
			<Header />
				<center>
					<div className="jumbotron">
				
					<h2>DOCTOR <span className="change-color">SIGN</span>UP </h2>
					<hr />

					<form onSubmit = {this.onSubmit}>
					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="name">Name:</label>
						</div>
						<div className="col-md-10">
						<input type="text" className="form-control" value={this.state.name} name="name" id="name" placeholder="Full Name" onChange={this.handleChange}/>
						</div>
					</div>
					</div>

					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="email">Email:</label>
						</div>
							<div className="col-md-10">
							<input type="email" className="form-control" id="email" name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} />
				
					</div>
					</div>
					</div>


					<div className="form-row">
					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Username:</label>
						<input type="text" name="user_name" id="user_name" className="form-control" value={this.state.user_name} placeholder="username" onChange={this.handleChange}/>
					</div>
						
					<div className="form-group col-md-6">
						<label htmlFor="phone" >Mobile No:</label>
						<input type="number" className="form-control" id="phone" name="phone" value={this.state.phone} placeholder="phone" onChange={this.handleChange} />
					</div>
					</div>

					<div className="form-row">
					<div className="form-group col-md-6">
						<label htmlFor="password" >Password:</label>
						<input type="password" className="form-control" id="password" name="password" value={this.state.password} placeholder="Password" onChange={this.handleOnChangePassword} />
				
					</div>
						
					<div className="form-group col-md-6">
						<label htmlFor="confirmpassword" >Confirm Password:</label>
						<input type="password" className="form-control" name="confirmpassword" id="confirmpassword" value={this.state.confirmpassword} placeholder="Confirm Password" onChange={this.handleOnChangeConfirmPassword} />
						</div>
					</div>

					<h4><span className="errorMessage">{this.state.passwordError}</span></h4>
						
						
						<br/><br/>
	
						<center><button type="button" onClick={this.onSubmit} className="btn btn-primary btn-lg">SIGNUP</button></center>
					</form>
				
				</div>
			</center>
			</div>

		)

	}
}
