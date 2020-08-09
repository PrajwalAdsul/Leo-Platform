import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import DROHeader from './DROHeader';

/*
 * Class to showcase user profile with required information
 */
export default class UserProfile extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user_name: "",
			email: "",
			phone: "",
			area: "",
			emergencyContacts: [],
			log: [],
			token: null
		}
	}

	componentDidMount = async e => {
		try {
			const data = { user_name: this.props.location.state.user_name, token: localStorage.getItem("token") };
			await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/user/get', data)
				.then(response => {
					this.setState({
						user_name: response.data.user_name,
						email: response.data.email,
						phone: response.data.phone,
						area: response.data.area,
						emergencyContacts: response.data.emergencyContacts,
					});

					let log = response.data.log;
					let logv = [];

					for (var i = 0; i < log.length; i++) {
						logv.push("datetime " + log[i]["datetime"] + " operation " + log[i]["operation"] + " text " + log[i]["text"] + "\n");
					}

					this.setState({
						log: logv
					});
				})
				.catch(error => {
					console.log(error.response);
				});
		}
		catch (e) {
			console.log(e);
		}
	}
	render() {
		if (localStorage.getItem('session') != "start") {
			return <Redirect push to="/DROSignIn" />;
		}
		return (
			<div className="user-panel">
				<DROHeader />

				<div className="container">
					<Link
						to={{
							pathname: '/DROPanel'
						}}
						className='back-btn'>Back</Link>
				</div>

				<div className="container">
					<div className="card-text">
						<div className="row">
							<div className="col-md-6">
								<span className="user-profile-heading">Username :</span> {this.state.user_name}
							</div>
							<div className="col-md-6">
								<span className="user-profile-heading">Phone No :</span> {this.state.phone}
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<span className="user-profile-heading">Email ID :</span> {this.state.email}
							</div>
							<div className="col-md-6">
								<span className="user-profile-heading">Area :</span> {this.state.area}
							</div>
						</div>
						<br />
						<span className="user-profile-heading">Emergency Contacts :</span> <br />
						<ol>
							{this.state.emergencyContacts.map(reptile => <li>{reptile}</li>)}
						</ol><br /><br />
						<span className="user-profile-heading">User Log :</span> <br />
						{this.state.log.map(reptile => <p>{reptile}<br /><br /></p>)}
						<br /><br />
					</div>
				</div>
			</div>
		)
	}
}