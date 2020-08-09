import React, { Component } from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';

/*
 * Class to implement log out functionality for Police
 */
export default class Logout extends Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}
	async onSubmit(e) {
		// const data ={
		// 	user_name : localStorage.getItem('user_name'),
		// };
		// await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/logOut', data)
		// 	.then(response => {
		// 		this.setState({
		// 		});
		// 	})
		// 	.catch(error => {
		// 		//console.log(error.response);
		// 		this.setState({

		// 			});
		// 		return;
		// 	});
		await localStorage.setItem('user_name', "");
		await localStorage.setItem('password', "");
		await localStorage.setItem('session', "end");
		await localStorage.setItem('token', "");
		await localStorage.clear();
	}
	render() {
		return (
			<div>
				<Link to="/PoliceSignIn" className='nav-item nav-link' onClick={this.onSubmit} >LOGOUT</Link>
			</div>
		);
	}
}
