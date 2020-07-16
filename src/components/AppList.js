import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link, withRouter} from "react-router-dom";
import Message from '../elements/Message';
import Error from '../elements/Error';
import { COMMON_FIELDS, REGISTRATION_FIELDS, LOGIN_FIELDS, LOGIN_MESSAGE, ERROR_IN_LOGIN } from '../MessageBundle';
import axios from 'axios';
import Button from '@material-ui/core/Button'

import Delete from './Delete';
import Approve from './Approve';

export default class AppList extends Component {
	constructor(props) {
		super(props);
	}
	render(){
	        return( 
	            <tr>
	                <td>{this.props.application.user_name}</td>
	                <td>Not yet approved</td>
	                <td><Approve user_name = {this.props.application.user_name} /></td>
	                <td><Delete user_name = {this.props.application.user_name} 
	                startup_name = {this.props.application.startup_name} 
	                status = {this.props.application.status} /></td>	
	            </tr>
	        );
	   
	}

}
			