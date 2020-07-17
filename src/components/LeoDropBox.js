import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import className from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import 'bootstrap/dist/css/bootstrap.min.css';
import Download from './Download';

const SList = props => (
    <tr>
        <td>{props.data}</td>
        <td><Download /></td>
    </tr>
)
//
export default class LeoDropBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			user_name : "",
			docs : []
		};
	}

	componentDidMount = async e => {
		 
		this.setState({
			user_name : localStorage.getItem('user_name')
		});
		const data = {'user_name'  : 'praj'};
		let res;
		console.log(data);
		await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/getDocs', data)
		.then(response => {
			this.setState({
				docs : response.data.data
			});
		})
		.catch(error => {
			console.log(error.response);
		});
	}

    troublesListf() {
       return this.state.docs.map(
            function(data, i) {
                return <SList data = {data} key={i} />;
            }
        )
    }
	
	render() {
		if(localStorage.getItem('session') !== "start"){
			return <Redirect push to = "/DoctorSignIn" />;
		}
		return (
			<div className="user-panel">
						
			<nav className='navbar navbar-expand-lg navbar-light header'>
			<a className="navbar-brand" href="#">
            <img className="logo" src = {require('./Logo.png')} />
            
          	</a>
          	<h1 className="navbar-text"><b>LEO PLATFORM</b></h1>   
				<div className="nav navbar-nav ml-auto">

	          	<Link to="/UserSignIn" className='nav-item nav-link'>LOGOUT</Link>
	            
	            </div> 
			</nav>
			<br/>
			<div className="container">
				<div className="btn btn-primary">
				<Link to={{
					  pathname: '/UploadDoc',
					  state: {
					    user_name : this.state.user_name
					  }
					}}><h4>Upload Files</h4></Link>
					</div>
				 </div>
			<div className="user">
			<div className="row">
				<div className="col-md">
			
				<div className = 'container'>					

					<center>
				<div className="user-jumbotron">
				
					<h2>YOUR <span className="change-color">DOCUMENTS</span> </h2>
					<hr />

					
				</div>


				</center>

				</div>

				</div>			
			</div>
			</div>

				  <table className = 'table table-striped' style={{marginTop: 20}}>
                            <thead>
                                <tr>
                                    <th><h4><b>File</b></h4></th>
                                    <th><h4><b>Download</b></h4></th>   
                                </tr>
                            </thead>
                            <tbody>
                                {this.troublesListf()}
                            </tbody>
                        </table>	
			</div>
		)
	}
}