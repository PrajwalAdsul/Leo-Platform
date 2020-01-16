import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const SList = props => (
    <tr>
        <td>{props.data.name}</td>
        <td>{props.data.description}</td>
        <td>{props.data.precautions.map(u => (<p>{u}</p>))}</td>
    </tr>
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
                <div className = 'container'>
                    <Link to="/AddCrime">add a crime</Link>
                    <br/><br/>
                    <Link to="/AddArea">add a area</Link>
                    <br/><br/>
                    <Link to="/ShowAreas">show all areas</Link>
                    <br/><br/>
                    <Link to="/WebScrap">web scrap</Link>
           
                   
                    <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                    </nav>
                    <div>
                        <h3>List</h3>
                        <table className = 'table table-striped' style={{marginTop: 20}}>
                            <thead>
                                <tr>
                                    <th> Name </th>
                                    <th> Description </th>
                                    <th> precautions </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.crimesList()}
                            </tbody>
                        </table>
                    </div>
                    
                </div>
        )
    }
}
