import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';

/*
 * Class to implement footer section
 */
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
					<div className="row upper-footer">
						<div className="col-md-8">
							<p>Quick Links:</p>
							<div className="row">
								<div className="col-6">
									<ul>
										<li><Link to="/UserSignIn" className="footer-link">User Login</Link></li>
										<li><Link to="/DROSignIn" className="footer-link">DRO Login</Link></li>
									</ul>
								</div>
								<div className="col-6">
									<ul>
										<li><a href = {"https://drive.google.com/file/d/1auANTHv5d-9phggss4s0SRCl5_wmepu_/view?usp=sharing"} target="_blank" className="footer-link">Privacy Policy</a></li>
										<li><a href = {"https://drive.google.com/file/d/1W5GDYjWCFIj_dfbctg0iA_9Unp8gkoKU/view?usp=sharing"} target="_blank" className="footer-link">Terms and Condition</a></li>
									</ul>
								</div>
							</div>
						</div>
						<div className="col-md-4">
							<p><a href = {"https://drive.google.com/file/d/1YEWIcoh58igjnjy5nPN87WoCQ4DBXY6f/view?usp=sharing"} target="_blank" className="footer-link">Download Leo App</a></p>
						</div>
					</div>
					<hr className="footer-hr" />
					<center>
					<div className="copyright-footer">
						<p>Made with love <FontAwesomeIcon icon={faHeart} color="#fb4f59"/> by LeoCode</p>
					</div>
					</center>
				</footer>
			</div>
		)
	}
}

