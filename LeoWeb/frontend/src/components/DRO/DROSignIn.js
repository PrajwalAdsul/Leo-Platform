import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import DROPanel from './DROPanel';
import Header from '../Styling/Header';


/*
 * Class implementing sign in functionality for DRO
 */
export default class DROSignIn extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			user_name:"",
			password:"",
			error: false,
			loginSuccess: false,
			errorMessage: "",
			token : ""
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



	onSubmit = async e => {
		let hash = await this.sha256(this.state.user_name + this.state.password);
		const data = {
			user_name : this.state.user_name,
			password : hash
		};
		var res;
		
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/dro/login', data)
		.then(response => {
			res = response.status;
			localStorage.setItem('password', hash);
			this.setState({
				token : response.data.token
			});
		})
		.catch(error => {
			this.setState({
				password: ""
			});
		});
			if(res === 200) {
					this.setState({
					loginSuccess : true
					});
			} else {
			this.setState({
				errorMessage: "Username or password is incorrect",
				password: ""
			});
		}
	}

	componentWillMount() {
		localStorage.setItem('session_start', null);	
		try{
			localStorage.getItem('user_name' && this.setState({
				user_name : JSON.parse(localStorage.getItem('user_name'))
			}))
		}
		catch(e){

		}
	}

	render() {
		const { loginSuccess, error } = this.state;
		if (this.state.loginSuccess == true) {
			localStorage.setItem('session', "start");
			localStorage.setItem('DRO_start', "start");
			localStorage.setItem('user_name', this.state.user_name);
			localStorage.setItem('token', this.state.token);
			return <Redirect push to = "/DROPanel" />;
		}
		return (
			<div>
			<Header active_page = "DROSignIn" />
			<center>
				<div className="jumbotron shadow-lg login-jumbotron">
				
					<h2>DRO <span className="change-color">LOGIN</span> </h2>
					<hr />
				
					<form onSubmit = {this.handleSubmit} className="login-form">
					<div className="form-group">
						<div class="input-group mb-2">
							<div class="input-group-prepend">
								<div class="input-group-text">
									<FontAwesomeIcon icon={faUser} size="2x" />
								</div>
							</div>
							<input type="text" className="form-control" value={this.state.user_name} name="user_name" placeholder="Username" id="username" onChange={this.handleChange} required/>
						</div>
					</div>

					<div className="form-group">
						<div class="input-group mb-2">
							<div class="input-group-prepend">
								<div class="input-group-text">
									<FontAwesomeIcon icon={faLock} size="2x" />
								</div>
							</div>
							<input type="password" className="form-control" name="password" id="password" value={this.state.password} placeholder="Password" onChange={this.handleChange} required/>
						</div>
					</div>
					<h4><span className="errorMessage">{this.state.errorMessage}</span></h4>
						<br/><br/>
						<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary">LOGIN</button><br /><br />
						</center>	
					</form>
				
				</div>
				</center>
			</div>
		)

	}
}
