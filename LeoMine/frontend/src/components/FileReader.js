import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import Papa from 'papaparse'

const SList = props => (
    <tr>
        <td>{props.data.state_ut}</td>
    </tr>
)


class FileReader extends React.Component {
  constructor() {
    super();
    this.state = {
      csvfile: undefined,
      list : []
    };
    this.updateData = this.updateData.bind(this);
  }

  handleChange = event => {
    this.setState({
      csvfile: event.target.files[0]
    });
  };

  importCSV = () => {
    const { csvfile } = this.state;
    Papa.parse(csvfile, {
      complete: this.updateData,
      header: true
    });
   // console.log(this.updateData);
  };

  updateData(result) {
    var data = result.data;
    //this.state.list = data;
    this.setState({list : data});
    console.log(this.state.list)
    /*
    console.log(data[0].state_ut);
    return this.state.data[0].map(function(currentdata, i) {
            return <SList data={currentdata} key={i} />;
    })*/
  }


    startupList() {
        return this.state.data.map(function(currentStartup, i) {
            return <SList data={currentStartup} key={i} />;
        })
    }

  render() {
    console.log(this.state.csvfile);
    return (
      <div className="App">
        <h2>Import CSV File!</h2>
        <input
          className="csv-input"
          type="file"
          ref={input => {
            this.filesInput = input;
          }}
          name="file"
          placeholder={null}
          onChange={this.handleChange}
        />
        <p />
        <button onClick={this.importCSV}> Upload now!</button>
         <div>
              <table className = 'table table-striped' style={{marginTop: 20}}>
                  <thead>
                      <tr>
                          <th> Name </th>
                      </tr>
                  </thead>
                  <tbody>
                     {this.startupList()}
                  </tbody>
              </table>
          </div>

      </div>
    );
  }
}
export default FileReader;