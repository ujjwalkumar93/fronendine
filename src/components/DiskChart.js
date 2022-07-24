//import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import Chart from 'react-google-charts'

  const LineChartOptions = {
    hAxis: {
      title: 'Time',
    },
    vAxis: {
      title: 'Disk Usage',
    },
    series: {
      1: { curveType: 'function' },
    },
  }

const DiskDetails = () => {
    const [server, setServer] = useState(null)
    const [cpu, setCpu] = useState({})
    const [date, setDate] = useState(null)

    useEffect(() => {
        fetch('http://localhost:8000/api/server/list',{method:"GET"})
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                //setServer(data.message)
                const distinctIp = ['x']
                data.message.map(ip => {
                    distinctIp.push(ip.serverName)
                })
                fetchUsageDetails(data.message,distinctIp)
            }
        })
    },[])
    const fetchUsageDetails = (data,ipList) => {
        const finalData = []
        data.map(d => {
            const url = `http://localhost:8000/api/server/${d.ip}`
            fetch(url,{method:"GET"})
            .then(resp => {return resp.json()})
            .then(data => {
                if(data.message){
                    const prepared_cpu_data = [ipList]
                    //const timeData = []
                    data.message.map(d => {
                        prepared_cpu_data.push([new Date(d.addedOn), d.cpu, d.cpu+50])
                        //timeData.push(d.addedOn)
                    })
                    finalData.push(prepared_cpu_data)
                    //console.log("prepared_cpu_data is: ",prepared_cpu_data)
                    setCpu(prepared_cpu_data)
                }
            })
        })

    }

    // useEffect(() => {
    //     if(cpu.length > 0){
    //         const cpuData = []
    //         cpu.map((val, index) => {
    //             console.log("cpu: ",val, index)
    //         })
    //     }
    // },[cpu])
    return(
        <div style={{marginTop:8, padding:20}}>  
            <Chart
                width={window.screen.width*.6}
                height={'500px'}
                chartType="LineChart"
                loader={<div>Loading Chart</div>}
                data={cpu}
                options={LineChartOptions}
                rootProps={{ 'data-testid': '2' }}
        />
        </div>
    )
}
export default DiskDetails;