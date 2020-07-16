import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';
import Logout from './Logout';

export default class DoctorHeader extends Component {
	constructor(props) {
		super(props);

		this.state = {
		
		};
	}

	render() {

		return (
 				<nav className='navbar navbar-expand-lg navbar-light bg-light'>
                        <Logout />
                        <Link to="/AllDoctors" className='navbar-brand'><b>All doctors</b></Link>
                        <Link to="/AdminDoctor" className='navbar-brand'><b>Applications</b></Link>
                </nav>
         )
     }
 }