import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';
import Logout from './Logout';

/*
 * Class for header section for user
 */
export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse_click: false
		};
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
			<nav className='navbar navbar-expand-lg navbar-light header navbar-border scrolled-yes' id="scrolled-yes">
					<a className="navbar-brand" href="#">
		            	<img className="logo" src = {require('../Logo1.png')} />
		          	</a>
		          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>
		          	<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#usermainheader" aria-controls="usermainheader" aria-expanded={this.state.collapse_click === true ?"true":"false"} onClick={this.togglebtn} aria-label="Toggle navigation">
					    <span className="navbar-toggler-icon"></span>
					 </button>	

					<div className={this.state.collapse_click === true ?"collapse navbar-collapse show":"collapse navbar-collapse"} id="usermainheader">
			          	<div className="nav navbar-nav ml-auto">
							<Link to="/UserNews" className='nav-item nav-link' target="_blank">NEWS</Link>
							<Logout/>
			            </div>

		            </div>
	
				</nav>
			
			</div>
		)
	}	
}
