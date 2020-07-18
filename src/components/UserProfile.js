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
				
				/*
				let logv  = [];
				for(var i = 0; i < log.length; i++){
					console.log(log[i]);
					logv.push(log[i]["datetime"]);
					logv.push(log[i]["ip"])
					logv.push(log[i]["operation"])
					logv.push(log[i]["text"])
				}
				*/

				this.setState({
					log : log
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
			return <Redirect push to = "/DROSignIn" />;
		}
		return (
			<div className="user-panel">
            	<DROHeader/>
				<Link  
	             to={{
	              pathname: '/DROPanel'
	          	}}
	             className='nav-item nav-link'>Back</Link>
				<table className="table table-condensed table-hover">
					<tbody>
					<tr><th>User_name</th> <td>{this.state.user_name}</td></tr>
					<tr><th>Phone No</th> <td>{this.state.phone}</td></tr>
					<tr><th>Email ID</th> <td>{this.state.email}</td></tr>
					<tr><th>Area</th><td>{this.state.area}</td></tr>
					<tr><th>Emergency Contacts</th> <td><ol>{this.state.emergencyContacts.map(reptile => <li>{reptile}</li>)}
				    									</ol>
				    </td></tr>
					<tr><th>User Log :</th> <td>
					<table>
						<thead>
							<th>DateTime</th>
							<th>IP</th>
							<th>Operation</th>
							<th>Text</th>
						</thead>
						<tbody>
						 {this.state.log.map(reptile => <tr><td>{reptile["datetime"]}</td><td>{reptile["ip"]}</td><td>{reptile["operation"]}</td><td>{reptile["text"]}</td></tr>)}
						</tbody>
					</table>
					</td></tr>
					</tbody>
				</table>
			</div>
		)
	}
}