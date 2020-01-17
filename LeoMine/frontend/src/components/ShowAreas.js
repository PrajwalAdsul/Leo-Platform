import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './Header';

const SList = props => (
    <div>
    <div className="card">
        <div className="card-body">
          <h3 className="card-title"><b>{props.data.name}</b></h3>
          <div className="card-text"><span className="change-color"><b>Crimes: </b><br /></span>{props.data.crimes.map(u => (<p>{u}</p>))}</div>
        </div>
      </div>
   
    </div>
)

export default class ShowAreas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            areaslist : []
        };
    }
    componentDidMount() {
        axios.get('http://localhost:4000/LeoMine/allAreas')
            .then(response => {
                this.setState({
                    areaslist : response.data
                });
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    areasList() {
        return this.state.areaslist.map(function(data, i) {
            return <SList data = {data} key={i} />;
        })
    }
    render() {
        return (
        <div>
        <Header />
                <div className = 'container show'>
                        <center><h2>ALL AREAS </h2></center>   
                    
                     {this.areasList()}
                   
                </div>

                
                </div>
        )
    }
}
