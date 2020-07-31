import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';


export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse_click: false
		};
		//	<b><a href = {"https://drive.google.com/file/d/1YEWIcoh58igjnjy5nPN87WoCQ4DBXY6f/view?usp=sharing"}>Download Leo App</a></b>
	}

	togglebtn = async e => {		
		e.preventDefault();
		if (this.state.collapse_click == false) {
			this.setState({ collapse_click: true });
			console.log(this.state.collapse_click);
		} else {
			this.setState({ collapse_click: false });
			console.log(this.state.collapse_click);
		}
	}
	render() {
		return (
			<div>
				<nav className='navbar navbar-expand-lg navbar-light header' id="scrolled-yes">
					<a className="navbar-brand" href="#">
		            	<img className="logo" src = {require('../Logo1.png')} /> 
		          	</a>
		          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>

		          	<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#signinheader" aria-controls="signinheader" aria-expanded={this.state.collapse_click === true ?"true":"false"} onClick={this.togglebtn} aria-label="Toggle navigation">
					    <span className="navbar-toggler-icon"></span>
					 </button>	

					<div className={
							this.state.collapse_click === true ?"collapse navbar-collapse show":"collapse navbar-collapse"
						} id="signinheader">
		          	
			          	<div className="nav navbar-nav ml-auto">
			          		<Link to="/HomePage#home-section" className='nav-item nav-link'>HOME</Link>
			          		<Link to="/HomePage#features-section" className='nav-item nav-link'>FEATURES</Link>
			          		<Link to="/HomePage#about-section" className='nav-item nav-link'>ABOUT</Link> 
			          		<Link to="/HomePage#contact-section" className='nav-item nav-link'>CONTACT</Link>	
				          	<Link to="/UserSignIn" className='nav-item nav-link'>USER LOGIN</Link>
				            <Link to="/DROSignIn" className='nav-item nav-link'>DRO LOGIN</Link> 			
			            </div>

		            </div>
		        </nav>

			
					
			</div>
		)
	}
}

/*

<Link to="/DoctorSignIn" className='nav-item nav-link'>DOCTOR LOGIN</Link>
            <Link to="/DoctorSignUp" className='nav-item nav-link'> DOCTOR SIGNUP</Link>
			<Link to="/DoctorSignInAdmin" className='nav-item nav-link'> ADMIN DOCTOR</Link>
 			

*/
