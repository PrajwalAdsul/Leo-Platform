import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import className from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class Download extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user_name : "",
			docs : []
		};
	}

	componentDidMount = async e => {
		 
	}

	onSubmit = async e =>{

		await axios.get('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/download')
		.then((response) => {
		   const url = window.URL.createObjectURL(new Blob([response.data]));
		   const link = document.createElement('a');
		   link.href = url;
		   link.setAttribute('download', 'l.png'); //or any other extension
		   document.body.appendChild(link);
		   link.click();
		});
	}	
	render() {
		return (
			<div>
			<button onClick ={this.onSubmit}>Download</button>
			</div>
		)
	}
}