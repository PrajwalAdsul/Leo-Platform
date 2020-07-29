import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';
import Logout from './Logout';

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
		
		};
	}
	render() {

		return (
			<div>			
			<nav className='navbar navbar-expand-lg navbar-light header navbar-border'>
				<a className="navbar-brand" href="#">
	            <img className="logo" src = {require('../Logo1.png')} />
	          	</a>
	          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>
				<div className="nav navbar-nav ml-auto">
		          	<Link to="/ShowTroubles" className='nav-item nav-link'>SHOW TROUBLES</Link>
		          	<Link to="/DRONews" className='nav-item nav-link'>NEWS</Link>
		            <Logout />
	            </div>
	              
			</nav>
			
			</div>
		)
	}	
}

//     <Link to="/ShowAuthorities" className='nav-item nav-link'> SHOW AUTHORITIES</Link>
		       