//import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { useEffect, useState } from 'react';
import CpuChart from './CpuChart';
import MemoryDetails from './MemoryChart'
import Carousel from 'react-bootstrap/Carousel';
import DiskDetails from './DiskChart'
const UsageDetails = () => {
    const [isListView, setIsListView] = useState(false)
    const handleView = () => {
        const value = !isListView
        setIsListView(value)
    }
    //console.log(isListView)
    return(
        <div style={{marginTop:8, padding:20}}>
            <div style={{marginBottom:20}}>
                <span style={{float:"left", color:'green', fontSize:20, margin:"8px"}}>Server Details</span>
                <Form.Check 
                    type="switch"
                    id="custom-switch"
                    label="List View"
                    style={{float:'right', marginTop:"8px"}}
                    onChange = {e => {handleView()}}
                /> 
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