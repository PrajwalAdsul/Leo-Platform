import React from 'react';
import './index.css';
import { Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';
import { Nav } from 'react-bootstrap';

/*
 * Class to implement PeiChart
 */
export default class PieChartCrime extends React.Component {
	constructor(props) {
	super(props);
	this.state = {
		city: ['Pune', 'Delhi', 'Banglore'],
		labels: [['Theft', 'Burgulary', 'Murder'],['Murder', 'Rape', 'Hostages'], ['Murder', 'Burgulary', 'Riot']],
		datasets: [
			[{
				data:[2, 5, 8],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['red','blue','yellow']
			}],
			[{
				data:[9, 2, 4],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['red','blue','yellow']
			}],
			[{
				data:[3, 4, 6],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['red','blue','yellow']
			}]
		]
    }
  	}
	render () {
		return (
			<div className = "App">
			<ul>
				<li><a href={"#"+this.state.city[0]}>{this.state.city[0]}</a></li>
				<li><a href={"#"+this.state.city[1]}>{this.state.city[1]}</a></li>
				<li><a href={"#"+this.state.city[2]}>{this.state.city[2]}</a></li>
			</ul>
			<div id = {this.state.city[0]}>
				<h1>Crime Breakdown {this.state.city[0]}</h1>
				<Pie
					data={{
					labels: this.state.labels[0],
					datasets: this.state.datasets[0]
					}}
					height='50%'
				/>
			</div>
			<br/>

			<div id = {this.state.city[1]}>
				<h1>Crime Breakdown {this.state.city[1]}</h1>
				<Pie
					data={{
					labels: this.state.labels[1],
					datasets: this.state.datasets[1]
					}}
					height='50%'
				/>
			</div>
			<br/>

			<div id = {this.state.city[2]}>
				<h1>Crime Breakdown {this.state.city[2]}</h1>
				<Pie
					data={{
					labels: this.state.labels[2],
					datasets: this.state.datasets[2]
					}}
					height='50%'
				/>
			</div>
			<br/>     
		</div>
		);
	}
}

