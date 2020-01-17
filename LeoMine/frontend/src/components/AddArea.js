import React, { Component } from 'react';
import { Link ,Route, Redirect, Switch, BrowserRouter as Router} from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, UsernameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';

import Header from './Header';
import Form from 'react-bootstrap/Form';


export default class AddArea extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name : '',
			crimes : [],
			minlongitude : 0,
			maxlongitude : 0,
			minlatitude : 0,
			maxlatitude : 0
		};
	}

	handleOnChangeName = e => {
		this.setState({
			name : e.target.value
		});
	}

	handleOnChangeCrimes = e => {
		this.setState({
			crimes : e.target.value
		});
	}

	handleOnChangeMinlo = e => {
		this.setState({
			minlongitude : e.target.value
		});
	}

	handleOnChangeMaxlo = e => {
		this.setState({
			maxlongitude : e.target.value
		});
	}

	handleOnChangeMinla = e => {
		this.setState({
			minlatitude : e.target.value
		});
	}

	handleOnChangeMaxla = e => {
		this.setState({
			maxlatitude : e.target.value
		});
	}

	onSubmit = async e => {

		e.preventDefault();
		const data = {
			name : this.state.name,
			crimes : this.state.crimes,
			minlongitude : this.state.minlongitude,
			maxlongitude : this.state.maxlongitude,
			minlatitude : this.state.minlatitude,
			maxlatitude : this.state.maxlatitude
		};
		var res;
		console.log(data);
		await axios.post('http://localhost:4000/LeoMine/addArea', data)
		.then(response => {
			console.log(response);
			res = response.status;
		})
		.catch(error => {
			console.log(error.response);
		});

			if(res === 200) {
					this.setState({
						name : '',							
						crimes : '',
						minlongitude : 0,
						maxlongitude : 0,
						minlatitude : 0,
						maxlatitude : 0
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
				
					<h2>ADD <span className="change-color">AREA</span> </h2>
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
						<label htmlFor="crimes">Crimes:</label>
						</div>
							<div className="col-md-10">
						<input type="text" className="form-control" value={this.state.crimes} name="crimes" id="crimes" onChange={this.handleOnChangeCrimes}/>
					</div>
					</div>
					</div>


					<div className="form-row">
					<div className="form-group col-md-6">
						<label htmlFor="minlongitude" >Min Longitude:</label>
						<input type="number" className="form-control" value={this.state.minlongitude} name="minlongitude" id="minlongitude" onChange={this.handleOnChangeMinlo}/>
					</div>
						
					<div className="form-group col-md-6">
						<label htmlFor="maxlongitude" >Max Longitude:</label>
						<input type="number" className="form-control" value={this.state.maxlongitude} name="maxlongitude" id="maxlongitude" onChange={this.handleOnChangeMaxlo}/>
					</div>
					</div>

					<div className="form-row">
					<div className="form-group col-md-6">
						<label htmlFor="minlatitude" >Min Latitude:</label>
						<input type="number" className="form-control" value={this.state.minlatitude} name="minlatitude" id="minlatitude" onChange={this.handleOnChangeMinla}/>
					</div>
						
					<div className="form-group col-md-6">
						<label htmlFor="maxlatitude" >Max Latitude:</label>
						<input type="number" className="form-control" value={this.state.maxlatitude} name="maxlatitude" id="maxlatitude" onChange={this.handleOnChangeMaxla}/>
						</div>
					</div>
						
						
						<br/><br/>
						<center> <button type="submit" className="btn btn-primary btn-lg"><h3>ADD</h3></button> </center>
								
					</form>
				
				</div>


				</center>
			
		
			</div>
		)
	}
}
