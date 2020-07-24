import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import LoggedIn from './LoggedIn';
import HomeHeader from './HomeHeader';
import Contact from './Contact';
import Features from './Features';
import Screenshots from './Screenshots';
import Footer from './Footer';

export default class HomePage extends React.Component {
	render() {
		return (
			<div className="home-page">
				<HomeHeader />
	 			<center>
	 				<section id="home-section">
	 					
	 				</section>
	 				<section id="features-section">
	 					<Features />
	 					<Screenshots />
	 				</section>
	 				<section id="contact-section">
	 					<Contact />
	 				</section>
				</center>
				<Footer />
			</div>
		)
	}
}