import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';


export default class BotFeatures extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="jumbotron section-jumbotron">
				<div className="line"></div>
				<h2>LEO BOT</h2>

				<div className="row">
					<div className="col-md-4 col1-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-Bot-precautions.png')} alt="Crime specific precautions" />
							<div className="card-body">
								<p className="card-text">Crime specific precautions</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 col2-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-Bot-recent-news.png')} alt="Recent news of any city in India" />
							<div className="card-body">
								<p className="card-text">Recent news of any city in India</p>
							</div>
						</div>
					</div>
					<div className="col-md-4 col3-img">
						<div className="card">
							<img className="card-img d-block w-100" src={require('../Features-Images/Leo-Bot-DRO.png')} alt="Immediate report to DRO for help if in emergency or trouble" />
							<div className="card-body">
								<p className="card-text">Immediate report to DRO for help if in emergency or trouble</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

