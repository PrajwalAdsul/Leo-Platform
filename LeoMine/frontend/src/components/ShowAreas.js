import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch, Link} from "react-router-dom";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";

const SList = props => (
    <tr>
        <td>{props.data.name}</td>
        <td>{props.data.crimes.map(u => (<p>{u}</p>))}</td>
    </tr>
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
                <div className = 'container'>
              

                    <Link to="/AddCrime">add a crime</Link>
                    <br/><br/>
                    <Link to="/ShowCrimes">show all crimes</Link>
                    <br/><br/>
                    <Link to="/AddArea">Add an area</Link>
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
                                    <th> crimes </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.areasList()}
                            </tbody>
                        </table>
                    </div>
              
                    
                </div>
        )
    }
}
