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
				<HomeHeader />
	 			<center>

                <div>
	 				<div id="home-section">
	 					<div className="row h-100">
	 						<div className="col-sm-6 my-auto">
	 							<img src = {require('../Logo1.png')} /> 
	 						</div>
	 						<div className="col-sm-6 my-auto">
	 							<span className="main-tagline">YOUR <span className="color-lightblue">SAFETY</span> <br/> IS OUR <span className="color-lightblue">PRIORITY</span></span>
	 						</div>
	 					</div>
	 					
	 				</div>
	 				<div id="features-section">
	 					<div className="line"></div>
						<p className="section-main-heading">FEATURES</p>
	 					<AppFeatures />
	 					<Screenshots />
	 					<BotFeatures />
	 					<WebFeatures />
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