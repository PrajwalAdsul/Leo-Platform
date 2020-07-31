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
			collapse_click: false,
			active_page : this.props.active_page
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
			<nav className='navbar navbar-expand-lg navbar-light header navbar-border' id="scrolled-yes">
				<a className="navbar-brand" href="#">
	            <img className="logo" src = {require('../Logo1.png')} />
	          	</a>
	          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>
	          	<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#DROmainheader" aria-controls="DROmainheader" aria-expanded={this.state.collapse_click === true ?"true":"false"} onClick={this.togglebtn} aria-label="Toggle navigation">
					    <span className="navbar-toggler-icon"></span>
					 </button>	

				<div className={this.state.collapse_click === true ?"collapse navbar-collapse show":"collapse navbar-collapse"} id="DROmainheader">
					<div className="nav navbar-nav ml-auto">
			          	<Link to="/ShowTroubles" className={this.state.active_page === "ShowTroubles" ?"nav-item nav-link is-active":"nav-item nav-link"}>SHOW TROUBLES</Link>
			          	<Link to="/DRONews" className={this.state.active_page === "DRONews" ?"nav-item nav-link is-active":"nav-item nav-link"}>NEWS</Link>
			            <Logout />
		            </div>
	            </div>
	              
			</nav>
			
			</div>
		)
	}	
}

//     <Link to="/ShowAuthorities" className='nav-item nav-link'> SHOW AUTHORITIES</Link>
		       