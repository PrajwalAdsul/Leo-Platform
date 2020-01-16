import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, user_nameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import LoggedIn from './LoggedIn';

export default class UserSignIn extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			user_name:"",
			password:"",
			error: false,
			loginSuccess: false,
			errorMessage: ""
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})

	}

	onSubmit = async e => {

		//e.preventDefault();
		const data = {
			user_name : this.state.user_name,
			password : this.state.password
		};
		var res;
		//console.log(data);
		await axios.post('http://localhost:4001/LeoHelp/loginIn', data)
		.then(response => {
			console.log(response);
			res = response.status;
		})
		.catch(error => {
			console.log(error.response);
			this.setState({
				password: ""
			});
		});
//		const res = await UserRegistration(data);
			//add axios code
			// res = 200;
			if(res === 200) {
				console.log("IN");
					this.setState({
					loginSuccess : true
					});
			} else {
				console.log("1234")
			this.setState({
				errorMessage: "Username or password is incorrect",
				password: ""
		//		error: true,
		//		register: false
			});
		}
	}

	componentWillMount() {
		localStorage.setItem('session_start', null);	
		try{
			localStorage.getItem('user_name' && this.setState({
				user_name : JSON.parse(localStorage.getItem('user_name'))
				//password : JSON.parse(localStorage.getItem('password'))
			}))
		}
		catch(e){

		}
	}

	componentDidMount(){
		if(!localStorage.getItem('user_name') || !localStorage.getItem('password')){
			this.onSubmit();
		}
		else{
			console.log('Using data from localStorage');
		}
	}

	componentWillUpdate(nextProps, nextState) {
		localStorage.setItem('user_name', JSON.stringify(nextState.user_name));
		localStorage.setItem('password', JSON.stringify(nextState.password));
	}

	render() {
		

		const { loginSuccess, error } = this.state;
		if (this.state.loginSuccess == true) {
			localStorage.setItem('session_start', "start");
			console.log(localStorage.getItem('user_name'))
			return <LoggedIn user_name = {this.state.user_name}  />
		}

		return (
			<form onSubmit={this.handleSubmit}>
				<h1>User Sign In</h1>
				<h3>user_name: </h3>
				<input type="text" name="user_name" value={this.state.user_name} placeholder="user_name" onChange={this.handleChange} />
				<h3>Password: </h3>
				<input type="password" name="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
				
				<button type="button" onClick={this.onSubmit} className="btn btn-primary">Sign In</button>
						
				<Link to = "/UserSignUp">SignUp </Link>
				<h3>{this.state.user_name} {this.state.password}</h3>
				<h3>{this.state.errorMessage}</h3>
			</form>
		)

	}
}
