import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import PieChartCrime from './PieChartCrime.js';
import BarGraphCrime from './BarGraphCrime.js';
import DROHeader from '../DRO/DROHeader';

/*
 * Base class to showcase analysis
 */
class Analysis extends Component {
  
  render () {
  return (
    <div>
    	<DROHeader active_page = "Analysis" />
    	<BarGraphCrime/>
    	<PieChartCrime/>
    </div>
  );
  }
}

export default Analysis;
