import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import ShowTroubles from './ShowTroubles';
class DROPanel extends Component {
	render() {
		return (				
				<ShowTroubles />
		);
	}
}
export default DROPanel;
