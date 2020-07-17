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

export default class UserSignIn extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			user_name : "",
			password : "",
			error : false,
			loginSuccess : false,
			errorMessage : "",
			inTrouble : null,
			data : null
		}
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})
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
		const data = {
			user_name : this.state.user_name,
			password : this.state.password
		};

		data.password = await this.sha256(data.password);
		
		var res;
		
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/loginIn', data)
		.then(response => {
			console.log(response);
			res = response.status;
			this.setState({
				inTrouble : response.data.inTrouble,
				data : response.data
			});
		})
		.catch(error => {
			console.log(error.response);
			this.setState({
				password: ""
			});
		});
		
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
			});
		}
	
	}

	componentWillMount() {
		localStorage.setItem('session_start', null);	
	}

	render() {

		const { loginSuccess, error } = this.state;
		if (this.state.loginSuccess == true) {
			localStorage.setItem('session', "start");
			localStorage.setItem('user_name', this.state.user_name);
			
			return <Redirect push to  = {{ 
					pathname : '/LoggedIn',
            		state : { data : this.state.data, user_name : this.state.user_name, inTrouble : this.state.inTrouble}
            }}
			/>;
		}

		return (
			<div>
			<Header />
 			<center>
				<div className="jumbotron">
					<h2>USER <span className="change-color">LOGIN</span> </h2>
					<hr />
					<form onSubmit = {this.handleSubmit}>
					<div className="form-group">
						<div className="row">
							<div className="col-md-2">
								<label htmlFor="user_name">Username:</label>
							</div>
							<div className="col-md-10">
								<input type="text" className="form-control" value={this.state.user_name} name="user_name" placeholder="Username" id="username" onChange={this.handleChange} required/>
							</div>
						</div>
					</div>

					<div className="form-group">
						<div className="row">
							<div className="col-md-2">
								<label htmlFor="password">Password:</label>
							</div>
							<div className="col-md-10">
								<input type="password" className="form-control" name="password" id="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} required/>
							</div>
						</div>
					</div>

					<h4><span className="errorMessage">{this.state.errorMessage}</span></h4>

						<br/><br/>
						<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary btn-lg">LOGIN</button><br/><br/>
						<h4>Not a user ?<Link to = "/UserSignUp" className="change-color link"> SignUp </Link></h4></center>
								
					</form>
				</div>
				</center>
			</div>
		)

	}
}
