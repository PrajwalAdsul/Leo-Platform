import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Logout from './Logout';


/*
 * Header section for Police (delegative responsible operator)
 */
export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			collapse_click: false,
			active_page: this.props.active_page
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
						<img className="logo" src={require('../Logo1.png')} />
					</a>
					<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#Policemainheader" aria-controls="Policemainheader" aria-expanded={this.state.collapse_click === true ? "true" : "false"} onClick={this.togglebtn} aria-label="Toggle navigation">
						<span className="navbar-toggler-icon"></span>
					</button>

					<div className={this.state.collapse_click === true ? "collapse navbar-collapse show" : "collapse navbar-collapse"} id="Policemainheader">
						<div className="nav navbar-nav ml-auto">
							<Link to="/PolicePanel" className={this.state.active_page === "PoliceShowTroubles" ? "nav-item nav-link is-active" : "nav-item nav-link"}>SHOW TROUBLES</Link>
							<Link to="/PoliceFIR" className={this.state.active_page === "PoliceFIRs" ? "nav-item nav-link is-active" : "nav-item nav-link"}>ADD CRIME</Link>
							<Logout />
						</div>
					</div>
				</nav>
			</div>
		)
	}
}
