import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import PoliceShowTroubles from './PoliceShowTroubles';
import PoliceHeader from './PoliceHeader';


/*
 * Class for Police panel
 */
class PolicePanel extends Component {
	onSubmit = async e => {
		e.preventDefault();
		window.location.reload();
	}

	render() {
		if (localStorage.getItem('session') != "start") {
			return <Redirect push to="/PoliceSignIn" />;
		}
		return (
			<div className="dro-panel">
				<PoliceHeader active_page="PoliceShowTroubles" />
				<br />
				<center>
					<button type="button" onClick={this.onSubmit} className="btn btn-primary">Refresh</button>
					<br /><br />
				</center>
				<div className="container">
					<PoliceShowTroubles />
				</div>

			</div>
		);
	}
}
export default PolicePanel;
