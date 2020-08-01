import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAt, faLock } from '@fortawesome/free-solid-svg-icons'
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import LoggedIn from './LoggedIn';
import Header from '../Styling/Header';

/*
 * Class to implement sign up functionality for user
 */
export default class Form extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			name : "",
			user_name : "",
			category : "",
			description : "",
			image_url : "",
			token : null
		}
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
				user_name : this.props.user_name,
				token :  await localStorage.getItem('token'),
				category : this.state.category,
				description : this.state.description,
				image_url : this.state.image_url
			}
			// await axios.post('http://localhost:5000/LeoHelp/addUser', data)
			await axios.put('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/user/complaint', data)
			.then(response => {
				this.setState({
					user_name : "",
					complaint : "",
					category : "",
					description : "",
					image_url : ""
				});
				window.location.reload();
			})
			.catch(error => {
				//console.log(error.response);
				this.setState({
						errorText : error.response.data.msg
					});
			});
			
	}

	uploadImage = async e => {
		// do uploading to firebase here
		// firebase will return url of uploaded image

		// at the end
		this.setState({
			"image_url" : "firebase iamge url"
		});
	}

	render() {
		return (
			<div>
				<center>
					<div className="jumbotron shadow-lg new-jumbotron">
				
					<h2>FO<span className="change-color">RM</span></h2>
					<hr />

					<form onSubmit = {this.onSubmit}  className="login-form">
					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="name">category:</label>
						</div>
						<div className="col-md-10">
						<input type="text" className="form-control" value={this.state.category} name="category" id="category" placeholder="category" onChange={this.handleChange} required/>
						</div>
					</div>
					</div>


					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="name">description:</label>
						</div>
						<div className="col-md-10">
						<input type="text" className="form-control" value={this.state.description} name="description" id="description" placeholder="description" onChange={this.handleChange} required/>
						</div>
					</div>
					</div>

					<center> <button type="button" onClick={this.uploadImage} className="btn btn-primary">uploadImage</button></center>
				
					<center> <button type="button" onClick={this.onSubmit} className="btn btn-primary">Submit</button></center>
										
					</form>
				
				</div>
			</center>
			</div>
		)
	}
}
