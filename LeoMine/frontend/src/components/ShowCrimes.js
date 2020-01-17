import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap/dist/css/bootstrap.css';
import Header from './Header';

const SList = props => (
    <div>
    <div className="card">
                <img src="..." className="card-img-top" alt="..." />
                <div className="card-body">
                  <h3 className="card-title"><b>{props.data.name}</b></h3>
                  <div className="card-text">{props.data.description}</div>
                  <div className="card-text"><span className="change-color"><b>Precautions: </b><br /></span>{props.data.precautions.map(u => (<p>{u}</p>))}</div>
                </div>
              </div>
   
    </div>
)

export default class ShowCrimes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            crimeslist : []
        };
    }
    componentDidMount() {
        axios.get('http://localhost:4000/LeoMine/allCrimes')
            .then(response => {
                this.setState({
                    crimeslist : response.data
                });
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    crimesList() {
        return this.state.crimeslist.map(function(data, i) {
            return <SList data = {data} key={i} />;
        })
    }
    render() {
        return (
        <div>
        <Header />

            
                <div className = 'container show'>
                        <center><h2>ALL CRIMES </h2></center>   
                    
                     {this.crimesList()}
                   
                </div>
                   
                </div>
        )
    }
}
