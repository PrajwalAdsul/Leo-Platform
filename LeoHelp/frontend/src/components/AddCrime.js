import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, UsernameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';

export default class Registration extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name : '',
			description : '',
			precautions : ''
		};
	}

	handleOnChangeName = e => {
		this.setState({
			name : e.target.value
		});
	}

	handleOnChangeDescription = e => {
		this.setState({
			description : e.target.value
		});
	}

	handleOnChangePrecautions = e => {
		this.setState({
			precautions : e.target.value
		});
	}

	handleOnBlur = async e => {
		this.setState({
			user_name: e.target.value
		});
		const data = {
			user_name: this.state.user_name
		};
		//const isUsernameTaken = await UsernameValidation(data);
		//Add axios cod3e
		var isUsernameTaken = 0;
		console.log(data);	
		await axios.post('http://localhost:4000/login/userexists', data)
		.then(response => {
			console.log(response);
			isUsernameTaken = response.status;
		})
		.catch(err => {
			console.log(err.response);
		});
		
		//const isUsernameTaken = 0;
		isUsernameTaken === 204
		? this.setState({user_name_taken: true})
		: this.setState({user_name_taken: false});

	}

	onSubmit = async e => {

		e.preventDefault();
		const data = {
			name : this.state.name,
			description : this.state.description,
			precautions : this.state.precautions,
		};
		var res;
		console.log(data);
		await axios.post('http://localhost:4000/LeoMine/addCrime', data)
		.then(response => {
			console.log(response);
			res = response.status;
		})
		.catch(error => {
			console.log(error.response);
		});
//		const res = await UserRegistration(data);
			//add axios code
			// res = 200;
			if(res === 200) {
					this.setState({
					name : '',
					description : '',
					precautions : '',
					});
			} else this.setState({
		//		error: true,
		//		register: false
			});
		}

	render() {
		//const { register, error, user_name_taken } = this.state;

		return (
			<div>
				<h1>Add Crime </h1>
				<form onSubmit = {this.onSubmit}>
					<p>name </p>
					<input type="text" value={this.state.name} name="name" onChange={this.handleOnChangeName}/>
					<p>description</p>
					<input type="text" value={this.state.description} name="description" onChange={this.handleOnChangeDescription}/>
					<p>precautions</p>
					<input type="text" value={this.state.precautions} name="precautions" onChange={this.handleOnChangePrecautions}/>
					<button type="submit" className="btn btn-primary">add</button>
							
				</form>
			</div>
		)
	}
}
