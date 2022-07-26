import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import ServerDetails from './components/ServerDetils'
import UsageDetails from './components/UsageDetails'
function Home() {
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container fluid>
          <Navbar.Brand className='m-2'>INE</Navbar.Brand>
        </Container>
      </Navbar>
      <Container>
          <Row>
            <Col>
              <UsageDetails/>
            </Col>
          </Row>
          <Row style={{marginBottom:30}}>
            <Col>
              <ServerDetails/>
            </Col>
          </Row>
      </Container>
    </>
  );
}

export default Home;


