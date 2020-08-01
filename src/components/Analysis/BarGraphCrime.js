import React from 'react';
import './index.css';
import { Bar } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';

/*
 * Class to implement bar graph
 */
export default class BarGraphCrime extends React.Component {
	constructor(props) {
	super(props)
	this.state = {
		labels: ['Pune', 'Delhi', 'Banglore', 'Mumbai'],
		datasets: [
			{
				data: [8, 5, 4, 7],
				borderWidth: 0,
				label : 'Top Cities in Crime',
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#EF7700'],
				hoverBackgroundColor: ['red','blue','yellow', 'orange']
				/*
				Or 
				'''
				backgroundColor: '#FF6384',
				hoverBackgroundColor: 'red'
				'''
				This will give same color for all bars
				*/
			}
		]
    }
  	}
	render () {
		return (
			<div className = "App">
			
			<Bar
				data={this.state}
				height={300}
				options={{
					title: {
						display: true,
						text: 'Most crime occurances in India',
						fontSize: 30
					},
					/*
						xAxes gridLines: true gives verticle lines
						yAxes gridLines: true gives horizontal lines
					*/
					scales: {
						xAxes: [{
							gridLines: {
								display: false
							}
						}],
						yAxes: [{
							ticks: {
								display: true,
								suggestedMin:0
							},
							gridLines: {
								display: false
							}
						}]
					},
					legend: {
						display: false,
					},
					responsive: true,
					/*
					maintainAspectRatio: false is helpful for visually adapting chart for mobile design
					*/
					maintainAspectRatio: false,
					layout: {
						padding: {
							top: 5,
							left: 200,
							right: 200,
							bottom: 15
						}
					}
				}}
			/>
			</div>
		);
	}
}

