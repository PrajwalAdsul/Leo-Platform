import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';
import MapGL, {GeolocateControl} from 'react-map-gl';

const geolocateStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  margin: 10
};

export default class InTrouble extends Component {
	constructor(props) {
		super(props);
		this.state = {
			name : '',
			description : '',
			place : '',
			latitude : '',
			longitude : '',

			viewport: {
		        width: 800,
		        height: 800,
		        latitude: 13,
		        longitude: 80,
		        zoom: 8
		    }
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

	handleOnChangePlace = e => {
		this.setState({
			place : e.target.value
		});
	}


	handleOnChangeLatitude = e => {
		this.setState({
			latitude : e.target.value
		});
	}

	handleOnChangeLongitude = e => {
		this.setState({
			longitude : e.target.value
		});
	}

	handleOnBlur = async e => {
		this.setState({
			user_name: e.target.value
		});
		const data = {
			user_name: this.state.user_name
		};
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
		isUsernameTaken === 204
		? this.setState({user_name_taken: true})
		: this.setState({user_name_taken: false});

	}

	onSubmit = async e => {

		e.preventDefault();
		const data = {
			name : this.state.name,
			description : this.state.description,
			place : this.state.place,
			latitude : this.state.latitude,
			logitude : this.state.longitude
		};
		let lat = this.state.latitude;
		let long = this.state.longitude;
		var res;
		console.log(data);
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/markTrouble', data)
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
						description : '',
						place : '',
						latitude : 0,
						longitude : 0,
						viewport : {
							width: 800,
					        height: 800,
					        latitude: lat,
					        longitude: long,
					        zoom: 8
						}
					});
			} else this.setState({
			});
		}

	render() {
		return (
			<div><center>
				<br/> <br/> <br/> <br/>
				<h2>User in trouble</h2>
				<form onSubmit = {this.onSubmit}>
					<p>name </p>
					<input type="text" value={this.state.name} name="name" onChange={this.handleOnChangeName}/>
					<p>description</p>
					<input type="text" value={this.state.description} name="description" onChange={this.handleOnChangeDescription}/>
					<p>place</p>
					<input type="text" value={this.state.place} name="place" onChange={this.handleOnChangePlace}/>
					<p>latitude</p>
					<input type="number" value={this.state.latitude} name="latitude" onChange={this.handleOnChangeLatitude}/>
					<p>longitude</p>
					<input type="number" value={this.state.longitude} name="longitude" onChange={this.handleOnChangeLongitude}/>
					
					<br/><br/>
					<button type="submit" className="btn btn-primary">Im in trouble</button>
							
				</form>
				</center>
				<MapGL
			        {...this.state.viewport}
			       onViewportChange={(viewport) => this.setState({viewport})}
			           mapboxApiAccessToken="pk.eyJ1IjoicHJhandhbGFkIiwiYSI6ImNrNTlzbjh2cjEwNzQzbGxqb3RvOWE5anoifQ.U0JgwrGh7GdNioVRUZUhGQ"
			      >
			       <GeolocateControl
			          style={geolocateStyle}
			          positionOptions={{enableHighAccuracy: true}}
			          trackUserLocation={true}
			        />
			     </MapGL>
			</div>
		)
	}
}
