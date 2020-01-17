import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import SimpleMap from './SimpleMap';

const SList = props => (
    <tr>
        <td>{props.data.user_name}</td>
        <td>{props.data.latitude}</td>
        <td>{props.data.longitude}</td>
        <td>{props.data.area}</td>
        <td><SimpleMap latitude = {props.data.latitude} longitude = {props.data.longitude}/></td>
    </tr>
)

export default class ShowTroubles extends Component {
    constructor(props) {
        super(props);
        this.state = {
            troubleslist : []
        };
    }
    componentDidMount() {
        axios.get('http://localhost:4001/LeoHelp/allUsers')
            .then(response => {
                this.setState({
                    troubleslist : response.data
                });
            })
            .catch(function(error) {
                console.log(error);
            })
    }

    troublesListf() {
       // filter(book => book.shelf === shelf)
        return this.state.troubleslist.filter(troubleslist => troubleslist.inTrouble === true).map(
            function(data, i) {
                return <SList data = {data} key={i} />;
            }
        )
    }

/*
    crimesList() {
        return this.state.crimeslist.map(
            function(data, i) {
                return <SList data = {data} key={i} />;
            }
        )
    }*/
    render() {
        if(localStorage.getItem('DRO_start') !== "start"){
            return <Redirect push to = "/DROSignIn" />;
        }
        return (
            <div>
               <div className = 'container list'>  
                        <h2>USERS IN <span className="change-color">TROUBLE</span></h2>
                        <table className = 'table table-striped' style={{marginTop: 20}}>
                            <thead>
                                <tr>
                                    <th><h4><b>USERNAME</b></h4></th>
                                    <th><h4><b>LATITUDE</b></h4></th>
                                    <th><h4><b>LONGITUDE</b></h4></th>
                                    <th><h4><b>AREA</b></h4></th>
                                    <th><h4><b>MAP</b></h4></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.troublesListf()}
                            </tbody>
                        </table>
                </div>
            </div>
        )
    }
}
