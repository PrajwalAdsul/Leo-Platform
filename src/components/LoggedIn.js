import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import className from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMap from './SimpleMap';
import ShowECs from './ShowECs';
import MarkTrouble from './MarkTrouble';
import LoggedInUnMarkTrouble from './LoggedInUnMarkTrouble';
import Logout from './Logout'; 
import UploadDoc from './UploadDoc';

export default class LoggedIn extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user_name : this.props.location.state.user_name,
			ec1 : this.props.location.state.data.emergencyContacts[0],
			ec2 : this.props.location.state.data.emergencyContacts[1],
			ec3 : this.props.location.state.data.emergencyContacts[2],
			ec4 : this.props.location.state.data.emergencyContacts[3],
			ec5 : this.props.location.state.data.emergencyContacts[4],
			errorMessage : "",
			latitude : 0,
			longitude : 0,
			 errors: {
		        fullName : '',
		        email : '',
		        password : '',
		        phone1 : '',
		        phone2 : '',
		        phone3 : '',
		        phone4 : '',
		        phone5 : ''
		      },
		    heading : "",
		    inTrouble : "loading",
		    area : "",
		    data : "",
		    token : this.props.location.state.token
		}	
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
		let errors = this.state.errors;
		const {name, value} = event.target
  		const validPhoneRegex = RegExp(/^[0-9\b]+$/);
		errors.phone1 = 
	      		validPhoneRegex.test(value) && value.length == 10
	      		  ? ''
	      		  : 'Please put valid 10-digit Phone Number';
	}

	handleOnChangeEC2 = async event=> {
		event.preventDefault();
		this.setState({
			ec2 : event.target.value
		});
		let errors = this.state.errors;
		const {name, value} = event.target
  		const validPhoneRegex = RegExp(/^[0-9\b]+$/);
		errors.phone2 = 
	      		validPhoneRegex.test(value) && value.length == 10
	      		  ? ''
	      		  : 'Please put valid 10-digit Phone Number';
	}


	handleOnChangeEC3 = async event=> {
		event.preventDefault();
		this.setState({
			ec3 : event.target.value
		});
		let errors = this.state.errors;
		const {name, value} = event.target
  		const validPhoneRegex = RegExp(/^[0-9\b]+$/);
		errors.phone3 = 
	      		validPhoneRegex.test(value) && value.length == 10
	      		  ? ''
	      		  : 'Please put valid 10-digit Phone Number';
	}


	handleOnChangeEC4 = async event=> {
		event.preventDefault();
		this.setState({
			ec4 : event.target.value
		});
		let errors = this.state.errors;
		const {name, value} = event.target
  		const validPhoneRegex = RegExp(/^[0-9\b]+$/);
		errors.phone4 = 
	      		validPhoneRegex.test(value) && value.length == 10
	      		  ? ''
	      		  : 'Please put valid 10-digit Phone Number';
	}


	handleOnChangeEC5 = async event=> {
		event.preventDefault();
		this.setState({
			ec5 : event.target.value
		});
		let errors = this.state.errors;
		const {name, value} = event.target
  		const validPhoneRegex = RegExp(/^[0-9\b]+$/);
		errors.phone5 = 
	      		validPhoneRegex.test(value) && value.length == 10
	      		  ? ''
	      		  : 'Please put valid 10-digit Phone Number';
	}

	async componentDidMount(){
		try{
			this.setState({
				user_name : this.props.location.state.user_name,
				token : this.props.location.state.token
			});
			const data = {
				"user_name" : this.state.user_name,
				"token" : this.state.token
			};
			console.log("data");
			console.log(data);
			console.log("data");
			await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/getUser', data)
			.then(response => {
				this.setState({
					inTrouble : response.data.inTrouble,
					ec1 : response.data.emergencyContacts[0],
					ec2 : response.data.emergencyContacts[1],
					ec3 : response.data.emergencyContacts[2],
					ec4 : response.data.emergencyContacts[3],
					ec5 : response.data.emergencyContacts[4],
					area : response.data.area,
					data : response.data
				});
			})
			.catch(error => {
				console.log(error.response);
			});
		}
		catch(e){

		}
	}

	onSubmit = async e => {
		e.preventDefault();
		const data = {
			user_name : this.state.user_name,
			ec1 : this.state.ec1,
			ec2 : this.state.ec2,
			ec3 : this.state.ec3,
			ec4 : this.state.ec4,
			ec5 : this.state.ec5,
			token : this.state.token
		};
		let c = 0, p = 0;
		for(var i = 1; i <= 5; i++)
		{
			if(data["ec" + String(i)] == null)
				c = c + 1;
			else
				if(this.state.errors["phone" + String(i)] != "")
					p = p + 1;
		}
		if(c > 2){
			alert("Enter atleast 3 valid numbers");
			return;
		}
		if(p > 0){
			alert("All numbers should be 10 digit");
			return;
		}
		for(var i = 1; i <= 5; i++){
			if(data["ec" + String(i)].length == 10){
				for(var j = i + 1; j <= 5; j++){
					if(data["ec" + String(i)] == data["ec" + String(j)]){
						alert("All entered numbers should be unique");
						return;
					}					
				}
			}
		}
		let res;
		await axios.put('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/updateEC', data)
		.then(response => {
			res = response.status;
			this.setState({
				latitude : res.latitude,
				longitude : res.longitude
			})
		})
		.catch(error => {
			console.log(error.response);
		});

		if(res === 200) {
			// this.setState({
			// 	user_name : "",
			// 	ec1 : 0, ec2 : 0, ec3 : 0, ec4 : 0, ec5 : 0
			// });
		} else
		{
			this.setState({
				errorMessage : "Entries are not valid"
			})
		}
		window.location.reload();
	}
	render() {
		const {errors} = this.state;
		if(
			localStorage.getItem('session') != "start" 
			&&
			localStorage.getItem('token') != null
		  ){
			return <Redirect push to = "/UserSignIn" />;
		}
		return (
			<div className="user-panel">			
				<nav className='navbar navbar-expand-lg navbar-light header'>
					<a className="navbar-brand" href="#">
		            	<img className="logo" src = {require('./Logo.png')} />
		          	</a>
		          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1> 
					<div className="nav navbar-nav ml-auto">
						<Logout/>
		            </div>         
				</nav>

				<div className="user">
					<center>
						<div className={this.state.inTrouble ? "danger" : "not-in-danger"}>
							{this.state.inTrouble == "loading" && 
								<h2>  </h2>
							}
							{this.state.inTrouble == true && 
								<h2> You are currently marked in Trouble. Leo is taking appropriate actions. </h2>
							}
							{this.state.inTrouble == false && 
								<h2> You are not in Trouble </h2>
							}
							<br/>						
							{this.state.heading}
								<button className="btn btn-primary">
								<Link className="link" to={{
									  pathname: '/LeoDropBox',
									  state: {
									    user_name : this.state.user_name
									  }
									}}>Leo DropBox</Link>
								</button>
							<br/><br/>
							<MarkTrouble user_name = {this.state.user_name} token = {this.state.token}/>
							<br/>
							<LoggedInUnMarkTrouble user_name = {this.state.user_name} token = {this.state.token}/>
							<br/>
							<ShowECs user_name = {this.state.user_name} token = {this.state.token} />
						</div>
						<div className="bottom">
							<div className="jumbotron">
								<h2>UPDATE <span className="change-color">CONTACTS</span></h2>
								<hr/>
								<form onSubmit = {this.handleSubmit}>
									<div className="form-group">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="ec1">Contact1:</label>
											</div>
											<div className="col-md-8">
												<input type="number" name = "ec1" className="form-control" value={this.state.ec1} placeholder="10-digit Mobile No." id="ec1" onChange={this.handleOnChangeEC1} />
											</div>
											<h4><span className="errorMessage">{errors.phone1}</span></h4>
										</div>
									</div>
									<div className="form-group">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="ec2">Contact2:</label>
											</div>
											<div className="col-md-8">
												<input type="number" name="ec2" className="form-control" id="ec2" value={this.state.ec2} placeholder="10-digit Mobile No." onChange={this.handleOnChangeEC2} />
											</div>
											<h4><span className="errorMessage">{errors.phone2}</span></h4>
										</div>
									</div>
									<div className="form-group">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="ec3">Contact3:</label>
											</div>
											<div className="col-md-8">
												<input type="number" name="ec3" className="form-control" id="ec3" value={this.state.ec3} placeholder="10-digit Mobile No." onChange={this.handleOnChangeEC3} />
											</div>
											<h4><span className="errorMessage">{errors.phone3}</span></h4>
										</div>
									</div>
									<div className="form-group">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="ec4">Contact4:</label>
											</div>
											<div className="col-md-8">
												<input type="number" name="ec4" className="form-control" id="ec4" value={this.state.ec4} placeholder="10-digit Mobile No." onChange={this.handleOnChangeEC4} />
											</div>
											<h4><span className="errorMessage">{errors.phone4}</span></h4>
										</div>
									</div>
									<div className="form-group">
										<div className="row">
											<div className="col-md-4">
												<label htmlFor="ec5">Contact5:</label>
											</div>
											<div className="col-md-8">
												<input type="number" name="ec5" className="form-control" id="ec5" value={this.state.ec5} placeholder="10-digit Mobile No." onChange={this.handleOnChangeEC5} />
											</div>
											<h4><span className="errorMessage">{errors.phone5}</span></h4>
										</div>
									</div>
									<h4><span className="errorMessage">{this.state.errorMessage}</span></h4>
									<br/><br/>
									<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary">UPDATE</button><br/><br/>
									</center>	
								</form>
							</div>
							<a className='nav-item nav-link' href = {"https://www.google.com/maps?q=" + this.state.data.area} target="_blank">Location</a>
	   					</div>
	   				</center>
				</div>
			
			</div>
		)
	}
}

/*
Showing location

<div className="col-md-9">
					<center><h3 className="map"><b>CURRENT <span className="change-color">LOCATION</span></b></h3>
					<SimpleMap latitude = {18.1213} longitude = {73.1232} /></center>

				</div>

*/