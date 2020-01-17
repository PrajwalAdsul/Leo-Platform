import React, { Component } from 'react';
import { Link , Redirect} from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, UsernameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';
import Header from './Header';

export default class AddCrime extends Component {
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
		await axios.post('http://localhost:4000/LeoMine/addCrime', data)
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
			<Header />
			<center>

				<div className="jumbotron">
				
					<h2>ADD <span className="change-color">CRIME</span> </h2>
					<hr />
					<form onSubmit = {this.onSubmit}>
						<div className="form-group">
							<div className="row">
								<div className="col-md-2">
									<label htmlFor="name">Name:</label>
								</div>
								<div className="col-md-10">
								<input type="text" className="form-control" value={this.state.name} name="name" id="name" onChange={this.handleOnChangeName}/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<div className="row">
								<div className="col-md-2">
									<label htmlFor="description">Description:</label>
								</div>
								<div className="col-md-10">
								<input type="text" className="form-control" value={this.state.description} name="description" id="description" onChange={this.handleOnChangeDescription}/>
								</div>
							</div>
						</div>

						<div className="form-group">
							<div className="row">
								<div className="col-md-2">
									<label htmlFor="precautions">Precautions:</label>
								</div>
								<div className="col-md-10">
									<input type="text" className="form-control" value={this.state.precautions} name="precautions" id="precautions" onChange={this.handleOnChangePrecautions}/>
								</div>
							</div>
						</div>
						
						<br/><br/>
						<center><button type="submit" className="btn btn-primary btn-lg"><h3>ADD</h3></button></center>
								
					</form>
				</div>
				</center>

				
			</div>
		)
	}
}
