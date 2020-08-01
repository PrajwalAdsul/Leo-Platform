import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';

/*
 * Class to implement contact section of homepage
 */
export default class Contact extends Component {
	constructor(props) {
		super(props);
		this.state = {
			email : "",
			msg : "",
			subject : "",
			errorMessage : "",
			successfulMessage: ""
		};
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})
	}

	onSubmit = async e => {
		const data = {
			email : this.state.email,
			subject : this.state.subject,
			msg: this.state.msg
		};
		
		var res;
		
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/contact', data)
		.then(response => {
			console.log(response);
			res = response.status;
		})
		.catch(error => {
			console.log(error.response);
		});
		
		if(res === 200) {
			this.setState({
				email : "",
				msg : "",
				subject : "",
				successfulMessage: "Thank You for contacting us! We will get back to you.",
				errorMessage: ""
			});
		} else {
			this.setState({
				errorMessage: "Error: Message not sent",
				successfulMessage: ""
			});	
		}
	}

	render() {
		return (
			<div className="jumbotron section-jumbotron">
				<div className="row">
					<div className="col-md-6 contact-column col1">
						<div className="line"></div>
						<p className="section-heading">CONTACT US</p>
						<h2 className="contact-tagline">We'd like to hear from you</h2>
						<p className="section-p">Don't hesitate to get in contact with us no matter your request. We are here to help you.</p>
						<ul>
							<li><FontAwesomeIcon icon={faMapMarker} color="#00909e"/><span className="list-text">College of Engineering, Pune, India</span></li>
							<li><span className="list-text">+91 8379987625</span></li>
							<li><FontAwesomeIcon icon={faEnvelope} color="#00909e"/><span className="list-text">priyankakankal17@gmail.com</span></li>
						</ul>
					</div>
					<div className="col-md-6 contact-column col2">
						<form>
						  <div className="form-group">
						    <label for="email">Email address</label>
						    <input type="email" className="form-control" id="email" value={this.state.email} name="email" aria-describedby="emailHelp" placeholder="Valid email" onChange={this.handleChange} required/>
						    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
						  </div>
						  <div className="form-group">
						    <label for="subject">Subject</label>
						    <input type="text" className="form-control" id="subject" value={this.state.subject} name="subject" placeholder="Subject" onChange={this.handleChange} required/>
						  </div>
						  <div className="form-group">
						    <label for="message">Message</label>
						    <textarea className="form-control" id="message" value={this.state.msg} name="msg" rows="8" placeholder="What do you want to let us know?" onChange={this.handleChange} required></textarea>
						  </div>
						  <h4><span className="errorMessage">{this.state.errorMessage}</span><span className="successfulMessage">{this.state.successfulMessage}</span></h4><br />
						  <button id="contact-btn" onClick={this.onSubmit} type="button" className="btn btn-primary">Submit</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

