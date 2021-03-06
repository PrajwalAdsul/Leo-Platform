import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link, withRouter} from "react-router-dom";
import Message from '../../elements/Message';
import Error from '../../elements/Error';
import { COMMON_FIELDS, REGISTRATION_FIELDS, LOGIN_FIELDS, LOGIN_MESSAGE, ERROR_IN_LOGIN } from '../../MessageBundle';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import 'bootstrap/dist/css/bootstrap.css';

 
/*
 * Class to implement funcitonality of unmarking a user from trouble
 */ 
export default class UnMarkTrouble extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			user_name : '',
			latitude : 18.5293,
			longitude : 73.8565,
			status : 0,
			unmarkTrouble : false,
			token : null
		};
	}

	onSubmit = async e => {		
		e.preventDefault();
		const data = {
			user_name: this.props.user_name,
			latitude : this.state.latitude,
			longitude : this.state.longitude,
			inTrouble : false,
			token : localStorage.getItem('token')
		};
		await axios.put('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/user/unmark_trouble', data)
		.then(response => {
			console.log(response);
			this.setState({
				unMarkDisable : true
			});
		})
		.catch(error => {
			console.log(error.response);
		});
	}

	render() {	
		return (
			<div>
			<button disabled = {this.state.unMarkDisable} type = "button" onClick={this.onSubmit} className="btn btn-primary unmarktrouble-btn">Unmark Trouble</button>
			</div>
			);
		}
}
			