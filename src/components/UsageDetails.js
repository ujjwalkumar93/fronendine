//import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect, useState, useMemo } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { AiOutlineSetting } from 'react-icons/ai';
import Button from 'react-bootstrap/Button';
import formatDate from './utils'
import { Line } from 'react-chartjs-2';


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
import isLastDayOfMonth from 'date-fns/isLastDayOfMonth/index';


  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
const UsageDetails = () => {
    const [isListView, setIsListView] = useState(false)
    const [ipList , setIpList] = useState([])
    const [show,setShow] = useState(false)
    const [selectedIp, setSelectedIp] = useState([])
    const [filterData, setFilterData] = useState({ip: null})

    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()
    const [cpuReport,setCpuReport] = useState(null)
    const [diskReport,setDiskReport] = useState(null)
    const [memoryReport,setMemoryReport] = useState(null)

    

    //const [endDate, setEndDate] = useState(endDate1);
    const [resp, setResp] = useState([])
    useEffect(() => {
        fetch('http://localhost:8000/api/server/list',{method:"GET"})
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                const activeIpList = []
                data.message.forEach(e => {
                    if(e.serverStatus) {
                        activeIpList.push(e)
                        setIpList([...activeIpList])
                    }
                })

                setResp([...data.message])
            }
        })
    },[])

    const handleView = () => {
        const value = !isListView
        setIsListView(value)
    }

    const handleSelect  = (ip) => {
        if(selectedIp.includes(ip)){
            const result = selectedIp.filter(i => i != ip);
            setSelectedIp([...result])
        } else {
            let res = selectedIp
            res.push(ip)
            setSelectedIp([...res])
        }
    }

    useEffect(() => {
        ["cpu", "disk", "memory"].map(i => {
            fetch(`http://localhost:8000/api/usage/${i}`,{
            method:"POST",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"ipList" : ipList.map(i => {
                return i.ip
            }) })
            })
            .then(resp => {return resp.json()})
            .then(data => {
                if(data.message){
                    if(i === "cpu"){
                        setCpuReport(data.message)
                    }
                    if(i === "memory"){
                        setMemoryReport(data.message)
                    }
                    if(i === "disk"){
                        setDiskReport(data.message)
                    }
                    
                }
            })
        })
        
    },[ipList])

    const handleSubmit = () => {
        setFilterData({ip:selectedIp})
        setShow(false)
        const listOfIp = ["cpu", "disk", "memory"]
        let il = [];
        if(selectedIp.length > 0){
            selectedIp.forEach(i => {
                il.push(i)
            })
        } else {
            ipList.forEach(i => {
                il.push(i.ip)
            })
        }
        listOfIp.map(i => {
            fetch(`http://localhost:8000/api/usage/${i}`,{
            method:"POST",
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({"ipList" : il, "fromDate": formatDate(fromDate) !="Invalid Date" ?formatDate(fromDate) : null, "toDate": formatDate(toDate) !="Invalid Date" ?formatDate(toDate) : null })
            })
            .then(resp => {return resp.json()})
            .then(data => {
                if(data.message){
                    if(i === "cpu"){
                        setCpuReport(data.message)
                    }
                    if(i === "memory"){
                        setMemoryReport(data.message)
                    }
                    if(i === "disk"){
                        setDiskReport(data.message)
                    }
                    
                }
            })
        })
    }
   
    const reportLabel = {
        cpu : "CPU Usage",
        disk : "Disk Usage",
        memory : "Memory Usage"
      }
    let optionList = []
    const r = ["cpu", "disk", "memory"]
    r.forEach(i => {
        optionList.push(
            {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: 'top',
                  },
                  title: {
                    display: true,
                    text: reportLabel[i],
                  },
                  scales: {
                    xAxes: [{
                      type: 'time',
                      }]
                  },
                },
            }
        
        )
    })

    

    const chartList = ["cpu","memory","disk"]
    return(
        <div style={{marginTop:8, padding:20}}>
            <div style={{marginBottom:30}}>
                
                <span style={{float:"left", color:'green', fontSize:20, margin:"8px"}}>Server Details</span>
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    label="List View"
                    style={{float:'right', marginTop:"8px"}}
                    onChange = {e => {handleView()}}
                /> 
                <Dropdown style={{float:'right', marginTop:"8px", marginRight:"20px"}} show={show}>
                <Dropdown.Toggle variant="light" id="filter">
                    <AiOutlineSetting onClick={e => setShow(!show)}/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        ipList.map(i => {
                            return(
                                <Form.Check
                                    id={i.ip}
                                    label ={i.serverName}
                                    style={{marginLeft:18}}
                                    onClick ={e => {
                                        handleSelect(i.ip)
                                    }}
                                />
                            )
                        })
                    }
                    

                <div style={{display:"flex"}}>
                <input
                    type="date"
                    id="from"
                    name="from"
                    value={setFilterData.fromDate}
                    onChange={e => {setFromDate(e.target.value)}}
                    style={{width:"70%",marginLeft:"18px"}}
                />
                <input
                    type="date"
                    id="to"
                    name="to"
                    value={setFilterData.toDate}
                    onChange={e => {setToDate(e.target.value)}}
                    style={{width:"70%", marginRight:"12px", marginLeft:"4px"}}
                />
                </div>
                <input 
                    type= "submit"
                    value="Apply Filter"
                    style={{margin:18, backgroundColor:"#198754", color:"white", borderRadius:5}}
                    onClick = {e => handleSubmit()}
                />
                </Dropdown.Menu>
                </Dropdown >
                
            </div>
            <div>
                {
                    !isListView ? (
                        <Carousel style={{width:"1200px", padding:"100"}}>
                            <Carousel.Item>
                                {cpuReport === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={optionList[0]} data={cpuReport} />)}
                            </Carousel.Item>
                            <Carousel.Item> 
                                {diskReport === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={optionList[1]} data={diskReport} />)}
                            </Carousel.Item>
                            <Carousel.Item>
                                {memoryReport === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={optionList[2]} data={diskReport} />)}
                            </Carousel.Item> 

                        </Carousel>
                    ):(
                       <div>
                            <div>
                                {cpuReport === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={optionList[0]} data={cpuReport} />)}
                            </div>
                            <div>
                                {diskReport === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={optionList[1]} data={diskReport} />)}
                            </div>
                            <div>
                                {memoryReport === null ? (<Skeleton count={3}  height={100} enableAnimation={true}/>) : (<Line options={optionList[2]} data={diskReport} />)}
                            </div>
                        </div>
                    )
                }
            </div>
        
        </div>
    )
}

export default UsageDetails;