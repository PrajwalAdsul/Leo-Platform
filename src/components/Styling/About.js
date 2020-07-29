import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';


export default class About extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="jumbotron section-jumbotron">
			<span className="aboutsection-heading">About</span>
				<p className="about-tagline">Safety isn’t expensive, it’s priceless.</p>
				<p> Just over a few months ago, we started working on making cities safe. We were encouraged by our college COEP to take part in the Smart India Hackathon - World's Biggest Open Innovation Model. We are a group of students from Computer Engineering with different interests and skills who came to work and collaborate together to find the solution for Crimes in cities. </p>
				<blockquote className="quote-card blue-card">
              		<p>Coming together is the beginning. Keeping together is progress. Working together is success.</p>
        			<cite>Henry Ford</cite>
            	</blockquote>

            	<div className="team-members">
	            	<div className="line"></div>
					<p className="section-heading">TEAM MEMBERS</p>
					<div className="row">
						<div className="col-md-6 col1">
							<p>Prajwal Adsul</p>
							<p>Mayank Jain</p>
							<p>Gouri Nangliya</p>
						</div>
						<div className="col-md-6">
							<p>Priyanka Kankal</p>
							<p>Rohit Chaudhari</p>
							<p>Akanksha Mahajan</p>
						</div>
					</div>
				</div>
        
			</div>
		)
	}
}

