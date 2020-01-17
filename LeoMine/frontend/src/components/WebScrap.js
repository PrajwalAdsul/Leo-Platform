import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import Header from './Header';

const SList = props => (
    <div>
   <div className="media">
        <img className="align-self-start mr-3" src="..." alt="placeholder image" />
          <div className="media-body">
            <h3 className="mt-0">{props.data.name}</h3>
            <p><b><i>{props.data.description}</i></b></p>
            <div><span className="change-color"><b>Precautions: </b><br /></span>{props.data.precautions.map(u => (<p>{u}</p>))}</div>
          </div>
   
    </div>
    </div>
)

export default class WebScrap extends Component {
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
                        <center><h2>WEBSCRAPING RESULTS</h2></center>
                        <h3> Sources used </h3>
                            <h5>News1</h5>
                            <h5>New2</h5><h5>Twitter api</h5><h5>Facebook api</h5>

                            <div> {this.crimesList()}</div>

                       
                    </div>
                    
                </div>
        )
    }
}
