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

			<div>
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			<a className="navbar-brand" href="#">
            <img className="logo" src = {require('./Logo.png')} />
            
          	</a>
          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>      
			</nav>

			
			<nav className='navbar navbar-expand-lg navbar-light header'>
			<a className="navbar-brand" href="#">
            <h1>LEO MINE</h1>
          	</a>
			<div className="nav navbar-nav ml-auto">

          	<Link to="/AddCrime" className='nav-item nav-link'>ADD CRIME</Link>
            <Link to="/AddArea" className='nav-item nav-link'>ADD AREA</Link>
            <Link to="/ShowCrimes" className='nav-item nav-link'>SHOW CRIMES</Link>
            <Link to="/ShowAreas" className='nav-item nav-link'>SHOW AREAS</Link>
            <Link to="/WebScrap" className='nav-item nav-link'>WEBSCRAP</Link>
            </div>
              
			</nav>
			
			</div>
		)
	}
}
