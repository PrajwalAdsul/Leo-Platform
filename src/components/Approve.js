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
		this.state = {
			approved : false
		}
	}


	onSubmit = async e => {
		e.preventDefault();
		const data = {
			user_name: this.props.user_name,
		};
		var registerStatus;
		await axios.put('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/approveDoctor', data)
		.then(response => {
			console.log(response);
			this.setState({
				approved : true
			});
		})
		.catch(error => {
			console.log(error.response);
		});

	}

	render(){
			if(this.state.approved){
				return (<div>Approved</div>);
			}
			else{
	        return(
	        	    <button onClick={this.onSubmit}>Approve</button>
	        );
	    }
	}
}
			