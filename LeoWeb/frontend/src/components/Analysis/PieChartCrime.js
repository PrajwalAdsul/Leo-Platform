import React from 'react';
import { Pie } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.css';
import { Nav } from 'react-bootstrap';
import {Tabs, Tab} from 'react-bootstrap-tabs';

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
			<div id="piechart-maindiv">
				<center>
				<div className="jumbotron section-jumbotron">
				<h2>CRIME BREAKDOWN</h2>

				<Tabs onSelect={(index, label) => console.log(label + ' selected')}>
                    <Tab label={this.state.city[0]}>           
                      
						<div id = {this.state.city[0]}>
							<Pie
								data={{
								labels: this.state.labels[0],
								datasets: this.state.datasets[0]
								}}
								height='100%'
							/>
						</div>

					</Tab>

                    <Tab label={this.state.city[1]}>
                    

                        <div id = {this.state.city[1]}>
							<Pie
								data={{
								labels: this.state.labels[1],
								datasets: this.state.datasets[1]
								}}
								height='100%'
							/>
						</div>

                    </Tab>

                    <Tab label={this.state.city[2]}>

                        <div id = {this.state.city[2]}>
							<Pie
								data={{
								labels: this.state.labels[2],
								datasets: this.state.datasets[2]
								}}
								height='100%'
							/>
						</div>

                    </Tab>
                </Tabs>

                </div>
                </center>
			</div>
		);
	}
}

