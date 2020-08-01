import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link, withRouter} from "react-router-dom";
import Message from '../../elements/Message';
import Error from '../../elements/Error';
import { COMMON_FIELDS, REGISTRATION_FIELDS, LOGIN_FIELDS, LOGIN_MESSAGE, ERROR_IN_LOGIN } from '../../MessageBundle';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import 'bootstrap/dist/css/bootstrap.css';

/*
 * Class to provide functionality for user to unmark himself from trouble
 */
export default class LoggedInUnMarkTrouble extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);

		this.state = {
			user_name : '',
			latitude : 0,
			longitude : 0,
			status : 0,
			unmarkTrouble : false
		};
	}

	onSubmit = async e => {		
		e.preventDefault();
		const data = {
			user_name: this.props.user_name,
			latitude : this.state.latitude,
			longitude : this.state.longitude,
			inTrouble : false,
			token : this.props.token
		};
		await axios.put('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/user/unmark_trouble', data)
		.then(response => {
			this.setState({
				unMarkDisable : false
			});
		})
		.catch(error => {
			//console.log(error.response);
		});
		window.location.reload(false);
	}

	render() {	
		return (
			<div>
			<button disabled = {this.state.unMarkDisable} type = "button" onClick={this.onSubmit} className="btn user-unmark">Unmark Trouble</button>
			</div>
			);
		}
}
			