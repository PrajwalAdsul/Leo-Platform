import React from "react";
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import PoliceHeader from './PoliceHeader';

/*
 * Class to implement fir functionality of police
 */
export default class PoliceFIR extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            date: "",
            time: "",
            location: "",
            crime_category: "",
            description: "",
            add_success: false,
            errors: {
                date: '',
                time: '',
                location: '',
                crime_category: '',
                description: ""
            },
            errorText: "",
            css_error: "errorMessage"
        }
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        });
        /* this.setState({ errors, [name]: value }); */
    }

    onSubmit = async e => {
        e.preventDefault();
        const data = {
            date: this.state.date,
            time: this.state.time,
            location: this.state.location,
            crime_category: this.state.crime_category,
            description: this.state.description
        };

        await axios.post('https://peaceful-refuge-01419.herokuapp.com/LeoHelp/fir', data)
            .then(response => {
                this.setState({
                    add_success: true
                });
            })
            .catch(error => {
                //console.log(error.response);
                this.setState({
                    errorText: error.response.data.msg
                });
            });
    }


    render() {
        return (
            <div>
                <PoliceHeader active_page="PoliceFIRs" />
                <center>
                    <div className="jumbotron shadow-lg addfir-jumbotron">

                        <h2>ADD <span className="change-color">CRIME RECORD</span> </h2>
                        <hr />

                        <form onSubmit={this.onSubmit} className="login-form">
                            <div className="form-row">
                                <div className="form-group col-md-6">
                                    <label htmlFor="date">Date:</label>
                                    <input type="date" className="form-control" value={this.state.date} name="date" id="date" placeholder="DD/MM/YYYY" onChange={this.handleChange} required />
                                </div>
                                <div className="form-group col-md-6">
                                    <label htmlFor="time">Time:</label>
                                    <input type="time" className="form-control" id="time" name="time" value={this.state.time} onChange={this.handleChange} required />
                                </div>
                            </div>

                            <div className="form-group">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label htmlFor="time">Location:</label>
                                    </div>
                                    <div className="col-md-8">
                                        <input type="text" className="form-control" id="location" name="location" value={this.state.location} onChange={this.handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="description">Description:</label>
                                </div>
                                <div className="col-md-8">
                                    <textarea className="form-control" id="description" value={this.state.description} name="description" rows="5" placeholder="Add more details" onChange={this.handleChange} required></textarea>
                                </div>
                            </div>
                        </div>

                        <div className="form-row">    
                            <div className="form-group col-md-12">
                                <div className="col-md-4">
                                    <label for="crime_category">Crime Category:</label>
                                </div>
                                <div className="col-md-8">
                                    <select id="crime_category" className="form-control select-dropdown" name="crime_category" value={this.state.crime_category} placeholder="Crime Category" onChange={this.handleChange} required>
                                        <option selected>Murder</option>
                                        <option>Rape</option>
                                        <option>Arson</option>
                                        <option>Assault</option>
                                        <option>Riot</option>
                                        <option>Holding Hostages</option>
                                        <option>Kidnapping</option>
                                        <option>Robbery</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                            <br /><br />
                            
                                
                                <div className="form-group">
                                    <center><button type="button" onClick={this.onSubmit} className="btn btn-primary btn-lg">Submit</button></center>
                                </div>
                                
                            
                        </form>

                    </div>
                </center>
            </div>
        )
    }
}
