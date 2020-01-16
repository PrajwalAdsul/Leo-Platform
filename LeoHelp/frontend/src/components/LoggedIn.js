import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, user_nameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMap from './SimpleMap';
import ShowECs from './ShowECs';

export default class LoggedIn extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			user_name : "",
			ec1 : 0,
			ec2 : 0,
			ec3 : 0,
			ec4 : 0,
			ec5 : 0,
			errorMessage : "",
			latitude : 17.5555,
			longitude : 73.5555
			//password : ""
			//user_name : localStorage.getItem('user_name'),
		}
		console.log(this.state.user_name)
	}

	handleOnChangeUserName = async event=> {
		event.preventDefault();
		this.setState({
			user_name : event.target.value
		});
	}

	handleOnChangeEC1 = async event=> {
		event.preventDefault();
		this.setState({
			ec1 : event.target.value
		});
	}

	handleOnChangeEC2 = async event=> {
		event.preventDefault();
		this.setState({
			ec2 : event.target.value
		});
	}


	handleOnChangeEC3 = async event=> {
		event.preventDefault();
		this.setState({
			ec3 : event.target.value
		});
	}


	handleOnChangeEC4 = async event=> {
		event.preventDefault();
		this.setState({
			ec4 : event.target.value
		});
	}


	handleOnChangeEC5 = async event=> {
		event.preventDefault();
		this.setState({
			ec5 : event.target.value
		});
	}


	onSubmit = async e => {

		e.preventDefault();

		//if(this.state.password === this.state.confirmpassword) {

		const data = {
			user_name : this.state.user_name,
			ec1 : this.state.ec1,
			ec2 : this.state.ec2,
			ec3 : this.state.ec3,
			ec4 : this.state.ec4,
			ec5 : this.state.ec5,
		};
		let res;
		//console.log(data);
		await axios.put('http://localhost:4001/LeoHelp/updateEC', data)
		.then(response => {
			console.log(response);
			res = response.status;
			this.setState({
				latitude : res.latitude,
				longitude : res.longitude
			})
		})
		.catch(error => {
			console.log(error.response);
		});
//		const res = await UserRegistration(data);
			//add axios code
			// res = 200;
		if(res === 200) {
			this.setState({
				user_name : "",
				ec1 : 0, ec2 : 0, ec3 : 0, ec4 : 0, ec5 : 0
			});
			//console.log("IN");
			//this.setState({ loginSuccess : true });
		} else
		{
			this.setState({
				errorMessage : "Entries are not valid"
			})
		}

	}
	


	render() {

		// if(localStorage.getItem("session_start") !== "start") {
  //           return <Redirect to ='/UserSignIn'/>
  //       }
		return (
			<div>
			<nav className='navbar navbar-expand-lg navbar-light bg-light'></nav>

			<h3>Logged In as {localStorage.getItem("user_name")}</h3>

			<ShowECs user_name = {this.props.user_name}/>
			<form onSubmit={this.handleSubmit}>
				<h1>Add / Update emergency contacts</h1>
				<h2>Enter your Username </h2>
				<input type="text" name = "user_name" value={this.state.user_name} placeholder="user_name" onChange={this.handleOnChangeUserName} />
				
				<h3>ec1 </h3>
				<input type="number" name = "ec1" value={this.state.ec1} placeholder="ec1" onChange={this.handleOnChangeEC1} />
				<h3>ec2 </h3>
				<input type="number" name="ec2" value={this.state.ec2} placeholder="ec2" onChange={this.handleOnChangeEC2} />
				<h3>ec3 </h3>
				<input type="number" name="ec3" value={this.state.ec3} placeholder="ec3" onChange={this.handleOnChangeEC3} />
				<h3>ec4 </h3>
				<input type="number" name = "ec4" value={this.state.ec4} placeholder="ec4" onChange={this.handleOnChangeEC4} />
				<h3>ec5 </h3>
				<input type="number" name="ec5" value={this.state.ec5} placeholder="ec5" onChange={this.handleOnChangeEC5} />
				
				
				<button type="button" onClick={this.onSubmit} className="btn btn-primary">Click</button>
				

				<Link to = "/UserSignIn">SignIn </Link>
				
				<h3>{this.state.user_name} {this.state.password}</h3>
			</form>

			<h3> Your current location </h3>
			<SimpleMap latitude = {18.1213} longitude = {73.1232} />

			<link
			  rel="stylesheet"
			  href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
			  integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
			  Crossorigin="anonymous"
			/>

			</div>

		)

	}

}