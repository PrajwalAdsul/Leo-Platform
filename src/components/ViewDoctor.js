import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link, withRouter} from "react-router-dom";
import Message from '../elements/Message';
import Error from '../elements/Error';
import { COMMON_FIELDS, REGISTRATION_FIELDS, LOGIN_FIELDS, LOGIN_MESSAGE, ERROR_IN_LOGIN } from '../MessageBundle';
import axios from 'axios';
import Button from '@material-ui/core/Button'
 
export default class ViewDoctor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clicked : false
		}
	}

	onSubmit = async e => {
		this.state.clicked = true;	
		this.setState({
			clicked : true
		})
	}

	render(){
		if(this.state.clicked == true){
			this.state.clicked = false;
			return <Redirect push  to={{
            	pathname : '/DoctorProfile',
            	state : { user_name : this.props.user_name }
        	}} />;
		}
		else{
	        return(
	        	    <button onClick={this.onSubmit}>View</button>
	        );
	    }
	}
}

			