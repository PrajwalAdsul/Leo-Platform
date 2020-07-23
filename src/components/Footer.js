import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';


export default class Footer extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div>
				<footer className="site-footer">
					<div className="row">
						<div className="col-md-8">
							<p>Quick Links:</p>
							<div className="row">
								<div className="col-6">
									<ul>
										<li><Link to="/HomePage#features-section" className="footer-link">Features</Link></li>
										<li>Screenshots</li>
									</ul>
								</div>
								<div className="col-6">
									<ul>
										<li><Link to="/UserSignIn" className="footer-link">User Login</Link></li>
										<li><Link to="/DROSignIn" className="footer-link">DRO Login</Link></li>
									</ul>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<p><a href = {"https://drive.google.com/file/d/1YEWIcoh58igjnjy5nPN87WoCQ4DBXY6f/view?usp=sharing"} target="_blank" className="footer-link">Download Leo App</a></p>
						</div>
					</div>
				</footer>
			</div>
		)
	}
}

