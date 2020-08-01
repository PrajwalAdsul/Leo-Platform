import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../../elements/Error';
import ScrollspyNav from "react-scrollspy-nav";
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../../MessageBundle';
import HomeHeader from './HomeHeader';
import About from './About';
import Contact from './Contact';
import AppFeatures from './AppFeatures';
import BotFeatures from './BotFeatures';
import WebFeatures from './WebFeatures';
import Screenshots from './Screenshots';
import Footer from './Footer';

export default class HomePage extends React.Component {
	render() {
		return (
			<div className="home-page">
				<HomeHeader active_page = "HomePage" />
	 			<center>

                <div>
	 				<div id="home-section">
	 					<div className="row h-100">
	 						<div className="col-md-1"></div>
	 						<div className="col-md-6 my-auto">
	 							<img className="d-block w-100" src = {require('../triangle4.jpg')} /> 
	 						</div>
	 						<div className="col-md-4 my-auto">
	 							
	 								
	 									<span className="main-tagline"><span className="color-lightblue">PROTECTING</span> YOU<br/> LIKE <span className="color-lightblue">FAMILY</span></span>
	 			
	 							
	 								<div className="container">
	 								<a className="download-app-btn" href={"https://drive.google.com/file/d/1m0mQhot7L2yPQsz6VxDuFUJsqTXqXMUX/view?usp=sharing"} target="_blank">
	 									<img className="d-block w-50 download-app-btn" src = {require('./download-img.png')} />
	 								</a>
	 								</div>
	 							
	 						</div>
	 						<div className="col-md-1"></div>
	 					</div>
	 					
	 				</div>
	 				<div id="features-section">
	 					<span className="aboutsection-heading">Features</span>
	 					<AppFeatures />
	 					<Screenshots />
	 					<BotFeatures />
	 					
	 				</div>
	 				<WebFeatures />
	 				<div id="about-section">
	 					<About />
	 				</div>
	 				<div id="contact-section">
	 					<Contact />
	 				</div>
	 			</div>
				</center>
				<Footer />
			</div>
		)
	}
}