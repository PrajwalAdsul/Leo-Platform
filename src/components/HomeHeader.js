import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';


export default class HomeHeader extends Component {
	constructor(props) {
		super(props);

		this.listener = null;
		this.state = {
			status: "top"
		};
		//	<b><a href = {"https://drive.google.com/file/d/1YEWIcoh58igjnjy5nPN87WoCQ4DBXY6f/view?usp=sharing"}>Download Leo App</a></b>
	}

	componentDidMount() {
	 	this.listener = document.addEventListener("scroll", e => {
	 		var scrolled = document.scrollingElement.scrollTop;
	 		if (scrolled >= 120) {
	 			if (this.state.status !== "amir") {
	 				this.setState({ status: "amir" });
	 			}
	 		} else {
	 			if (this.state.status !== "top") {
	 				this.setState({ status: "top" });
	 			}
	 		}
	 	});
	}

	componentDidUpdate() {
		document.removeEventListener("scroll", this.listener);
	}

	render() {
		return (
			<div>
				<nav className='navbar navbar-expand-lg navbar-light header fixed-top' id={
					this.state.status === "top" ?"scrolled-no":"scrolled-yes"
				}>
					<a className="navbar-brand" href="#">
		            	<img className="logo" src = {require('./Logo1.png')} /> 
		          	</a>
		          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>  
		          	
		          	<div className="nav navbar-nav ml-auto">
		          		<Link to="#home-section" className='nav-item nav-link'>HOME</Link>
		          		<Link to="#features-section" className='nav-item nav-link'>FEATURES</Link> 
		          		<Link to="#contact-section" className='nav-item nav-link'>CONTACT</Link>	
			          	<Link to="/UserSignIn" className='nav-item nav-link'>USER LOGIN</Link>
			            <Link to="/DROSignIn" className='nav-item nav-link'>DRO LOGIN</Link> 			
		            </div>
		        </nav>

			
					
			</div>
		)
	}
}

