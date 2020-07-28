import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';


export default class AppFeatures extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="jumbotron section-jumbotron">
				<div className="line"></div>
				<h2>LEO APP</h2>

				<div className="row">
					<div className="col-md-4 col1-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-App-state-of-art.png')} alt="State of art technology to detect trouble" />
							<div className="card-body">
								<p className="card-text">State of art technology to detect trouble</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 col2-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-App-live-location-tracking.png')} alt="Live location tracking" />
							<div className="card-body">
								<p className="card-text">Live location tracking</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 col3-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-App-crime-hotspots.png')} alt="Get latest crime incidents and hotspots in your region" />
							<div className="card-body">
								<p className="card-text">Get latest crime incidents and hotspots in your region</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

