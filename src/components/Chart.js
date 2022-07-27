
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
  console.log("filter and name", props.filter, props.name)
  const [reportData, setReportData] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/api/server/105.109.12.36',{method:"GET"})
    .then(resp => {return resp.json()})
    .then(data => {
        if(data.message){
            setReportData(data.message)
            console.log("msg is: ", data.message)
            
        }
    })
},[])
  const labels = reportData.map(d => {
    return moment(d.addedOn).format('DD/MM/YYYY h:mm:ss')
  })
  let filteredData;
  if(props.reportName === "cpu"){
    filteredData = labels.map((v,i) => {
      return reportData[i].cpu
    })
  }
  if(props.reportName === "disk"){
    filteredData = labels.map((v,i) => {
      return reportData[i].disk
    })
  }
  if(props.reportName === "memory"){
    filteredData = labels.map((v,i) => {
      return reportData[i].memory
    })
  }

  const data1 = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: filteredData,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth:.5,
      }]

  }
  return (
    <div className="App">
     <Line options={options} data={data1} />
    </div>
  );
}

export default PrepareChart;
