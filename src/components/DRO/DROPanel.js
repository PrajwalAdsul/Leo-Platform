import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ShowTroubles from './ShowTroubles';
import DROHeader from './DROHeader';
class DROPanel extends Component {
	onSubmit = async e => {
			e.preventDefault();
			window.location.reload();
		}
			
	render() {
		if(localStorage.getItem('session') != "start"){
			return <Redirect push to = "/DROSignIn" />;
		}
		return (
			<div className="user-panel">
				<DROHeader />
				<br/>
				<center>
					<button type="button" onClick={this.onSubmit} className="btn btn-primary">Refresh</button>
					<br/><br/>
				</center>	
				<ShowTroubles/>
			</div>
		);
	}
}
export default DROPanel;
