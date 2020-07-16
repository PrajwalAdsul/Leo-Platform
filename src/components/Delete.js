import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link, withRouter} from "react-router-dom";
import Message from '../elements/Message';
import Error from '../elements/Error';
import { COMMON_FIELDS, REGISTRATION_FIELDS, LOGIN_FIELDS, LOGIN_MESSAGE, ERROR_IN_LOGIN } from '../MessageBundle';
import axios from 'axios';
import Button from '@material-ui/core/Button'
 
export default class AppList extends Component {
	constructor(props) {
		super(props);
	}

	onSubmit = async e => {
		e.preventDefault();
		const data = {
			user_name: this.props.user_name
		};
		var registerStatus;
		await axios.delete('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/deleteDoctor', 
		{
			data : {
				user_name : data.user_name
			},
		})
		.then(response => {
			console.log(response);
			registerStatus = response.status;
		})
		.catch(error => {
			console.log("hi");
		});
	}

	render(){
	        return(          
	        	    <button onClick={this.onSubmit}>Delete</button>
	        );
	}
}
			