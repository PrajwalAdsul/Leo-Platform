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
        return (
                <div className = 'container'>
                    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    </nav>
                    <div>
                        <h3>List</h3>
                        <table className = 'table table-striped' style={{marginTop: 20}}>
                            <thead>
                                <tr>
                                    <th> username</th>
                                    <th> latitude </th>
                                    <th> longitude </th>
                                    <th> area </th>
                                    <th> Map </th>
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
