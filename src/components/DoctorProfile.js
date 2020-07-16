import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import className from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import Logout from './Logout'; 

export default class DoctorProfile extends Component {
	constructor(props) {
		super(props)
		this.state= {
			user_name : "",
			expertise : "",
			college : "",
			help_type : "",
			email : "",
			phone : "",
			area : "",
			status : "",
			applicationStatusComment : ""
		}
	}

	componentDidMount = async e => {
		try{
			const data = {user_name : this.props.location.state.user_name};
			let res;
			await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/getDoctor', data)
			.then(response => {
				this.setState({
					user_name : response.data.user_name,
					expertise : response.data.expertise,
					college : response.data.college,
					help_type : response.data.help_type,
					email : response.data.email,
					phone : response.data.phone,
					area : response.data.area,
					status : response.data.status,
					applicationStatusComment : response.data.applicationStatusComment				
				})
			})
			.catch(error => {
				console.log(error.response);
			});
		}
		catch(e){

		}
	}
	render() {
		if(localStorage.getItem('session') != "start"){
			return <Redirect push to = "/DoctorSignIn" />;
		}
		return (
			<div>
			<h3>
				Hello World! <br/> 
				{this.state.user_name} <br/>
				{this.state.phone} <br/>
				{this.state.email} <br/>
				{this.state.college} <br/>
				{this.state.help_type} <br/>
				{this.state.expertise} <br/>
				{this.state.area} <br/>
				{this.state.status} <br/>
				{this.state.applicationStatusComment} <br/>
				</h3>
				<Logout/>
			</div>
		)
	}
}