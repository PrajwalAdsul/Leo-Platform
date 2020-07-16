import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import Logout from './Logout';

export default class NameDoc extends Component {
	constructor(props) {
		super(props);

		this.state = {
			name : '',
			user_name : '',
			nameDone : false
		};
	}

	handleOnChangeName = e => {
		this.setState({
			name : e.target.value
		});
	}

	handleOnChangeUserName = e => {
		this.setState({
			user_name : e.target.value
		});
	}
		
	onSubmit1 = async e => {
			const dat = {'name' : this.state.name, 'user_name' : this.state.user_name}
			console.log(dat);
			axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/renameDoc', dat)
			.then(response => {
				console.log(response);
			})
			.catch(error => {
				console.log(error.response);
			});
			this.setState({nameDone : true});
		}
	render() {
		if (this.state.nameDone == true) {
					return <Redirect push  to={{
		            	pathname : '/UploadDoc',
		         	}} />;
				}
		return (
			<div><center>
			<h1>
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			<a className="navbar-brand" href="#">
            <img className="logo" src = {require('./Logo.png')} />
            
          	</a>
          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>      
			</nav>

			
			<nav className='navbar navbar-expand-lg navbar-light header'>
			<a className="navbar-brand" href="#">
            <h1><b>LEO TAKE CARE</b></h1>
          	</a>
			<div className="nav navbar-nav ml-auto">

			<Logout/>
          	
            </div>
              
			</nav>
			<br/> <br/>
			<h3>Now get access to all your medical reports, insurance papers anywhere, anytime through Leo</h3>
				<br/> <br/> <br/> <br/>
				<p>Name </p>
					<input type="text" value={this.state.name} name="name" onChange={this.handleOnChangeName}/>
					<br/> <br/>
					<p>UserName </p>
					<input type="text" value={this.state.user_name} name="name" onChange={this.handleOnChangeUserName}/>
					
				<div className="col-md-3">
				<div className="container">
					<button onClick = {this.onSubmit1}>Name</button>
				</div>
				</div>
				</h1>	
				</center>
			</div>
		)
	}
}