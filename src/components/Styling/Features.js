import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import axios from 'axios';


export default class Features extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {
		return (
			<div className="jumbotron section-jumbotron">
				<div className="row">
					<div className="col-md-6">Add image here</div>
					<div className="col-md-6">
						<div className="line"></div>
						<p className="section-heading">HOW IT WORKS</p>
						<h2 className="tagline">This is how you get our App working</h2>
					</div>
				</div>
			</div>
		)
	}
}

