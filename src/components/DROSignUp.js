import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import DROPanel from './DROPanel';
import Header from './Header';

export default class DROSignUp extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			name:"",
			user_name:"",
			password:"",
			phone_no : "",
			email : "",
			latitude : 0,
			longitude : 0,
			area : 0,
			confirmpassword: "",
			passwordError: "",
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
			latitude : this.state.latitude,
			longitude : this.state.longitude
		};
		var res;
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/addDRO', data)
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
			});

		} else {
		}
	}
	render() {
		if (this.state.loginSuccess == true) {
			return <DROPanel />
		}

		return (
			<div>
			<Header />
			<center>
			<form onSubmit={this.handleSubmit}>
				<h1>DRO Sign Up</h1>
				<h3>Name: </h3>
				<input type="text" name="name" value={this.state.name} placeholder="name" onChange={this.handleChange} />
				<h3>Mobile No: </h3>
				<input type="number" name="phone" value={this.state.phone} placeholder="phone" onChange={this.handleChange} />
				<h3>Email: </h3>
				<input type="email" name="email" value={this.state.email} placeholder="email" onChange={this.handleChange} />
				<h3>username: </h3>
				<input type="text" name="user_name" value={this.state.user_name} placeholder="user_name" onChange={this.handleChange}/>
				<h3>Password: </h3>
				<input type="password" name="password" value={this.state.password} placeholder="Password" onChange={this.handleOnChangePassword} />
				<h3>Confirm Password: </h3>
				<input type="password" name="confirmpassword" value={this.state.confirmpassword} placeholder="Password" onChange={this.handleOnChangeConfirmPassword} />

				<h3>Latitude: </h3>
				<input type="number" name="latitude" value={this.state.latitude} placeholder="latitude" onChange={this.handleChange} />
				<h3>Longitude: </h3>
				<input type="number" name="longitude" value={this.state.longitude} placeholder="longitude" onChange={this.handleChange} />
				<h3>Area: </h3>
				<input type="text" name="area" value={this.state.area} placeholder="area" onChange={this.handleChange} />
		
				
				<button type="button" onClick={this.onSubmit} className="btn btn-primary">Sign Up</button>
				<h3>{this.state.passwordError}</h3>
							
				<Link to = "/DROSignIn">SignIn </Link>
				
				<h3>{this.state.user_name} {this.state.password}</h3>
			</form>
			</center>
			</div>
		)
	}
}
