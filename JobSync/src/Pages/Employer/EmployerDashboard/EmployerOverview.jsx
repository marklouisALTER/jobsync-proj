import React, {useState, useEffect } from 'react';
import PostedJobTable from '../../../components/PostedJobTable';
import { Container, Row, Col, Card, Button, Offcanvas } from "react-bootstrap";
import { FaBriefcase, FaUser, FaEnvelope, FaArrowRight, FaBars } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { useAuth } from '../../../AuthContext'
import { postToEndpoint } from '../../../components/apiService';
import EmployerSidebar from '../../../components/employersidebar';

export default function EmployerOverview() {
    const { user } = useAuth(); 
    const [counts, setJobCounts] = useState([]);
      
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const response = await postToEndpoint('/getCountJobs.php', { employer_id: user.id });
                console.log(response.data.counts);
                if (response.data.counts) {
                    setJobCounts(response.data.counts);
                } else {
                    console.error('No jobs found or an error occurred:', response.data.error);
                }
            } catch (error) {
                console.error('Error fetching jobs:', error);
            }
        };
        const intervalId = setInterval(() => {
            fetchCounts();
        }, 15000); 
        fetchCounts();
        return () => clearInterval(intervalId);
    }, [user.id]);
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            
            <Container className='container-lg' style={{ marginTop: "3rem" }}>
                <Row className="mb-4">
                    <Col lg={3} className="applicant-sidebar bg-light vh-100 p-3 d-none d-lg-block">
                        <EmployerSidebar />
                    </Col>
                    {/* Sidebar Toggle Button (Small Screens) */}
                    <Col xs={12} className="d-lg-none" style={{display: 'flex'}}>
                        <Button
                            variant="link"
                            onClick={() => setShowSidebar(true)}
                            style={{
                                position: "relative",
                                left: "0",
                                color: "#333", // Dark color
                                fontSize: "24px", // Bigger icon
                                padding: "5px"
                            }}
                        >
                            <FaBars />
                        </Button>
                    </Col>
                    {/* Offcanvas Sidebar (Small Screens) */}
                    <Offcanvas show={showSidebar} onHide={() => setShowSidebar(false)} placement="start">
                        <Offcanvas.Header closeButton>
                            <Offcanvas.Title>Employer Dashboard</Offcanvas.Title>
                        </Offcanvas.Header>
                        <Offcanvas.Body>
                            <EmployerSidebar />
                        </Offcanvas.Body>
                    </Offcanvas>
                <Col lg={9} className="p-4">
                    <Row className="mb-4 g-3">
                    {/* Open Jobs Card */}
                        <Col xs={12} sm={6} md={4}>
                            <Card style={{ backgroundColor: "#b8e2fe" }} className="shadow-sm border-0">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title className="fs-3">{counts[0]?.job_post_count}</Card.Title>
                                        <Card.Text>Open Jobs</Card.Text>
                                    </div>
                                    <div className="p-2 bg-light rounded">
                                        <FaBriefcase size={40} style={{ color: "#0A65CC" }} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        {/* Saved Applicants Card */}
                        <Col xs={12} sm={6} md={4}>
                            <Card style={{ backgroundColor: "#ffd4bb" }} className="shadow-sm border-0">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title className="fs-3">5</Card.Title>
                                        <Card.Text >Saved Applicants</Card.Text>
                                    </div>
                                    <div className="p-2 bg-light rounded">
                                        <FaUser size={40} style={{ color: "#FF8616" }} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        
                        {/* Messages Card */}
                        <Col xs={12} sm={6} md={4}>
                            <Card style={{ backgroundColor: "#d7ffd4" }} className="shadow-sm border-0">
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <Card.Title className="fs-3">8</Card.Title>
                                        <Card.Text>Messages</Card.Text>
                                    </div>
                                    <div className="p-2 bg-light rounded">
                                        <FaEnvelope size={40} style={{ color: "#169E5D" }} />
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>


                    <Row className="d-flex justify-content-between align-items-center mb-3">
                        <Col>
                            <h5  style={{ fontSize: '15px', fontWeight: '500', color: '#333', marginBottom: '-20px', textAlign: 'left'}} className="fw-bold text-secondary">Recently Posted Jobs</h5>
                        </Col>
                        <Col className="text-end">
                            <Link to="/employer/myjobs">
                                <Button variant="link" className="text-decoration-none fw-bold text-dark">
                                    View All <FaArrowRight className="ms-2" />
                                </Button>
                            </Link>
                        </Col>
                    </Row>
                    <Col className="table-responsive">
                        <PostedJobTable />
                    </Col>
                </Col>
            </Row>
            </Container>
        <style>{`
            #root {
                width: 100%;
            }
        `}</style>
        </>
    );
}
