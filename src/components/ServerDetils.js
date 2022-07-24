import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
const moment = require('moment');

const ServerDetails = () => {
    const [server, setServer] = useState(null)
    useEffect(() => {
        fetch('http://localhost:8000/api/server/list',{method:"GET"})
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                setServer(data.message)
            }
        })
    },[])
    return(
        <div>
            <div style={{marginBottom:'4'}}>
                <span style={{float:"left", color:'green', fontSize:20}}>Server Details</span>
                <Button variant="success" style={{float:"right", marginBottom:8}}>Add Server</Button>{' '}
            </div>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Server Name</th>
                  <th>IP Address</th>
                  <th>Added On</th>
                  <th>Status</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                    server ? (server.map(data => {
                        const formatted = moment(data.addedOn).format('DD/MM/YYYY h:mm:ss');
                        return(
                            <tr>
                                <td>{data.serverName}</td>
                                <td>{data.ip}</td>
                                <td>{formatted}</td>
                                <td>{data.serverStatus ? "Active": "Inactive"}</td>
                                <td><MdModeEditOutline/><span style={{float:"right"}}><MdDelete/></span></td>
                                </tr>
                        )
                    })) : null
                }
                </tbody>
              </Table>
        </div>
    )
}

export default ServerDetails;