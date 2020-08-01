import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, user_nameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import DROPanel from './DROPanel';
import Header from './Header';

export default class DROSignIn extends React.Component {
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
			localStorage.setItem('DRO_start', "start");
			console.log(localStorage.getItem('user_name'))
			return <Redirect push to = "/DROPanel" />;
		}

		return (
			<div className="user-panel">
			<Header />
			<center>
				<div className="jumbotron">
				
					<h2>DRO <span className="change-color">LOGIN</span> </h2>
					<hr />

					<form onSubmit = {this.handleSubmit}>
					<div className="form-group">
						<div className="row">
							<div className="col-md-2">
								<label htmlFor="user_name">Username:</label>
							</div>
							<div className="col-md-10">
								<input type="text" className="form-control" value={this.state.user_name} name="user_name" placeholder="username" id="username" onChange={this.handleChange}/>
							</div>
						</div>
					</div>

					<div className="form-group">
						<div className="row">
							<div className="col-md-2">
								<label htmlFor="password">Password:</label>
							</div>
							<div className="col-md-10">
								<input type="password" className="form-control" name="password" id="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} />
							</div>
						</div>
					</div>

					<h4><span className="errorMessage">{this.state.errorMessage}</span></h4>

						
						<br/><br/>
						<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary"><h4>LOGIN</h4></button><br /><br />
						</center>
								
					</form>
				
				</div>


				</center>
			</div>
		)

	}
}