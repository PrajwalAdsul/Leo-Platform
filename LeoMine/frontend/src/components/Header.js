import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, UsernameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';

export default class Header extends Component {
	constructor(props) {
		super(props);

		this.state = {
		
		};
	}

	render() {

		return (
			<div><center>
			<img src = {require('./Logo.png')} />  <h1> Leo-Platform</h1> </center>           
			</div>
		)
	}
}
