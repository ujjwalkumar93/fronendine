import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { MdModeEditOutline, MdDelete } from 'react-icons/md';
import { useEffect, useState } from 'react';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
//import Form from './Form'
const moment = require('moment');


const ServerDetails = () => {
    const [server, setServer] = useState(null)
    const [showAlert, setShowAlert] = useState({show:false});
    const [show, setShow] = useState(false);

    const [showForm, setShowForm] = useState(false);
    const [serverName, setServerName] = useState(null)
    const [ip, setIp] = useState(null)
    const [serverStatus, setServerStatus] = useState(true)

    useEffect(() => {
        console.log("setServerStatus: ",serverStatus)
    },[])
    const handleClose = () => setShowForm(false);
    const handleShow = () => setShowForm(true);

    const handleSave = (ipValue, serverNameValue) => {
        const url = `http://localhost:8000/api/server/update/${ipValue}`
        let status = true
        if(serverStatus === 'false') {
            status = false
        } 
        if(showForm.action === "update") {
            fetch(url,{
                method:"PUT",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({"serverName": serverNameValue, "serverStatus": status})
            })
            .then(resp => {return resp.json()})
            .then(data => {
                if(data.message){
                    console.log(data.message)
                }
            })
        }
        if(showForm.action === "create") {
            fetch("http://localhost:8000/api/server/add",{
                method:"POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                body: JSON.stringify({"serverName": serverName, "serverStatus": serverStatus, "ip" : ip})
            })
            .then(resp => {return resp.json()})
            .then(data => {
                if(data.message){
                    console.log(data.message)
                }
            })
        }
        
        handleClose()
        fetch('http://localhost:8000/api/server/list',{method:"GET"})
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                setServer(data.message)
            }
        })

    }


    useEffect(() => {
        fetch('http://localhost:8000/api/server/list',{method:"GET"})
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                setServer(data.message)
            }
        })
    },[server])
    const DeleteOperation = (ip) => {
        setShowAlert({"show":false})
        const url = `http://localhost:8000/api/server/delete/${ip}`
        fetch(url,{method:"DELETE"})
        .then(resp => {return resp.json()})
        .then(data => {
            if(data.message){
                const updateServerDetails = server.filter(d => d.ip != ip);
                setServer(updateServerDetails)
                setShow(true)
                // show delete notification for 3 sec
                setTimeout(
                    function() {
                        setShow(false)
                    },
                    1000*3
                )
            }
        })

    }

    return(
        <div>
            <Modal show={showForm} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add/Edit server</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="serverName">
                            <Form.Label>Server Name</Form.Label>
                            <Form.Control
                                autoFocus
                                defaultValue={showForm.serverName}
                                onChange={e => {setServerName(e.target.value)}}
                                //onLoad={e => {setServerName(e.target.value)}}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="ip" readOnly>
                            <Form.Label>IP Address</Form.Label>
                            <Form.Control
                                defaultValue={showForm.ip }
                                disabled={showForm.ip ? true : false}
                                onChange={e => {setIp(e.target.value)}}
                                //onLoad = {e => {setIp(e.target.value)}}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="status">
                            <Form.Label>Status</Form.Label>
                            <Form.Select 
                                defaultValue={showForm.status}
                                //onChange={e => {console.log("selected........")}}
                                onChange={e => {setServerStatus(e.target.value)}}
                            >
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={e => {handleSave(showForm.ip, !serverName ? showForm.serverName : serverName )}}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
            <Alert show={show} key="primary" variant="primary">
                Data Deleted
            </Alert>
            <Alert show={showAlert.show} variant="danger">
                <Alert.Heading>Are you sure to delete the server {showAlert.ip}</Alert.Heading>
                <p>If not then press the cancel button</p>
                <hr />
                <div className="d-flex justify-content-end">
                <Button onClick={() => setShowAlert({"show":false})} variant="outline-primary">
                    Cancel
                </Button>
                <Button onClick={() => DeleteOperation(showAlert.ip)} variant="outline-danger" style={{marginLeft:"12px"}}>
                    Delete
                </Button>
                </div>
            </Alert>
            <div style={{marginBottom:'4'}}>
                <span style={{float:"left", color:'green', fontSize:20, margin:"8px"}}>Server Details</span>
                <Button
                    variant="success"
                    style={{float:"right", marginBottom:8}}
                    onClick = {e => {setShowForm({"show": true, "action":"create"})}}
                >Add Server</Button>{' '}
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
                                <td>
                                    <MdModeEditOutline 
                                        onClick={() => setShowForm({"show":true, "serverName":data.serverName, "ip":data.ip, "status": data.serverStatus,"action" : "update"})}
                                    />
                                    <span style={{float:"right"}}>
                                        <MdDelete
                                         onClick={() => setShowAlert({"ip": data.ip,"show": true})}
                                        />
                                    </span>
                                </td>
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