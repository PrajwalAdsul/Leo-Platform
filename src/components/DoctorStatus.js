import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import className from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleMap from './SimpleMap';
import ShowECs from './ShowECs';
import MarkTrouble from './MarkTrouble';
 
export default class LoggedIn extends Component {
	constructor(props) {
		super(props)
		this.state= {
			user_name : "",
			name : "",
			email : "",
			phone : "",
			area : "",
			unique_key : "",
			qualification : "",
			helpType : "",
			hospital : "",
			hospitalLocation : "",
			degreeType : "",
			college : "",
			qualification : "",
			startFreeTime : 0,
			endFreeTime : 100,
			isFree : false,
			longitude : 70,
			latitude : 70,
			applicationStatusComment : "",
			status : false, 
			showstatus : "",
			latitude : 0,
			longitude : 0
		}

		this.handleChange = this.handleChange.bind(this)
		console.log(this.state.user_name)
	}

	handleChange(event) {
		const {name, value} = event.target
		this.setState({
			[name]: value
		})

	}

	componentDidMount = async e => {
		 
		this.state.user_name = this.props.location.state.user_name;

		const data = {user_name : this.props.location.state.user_name};
		let res;
		console.log(data);
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/getDoctor', data)
		.then(response => {
			console.log(response.data);
			res = response.status;
			this.setState({
				status : response.data.status
			})
		})
		.catch(error => {
			console.log(error.response);
		});
	}

	onSubmit = async e => {
		e.preventDefault();

		const data = {
			user_name : this.props.location.state.user_name,
			email : this.state.email,
			phone : this.state.phone,
			area : this.state.area,
			unique_key : this.state.unique_key,
			qualification : this.state.qualification,
			helpType : this.state.helpType,
			hospital : this.state.hospital,
			hospitalLocation : this.state.hospitalLocation,
			degreeType : this.state.degreeType,
			college : this.state.college,
			qualification : this.state.qualification,
			startFreeTime : this.state.startFreeTime,
			endFreeTime : this.state.endFreeTime,
			isFree : false,
			longitude : this.state.longitude,
			latitude : this.state.latitude,
			status : false,
			applicationStatusComment : "Pending For Approval"
		};
		console.log(data);
		let res;
		
		await axios.put('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/updateDoctor', data)
		.then(response => {
			console.log(response);
			res = response.status;
			this.setState({
				
			})
		})
		.catch(error => {
			console.log(error.response);
		});
		if(res === 200) {
			this.setState({
				showstatus : "You have successfully filled the form. Waiting for admins approval"
			});
		} else
		{
			this.setState({
				errorMessage : "Entries are not valid"
			})
		}

	}
	
	render() {
		if(localStorage.getItem('session') !== "start"){
			return <Redirect push to = "/DoctorSignIn" />;
		}
		if(this.state.status == true){
			return <Redirect push  to={{
            	pathname : '/DoctorMainPage',
            	state : { user_name : this.props.location.state.user_name}
        	}} />;
		}
		return (
			<div className="user-panel">
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			<a className="navbar-brand" href="#">
            <img className="logo" src = {require('./Logo.png')} />
            
          	</a>
          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>      
			</nav>

			
			<nav className='navbar navbar-expand-lg navbar-light header'>
			<a className="navbar-brand" href="#">
            <h1><b>LEO HELP</b></h1>
          	</a>
				<div className="nav navbar-nav ml-auto">

	          	<Link to="/UserSignIn" className='nav-item nav-link'>LOGOUT</Link>
	            
	            </div> 
			</nav>

			<h1 ><b>{this.state.showstatus}</b></h1>      

			<div className="user">
			<div className="row">
				<div className="col-md">
			
				<div className = 'container'>					

					<center>
				<div className="user-jumbotron">
				
					<h2>FILL <span className="change-color">FORM</span> </h2>
					<hr />

					

					<form onSubmit = {this.onSubmit}>
					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="name">Name:</label>
						</div>
						<div className="col-md-10">
						<input type="text" className="form-control" value={this.state.name} name="name" id="name" placeholder="Full Name" onChange={this.handleChange} required/>
						</div>
					</div>
					</div>

					<div className="form-group">
					<div className="row">
					<div className="col-md-2">
						<label htmlFor="email">Email:</label>
						</div>
							<div className="col-md-10">
							<input type="email" className="form-control" id="email" name="email" value={this.state.email} placeholder="Email" onChange={this.handleChange} required/>
				
					</div>
					</div>
					</div>


					<div className="form-row">
					
					<div className="form-group col-md-6">
						<label htmlFor="phone" >Phone</label>
						<input type="number" className="form-control" id="phone" name="phone" value={this.state.phone} placeholder="phone" onChange={this.handleChange} required/>
					</div>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Qualification:</label>
						<input type="text" name="qualification" id="qualification" className="form-control" value={this.state.qualification} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Graduation college:</label>
						<input type="text" name="college" id="college" className="form-control" value={this.state.college} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Expertise:</label>
						<input type="text" name="expertise" id="user_name" className="form-control" value={this.state.expertise} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Location of stay:</label>
						<input type="text" name="location" id="user_name" className="form-control" value={this.state.location} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Latitude:</label>
						<input type="number" name="latitude" id="latitude" className="form-control" value={this.state.latitude} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Longitude:</label>
						<input type="number" name="longitude" id="longitude" className="form-control" value={this.state.longitude} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Hospital or Clinic name:</label>
						<input type="text" name="hospital" id="user_name" className="form-control" value={this.state.hospital} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Location of hospital:</label>
						<input type="text" name="hospitalLocation" id="user_name" className="form-control" value={this.state.hospitalLocation} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Available hours:</label>
						<br/>
						<label htmlFor="user_name" >Start time:</label>	
						<input type="Number" name="startFreeTime" id="user_name" className="form-control" value={this.state.startFreeTime} placeholder="" onChange={this.handleChange} required/>
					
						<label htmlFor="user_name" >End time:</label>
						
						<input type="Number" name="endFreeTime" id="user_name" className="form-control" value={this.state.endFreeTime} placeholder="" onChange={this.handleChange} required/>
					
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Type (Alopathy, Ayurvedic, Homeopathy etc):</label>
						<input type="text" name="type" id="user_name" className="form-control" value={this.state.type} placeholder="" onChange={this.handleChange} required/>
					</div>

					<div className="form-group col-md-6">
						<label htmlFor="user_name" >Upload Degree Certificate:</label>
					 <input type="file" className = "form-control" onChange={this.onChange} />
			        <button type="submit">Upload</button>
			        </div>

						
						<br/><br/>
						
						<center><button type="button" onClick={this.onSubmit} className="btn btn-primary btn-lg">SUBMIT</button></center>
					
					</form>
				
				</div>


				</center>

				</div>

				</div>			
			</div>
			</div>	
			</div>
		)
	}
}