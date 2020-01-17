import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import className from 'classnames';
//import { UserRegistration, user_nameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMap from './SimpleMap';
import ShowECs from './ShowECs';
import MarkTrouble from './MarkTrouble';
 
export default class LoggedIn extends Component {
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
		if(localStorage.getItem('session') !== "start"){
			return <Redirect push to = "/UserSignIn" />;
	
		}
		return (
			<div className="user-panel">
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			<a className="navbar-brand" href="#">
            <img className="logo" src = {require('./Logo.png')} />
            
          	</a>
          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>      
			</nav>

			
			<nav className='navbar navbar-expand-lg navbar-light header'>
			<a className="navbar-brand" href="#">
            <h1><b>LEO HELP</b></h1>
          	</a>
			<div className="nav navbar-nav ml-auto">

          	<Link to="/UserSignIn" className='nav-item nav-link'>LOGOUT</Link>
            
            </div>
              
			</nav>

			<div className="user">
			<div className="row">
				<div className="col-md-3">
				<div className="container">
					<ShowECs user_name = {localStorage.getItem("user_name")}/>
				</div>

				<div className = 'container'>
				

					

					<center>
				<div className="user-jumbotron">
				
					<h2>UPDATE <span className="change-color">CONTACTS</span> </h2>
					<hr />

					<form onSubmit = {this.handleSubmit}>
					<div className="form-group">
						<div className="row">
							<div className="col-md-4">
								<label htmlFor="user_name">Username:</label>
							</div>
							<div className="col-md-8">
								<input type="text" className="form-control" name = "user_name" value={this.state.user_name} placeholder="user_name" id="username" onChange={this.handleOnChangeUserName} />
						
							</div>
						</div>
					</div>

					<div className="form-group">
						<div className="row">
							<div className="col-md-4">
								<label htmlFor="ec1">Contact1:</label>
							</div>
							<div className="col-md-8">
								<input type="number" name = "ec1" className="form-control" value={this.state.ec1} placeholder="ec1" id="ec1" onChange={this.handleOnChangeEC1} />
							</div>
						</div>
					</div>
					<div className="form-group">
						<div className="row">
							<div className="col-md-4">
								<label htmlFor="ec2">Contact2:</label>
							</div>
							<div className="col-md-8">
								<input type="number" name="ec2" className="form-control" id="ec2" value={this.state.ec2} placeholder="ec2" onChange={this.handleOnChangeEC2} />
							</div>
						</div>
					</div>
					<div className="form-group">
						<div className="row">
							<div className="col-md-4">
								<label htmlFor="ec3">Contact3:</label>
							</div>
							<div className="col-md-8">
								<input type="number" name="ec3" className="form-control" id="ec3" value={this.state.ec3} placeholder="ec3" onChange={this.handleOnChangeEC3} />
						
							</div>
						</div>
					</div>
					<div className="form-group">
						<div className="row">
							<div className="col-md-4">
								<label htmlFor="ec4">Contact4:</label>
							</div>
							<div className="col-md-8">
								<input type="number" name="ec4" className="form-control" id="ec4" value={this.state.ec4} placeholder="ec4" onChange={this.handleOnChangeEC4} />
							
							</div>
						</div>
					</div>
					<div className="form-group">
						<div className="row">
							<div className="col-md-4">
								<label htmlFor="ec5">Contact5:</label>
							</div>
							<div className="col-md-8">
								<input type="number" name="ec5" className="form-control" id="ec5" value={this.state.ec5} placeholder="ec5" onChange={this.handleOnChangeEC5} />
						
							</div>
						</div>
					</div>


					<h4><span className="errorMessage">{this.state.errorMessage}</span></h4>

						
						<br/><br/>
						<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary"><h4>UPDATE</h4></button><br /><br />
						</center>
								
					</form>
				
				</div>


				</center>

				</div>

				</div>
				<div className="col-md-9">
					<center><h3 className="map"><b>CURRENT <span className="change-color">LOCATION</span></b></h3>
					<SimpleMap latitude = {18.1213} longitude = {73.1232} /></center>

				</div>
			</div>
			</div>
			<MarkTrouble />
				
			</div>

		)

	}

}