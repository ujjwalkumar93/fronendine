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
    const [startDate, setStartDate] = useState(new Date());

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
    //console.log(isListView)
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
                <Dropdown style={{float:'right', marginTop:"8px", marginRight:"20px"}}>
                <Dropdown.Toggle variant="light" id="filter">
                    <AiOutlineSetting/>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        ipList.map(i => {
                            return(
                                <Form.Check
                                    id={i.ip}
                                    label ={i.serverName}
                                    style={{marginLeft:18}}
                                />
                            )
                        })
                    }
                    

                <div style={{display:"flex"}}>
                <input
                    type="date"
                    id="from"
                    name="from"
                    onChange={e => {console.log("#######")}}
                    style={{width:"70%",marginLeft:"18px"}}
                />
                <input
                    type="date"
                    label="From date"
                    id="to"
                    name="to"
                    onChange={e => {console.log("*******")}}
                    style={{width:"70%", marginRight:"12px", marginLeft:"4px"}}
                />
                </div>
                <input 
                    type= "submit"
                    value="Apply Filter"
                    style={{margin:18, backgroundColor:"#198754", color:"white", borderRadius:5}}
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