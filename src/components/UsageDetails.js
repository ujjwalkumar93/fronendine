//import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect, useState, useMemo } from 'react';
import CpuChart from './CpuChart';
import MemoryDetails from './MemoryChart'
import Carousel from 'react-bootstrap/Carousel';
import DiskDetails from './DiskChart'
import { AiOutlineSetting } from 'react-icons/ai';
import Button from 'react-bootstrap/Button';

const UsageDetails = () => {
    const [isListView, setIsListView] = useState(false)
    const [ipList , setIpList] = useState([])
    const [fromDate, setFromDate] = useState();
    const [toDate, setToDate] = useState();
    const [show,setShow] = useState(false)
    const [selectedIp, setSelectedIp] = useState([])
    const endDate1 = new Date();
    endDate1.setDate(endDate1.getDate() + 2);
    const [endDate, setEndDate] = useState(endDate1);
    console.log("new Date()+3 is: ", endDate1)
    useEffect(() => {
        fetch('http://localhost:8000/api/server/list',{method:"GET"})
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                setIpList(data.message)
                console.log("running",data.message)
            }
        })
    },[])
    console.log("ip list is: ",ipList)
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
    const handleSubmit = () => {
        setShow(false)
        fetch('http://localhost:8000/api/usage/cpu',{
            method:"POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
            body: JSON.stringify({"ipList": selectedIp, "fromDate": fromDate, "toDate": toDate})
        })
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                setIpList(data.message)
                console.log("running..",data.message)
            }
        })
        console.log("data is: ", fromDate, toDate, selectedIp)
    }

    const handleDate = (date, target) => {
        const d = formatDate (date)
        if(target == "to") {
            setToDate(d)
        }
        if(target == "from") {
            setFromDate(d)
        }

        //console.log("formatDate (input) is: ",)
    }
    function formatDate (input) {
        var datePart = input.match(/\d+/g),
        year = datePart[0], // get only two digits
        month = datePart[1], day = datePart[2];
      
        return day+'/'+month+'/'+year;
      }
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
                    onChange={e => {handleDate(e.target.value,"from")}}
                    style={{width:"70%",marginLeft:"18px"}}
                />
                <input
                    type="date"
                    id="to"
                    name="to"
                    onChange={e => {handleDate(e.target.value,"to")}}
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
                </Dropdown>
                
            </div>
            <div>
                {
                    !isListView ? (
                        <div>
                            <Carousel variant="dark">
                            <Carousel.Item>
                            <CpuChart/>
                                
                            </Carousel.Item>
                            <Carousel.Item>
                            <MemoryDetails/>
                            </Carousel.Item>
                            <Carousel.Item>
                            <DiskDetails/>
                            </Carousel.Item>
                        </Carousel>
                            
                        </div>
                    ):(
                        <div>
                            <CpuChart/>
                            <MemoryDetails/>
                            <DiskDetails/>
                        </div>
                    )
                }
            </div>
        
        </div>
    )
}

export default UsageDetails;