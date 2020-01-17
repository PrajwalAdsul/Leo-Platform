import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ShowTroubles from './ShowTroubles';
import DROHeader from './DROHeader';
class DROPanel extends Component {
	render() {
		return (
			<div>
				<DROHeader />	
				<ShowTroubles />
			</div>
		);
	}
}
export default DROPanel;
