import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
//import { UserRegistration, UsernameValidation } from '../services/RegistrationService';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';

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
			<div><center>
				<br/> <br/> <br/> <br/>
				<h2>Add Area </h2>
				<form onSubmit = {this.onSubmit}>
					<p>name </p>
					<input type="text" value={this.state.name} name="name" onChange={this.handleOnChangeName}/>
					<p>crimes</p>
					<input type="text" value={this.state.crimes} name="crimes" onChange={this.handleOnChangeCrimes}/>
					<p>min longitude</p>
					<input type="text" value={this.state.minlongitude} name="precautions" onChange={this.handleOnChangeMinlo}/>
					<p>max longitude</p>
					<input type="text" value={this.state.maxlongitude} name="precautions" onChange={this.handleOnChangeMaxlo}/>
					<p>min latitude</p>
					<input type="text" value={this.state.minlatitude} name="precautions" onChange={this.handleOnChangeMinla}/>
					<p>max latitude</p>
					<input type="text" value={this.state.maxlatitude} name="precautions" onChange={this.handleOnChangeMaxla}/>
					
					<br/><br/>
					<button type="submit" className="btn btn-primary">add</button>
							
				</form>
				</center>
			<Link to="/AddCrime">add a crime</Link>
			<br/><br/>
			<Link to="/ShowCrimes">show all crimes</Link>
			<br/><br/>
			<Link to="/ShowAreas">show all areas</Link>
														
		
			</div>
		)
	}
}
