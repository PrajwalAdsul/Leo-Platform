import React, { Component } from 'react';
import DownloadLink from "react-download-link";
import { Link } from "react-router-dom";
import classNames from 'classnames';
import Error from '../elements/Error';
import { REGISTRATION_FIELDS, REGISTRATION_MESSAGE, COMMON_FIELDS, ERROR_IN_REGISTRATION } from '../MessageBundle';
import axios from 'axios';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



export default class Screenshots extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}

	render() {

		const responsive = {
			desktop: {
				breakpoint: { max: 3000, min: 1024 },
				items: 1,
				slidesToSlide: 1, // optional, default to 1.
			},
			tablet: {
				breakpoint: { max: 1024, min: 464 },
				items: 1,
				slidesToSlide: 1 // optional, default to 1.
			},
			mobile: {
				breakpoint: { max: 464, min: 0 },
				items: 1,
				slidesToSlide: 1 // optional, default to 1.
			}
		};
		return (
			<div className="jumbotron section-jumbotron">
				<div className="line"></div>
				<p className="section-main-heading">APP SCREENSHOTS</p>

				<div className="row">
					<div className="col-md-2"></div>
					<div className="col-md-8">
						<div className="screenshots-container">
					<Carousel
						swipeable={false}
						draggable={false}
						showDots={true}
						responsive={responsive}
						ssr={true} // means to render carousel on server-side.
						infinite={true}
						autoPlay={this.props.deviceType !== "mobile" ? true : false}
						autoPlaySpeed={2000}
						keyBoardControl={true}
						customTransition="all .5s ease"
						transitionDuration={2000}
						containerClass="carousel-container"
						removeArrowOnDeviceType={["tablet", "mobile"]}
						deviceType={this.props.deviceType}
						dotListClass="custom-dot-list-style"
						itemClass="carousel-item-padding-40-px"
						centerMode={true}
					>
						<div className="container">
							<div className="container img-container"><img src = {require('./App-Screenshots/Screenshot1.jpeg')} className="d-block w-100" /></div>
						</div>
						<div className="container">
							<div className="container img-container"><img src = {require('./App-Screenshots/Screenshot2.jpeg')} className="d-block w-100" /></div>
						</div>
						<div className="container">
							<div className="container img-container"><img src = {require('./App-Screenshots/Screenshot3.jpeg')} className="d-block w-100" /></div>
						</div>
						<div className="container">
							<div className="container img-container"><img src = {require('./App-Screenshots/Screenshot4.jpeg')} className="d-block w-100" /></div>
						</div>
						<div className="container">
							<div className="container img-container"><img src = {require('./App-Screenshots/Screenshot5.jpeg')} className="d-block w-100" /></div>
						</div>
						<div className="container">
							<div className="container img-container"><img src = {require('./App-Screenshots/Screenshot6.jpeg')} className="d-block w-100" /></div>
						</div>
						<div className="container">
							<div className="container img-container"><img src = {require('./App-Screenshots/Screenshot7.jpeg')} className="d-block w-100" /></div>
						</div>
					</Carousel>;
				</div>
					</div>
					<div className="col-md-2"></div>
				</div>
				
			</div>
		)
	}
}