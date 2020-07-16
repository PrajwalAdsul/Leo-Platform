import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import axios from 'axios';
import Logout from './Logout';

export default class UploadDoc extends Component {
	constructor(props) {
		super(props);
		this.state = {
			file : [],
			uploadDone : false
		};
	}

	handleOnChangeFile = e => {
		this.setState({
			file : e.target.value
		});
	}

	onSubmit = async e => {
		var data = new FormData();
	    var imagedata = document.querySelector('input[type="file"]').files[0];
	    data.append("file", imagedata);
	    
		this.setState({uploadDone : true});
		fetch("https://peaceful-refuge-01419.herokuapp.com/LeoHelp/uploadDoc", {
		      mode: 'no-cors',
		      method: "POST",
		      body: data
		    }).then(function (res) {
		      
		    }, function (e) {

		    });



	}
	render() {
		if (this.state.uploadDone == true) {
					this.setState({
						uploadDone : false
					});
					return <Redirect push  to={{
		            	pathname : '/NameDoc',
		         	}} />;
				}
		return (
			<div><center>
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
			<a className="navbar-brand" href="#">
            <img className="logo" src = {require('./Logo.png')} />
            
          	</a>
          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>      
			</nav>

			
			<nav className='navbar navbar-expand-lg navbar-light header'>
			<a className="navbar-brand" href="#">
            <h1><b>LEO TAKECARE</b></h1>
          	</a>
			<div className="nav navbar-nav ml-auto">

			<Logout/>
          	
            </div>
              
			</nav>
			<br/> <br/>
			<h3>Now get access to all your medical reports, insurance papers anywhere, anytime through Leo</h3>
			<h2>
				<br/> <br/>
				<h2>Upload your Document </h2>
				<br/> <br/>
				<center>
				<form onSubmit = {this.onSubmit}>
					<input type="file" value={this.state.file} name="crimes" onChange={this.handleOnChangeFile}/>
					<br/>
					<button type="submit">Upload</button>
				</form>
				</center>
				</h2>	
				</center>
			</div>
		)
	}
}