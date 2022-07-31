//import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
import { useEffect, useState, useMemo } from 'react';
import PrepareChart from './Chart';
import Carousel from 'react-bootstrap/Carousel';
import { AiOutlineSetting } from 'react-icons/ai';
import Button from 'react-bootstrap/Button';
import formatDate from './utils'

const UsageDetails = () => {
    const [isListView, setIsListView] = useState(false)
    const [ipList , setIpList] = useState([])
    const [show,setShow] = useState(false)
    const [selectedIp, setSelectedIp] = useState([])
    const [filterData, setFilterData] = useState({ip: null})

    const [fromDate, setFromDate] = useState()
    const [toDate, setToDate] = useState()

    useEffect(() => {
        console.log("filterData : ", toDate, fromDate)
    }, [toDate,fromDate])

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
    useEffect(() => {
        console.log("todate: ", toDate)
        console.log("from date: ", fromDate)
    },[fromDate, toDate])
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
        console.log("selectedIp: ", selectedIp)
    },[selectedIp])

    const handleSubmit = () => {
        const d = [formatDate(fromDate),formatDate(toDate),selectedIp]
        setFilterData({ip:selectedIp})
        setShow(false)
        // fetch('http://localhost:8000/api/usage/cpu',{
        //     method:"POST",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //       },
        //     body: JSON.stringify({"ipList": selectedIp, "fromDate": fromDate, "toDate": toDate})
        // })
        // .then(resp => {return resp.json()})
        // .then(data => {
        //     if(data.message){
        //         setIpList(data.message)
        //         console.log("running..",data.message)
        //     }
        // })
        // console.log("data is: ", fromDate, toDate, selectedIp)
    }
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
                        {
                            chartList.map(i => {
                                return (
                                    <Carousel.Item>
                                        <PrepareChart reportName={i} filter={filterData}/>
                                    </Carousel.Item>
                                )
                            })
                        }
                        </Carousel>
                    ):(
                        <div>
                            {
                                chartList.map(i => {
                                    return(
                                        <div>
                                            <PrepareChart reportName={i} filter={filterData}/>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    )
                }
            </div>
        
        </div>
    )
}
// function format(inputDate) {
//     var date = new Date(inputDate);
//     if (!isNaN(date.getTime())) {
//         // Months use 0 index.
//         return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
//     }
// }
export default UsageDetails;