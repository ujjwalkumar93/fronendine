
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
//import zoom from 'chartjs-plugin-zoom'
import { useEffect, useState, useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import faker from 'faker';
const moment = require('moment');

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'CPU Usage',
    },
    scales: {
      xAxes: [{
        type: 'time',
        }]
    },
    // zoom: {
    //   pan :{
    //     enabled : true
    //   }
    // }
  },
};

const PrepareChart = (props) => {
  // console.log("filter and name", props.filter, props.name)
  const [reportData, setReportData] = useState(null)
  useEffect(() => {
    setReportData(null)
    fetch(`http://localhost:8000/api/usage/${props.reportName}`,{
      method:"POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"ipList" : ["105.109.12.47","105.109.12.45"]})
    })
    .then(resp => {return resp.json()})
    .then(data => {
      //console.log("+++++++++++++++++++++++=")
        if(data.message){
          setReportData(data.message)
        }
    })
},[])

const labels = [1,2,3]
const data1 = {
      labels,
      datasets: [
        {
          label: 'Dataset 1',
          data: [1,2,3],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderWidth:.5,
        }]
  
    }

  return (
    <div className="App">
     {reportData === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={options} data={reportData} />)}
    </div>
  );
}

export default PrepareChart;
