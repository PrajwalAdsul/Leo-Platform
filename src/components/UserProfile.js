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
import DROHeader from './DROHeader';

export default class UserProfile extends Component {
	constructor(props) {
		super(props)
		this.state= {
			user_name : "",
			email : "",
			phone : "",
			area : "",
			emergencyContacts : [],
			log : []
		}
	}

	componentDidMount = async e => {
		try{
			const data = {user_name : this.props.location.state.user_name};
			let res;
			console.log(data);
			await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/getUser', data)
			.then(response => {
				this.setState({
					user_name : response.data.user_name,
					email : response.data.email,
					phone : response.data.phone,
					area : response.data.area,
					emergencyContacts : response.data.emergencyContacts,
				});
				let log = response.data.log;
				let logv  = [];
				for(var i = 0; i < log.length; i++){
					console.log(log[i]);
					logv.push("datetime " + log[i]["datetime"] + " operation " + log[i]["operation"] + " text " + log[i]["text"] + "\n");
				}
					
				this.setState({
					log : logv
				});
			})
			.catch(error => {
				console.log(error.response);
			});
			// console.log(data);
			
		}
		catch(e){
			console.log(e);
		}
	}
	render() {
		if(localStorage.getItem('session') != "start"){
			return <Redirect push to = "/DoctorSignIn" />;
		}
		return (
			<div>
            	<DROHeader/>
				<Link  
	             to={{
	              pathname: '/DROPanel'
	          	}}
	             className='nav-item nav-link'>Back</Link>
				<h3>
					User_name : {this.state.user_name} <br/><br/>
					Phone No : {this.state.phone} <br/><br/>
					Email ID : {this.state.email} <br/><br/>
					Area : {this.state.area} <br/><br/>
					Emergency Contacts : <br/>
					<ol>
				      {this.state.emergencyContacts.map(reptile => <li>{reptile}</li>)}
				    </ol><br/><br/>
					User Log : <br/>
					 {this.state.log.map(reptile => <li>{reptile}<br/><br/></li>)}
					<br/><br/>
				</h3>
			</div>
		)
	}
}