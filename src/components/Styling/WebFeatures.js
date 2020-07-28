import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';


export default class WebFeatures extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="jumbotron section-jumbotron">
				<div className="line"></div>
				<h2>LEO WEB</h2>

				<div className="row">
					<div className="col-md-4 col3-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-Web-get-help-dro.png')} alt="Get help from DRO by one click and they can track your location to help you" />
							<div className="card-body">
								<p className="card-text">Get help from DRO by one click and they can track your location to help you</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 col2-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-Web-latest-crime-news.png')} alt="View latest crime news" />
							<div className="card-body">
								<p className="card-text">View latest crime news</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 col1-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-Web-crime-analysis.png')} alt="Crime analysis for reducing crimes" />
							<div className="card-body">
								<p className="card-text">Crime analysis for reducing crimese</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

