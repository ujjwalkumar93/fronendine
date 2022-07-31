
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



const PrepareChart = (props) => {
  const [filterIp, setFilterIp] = useState([])
  if(props.filter.ip != null){
    console.log("##########################")
    setFilterIp([...props.filter.ip])
  }
  
  console.log("props: ", props)
  const reportLabel = {
    cpu : "CPU Usage",
    disk : "Disk Usage",
    memory : "Memory Usage"
  }
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: reportLabel[props.reportName],
      },
      scales: {
        xAxes: [{
          type: 'time',
          }]
      },
    },
  };
  // console.log("filter and name", props.filter, props.name)
  const [reportData, setReportData] = useState(null)
  const [ipList, setIpList] = useState([])
  useEffect(() => {
    fetch('http://localhost:8000/api/server/list',{method:"GET"})
    .then(resp => {return resp.json()})
    .then(data => {
        if(data.message){
            const activeIpList = []
            data.message.forEach(e => {
                if(e.serverStatus) {
                    activeIpList.push(e.ip)
                    setIpList([...activeIpList])
                }
            })
        }
    })
  },[])

  
  
  useEffect(() => {
    if(props.filter.ip){
      fetch(`http://localhost:8000/api/usage/${props.reportName}`,{
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"ipList" : props.filter.ip })
      })
      .then(resp => {return resp.json()})
      .then(data => {
          if(data.message){
            setReportData(data.message)
          }
      })
    } else {
      fetch(`http://localhost:8000/api/usage/${props.reportName}`,{
        method:"POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({"ipList" : ipList })
      })
      .then(resp => {return resp.json()})
      .then(data => {
          if(data.message){
            setReportData(data.message)
          }
      })
    }
    
},[ipList])

console.log("filterIp is: ", filterIp)



  return (
    <div className="App">
     {reportData === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={options} data={reportData} />)}
    </div>
  );
}

export default PrepareChart;
