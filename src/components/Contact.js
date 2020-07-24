import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';


export default class Contact extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="jumbotron section-jumbotron">
				<div className="row">
					<div className="col-md-6 contact-column col1">
						<div className="line"></div>
						<p className="section-heading">CONTACT US</p>
						<h2 className="tagline">We'd like to hear from you</h2>
						<p className="section-p">Don't hesitate to get in contact with us no matter your request. We are here to help you.</p>
						<ul>
							<li><FontAwesomeIcon icon={faMapMarker} color="#00909e"/><span className="list-text">COE, Pune, India</span></li>
							<li><span className="list-text">9999999999</span></li>
							<li><FontAwesomeIcon icon={faEnvelope} color="#00909e"/><span className="list-text">leo@gmail.com</span></li>
						</ul>
					</div>
					<div className="col-md-6 contact-column col2">
						<form>
						  <div className="form-group">
						    <label for="email">Email address</label>
						    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Valid email"/>
						    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
						  </div>
						  <div className="form-group">
						    <label for="subject">Subject</label>
						    <input type="text" className="form-control" id="subject" placeholder="Subject"/>
						  </div>
						  <div class="form-group">
						    <label for="message">Message</label>
						    <textarea className="form-control" id="message" rows="8" placeholder="What do you want to let us know?"></textarea>
						  </div>
						  <button id="contact-btn" type="submit" className="btn btn-primary">Submit</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

