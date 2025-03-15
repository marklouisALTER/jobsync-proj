import React, {useState, useEffect } from 'react';
import SavedApplicantTable from '../../../components/SavedApplicantTable';
import EmployerSidebar from '../../../components/employersidebar';
import { Container, Row, Col, Button, Offcanvas } from 'react-bootstrap';
import { FaBars } from "react-icons/fa";

export default function SavedApplicant() {
    const [showSidebar, setShowSidebar] = useState(false);


    return (
        <Container style={{marginTop: '3rem'}}>
            <Row className="d-flex">
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
                    <h2 style={{ fontSize: '19px', color: '#333', fontWeight: '500', marginBottom: '20px', marginTop: '25px', textAlign: 'left', marginLeft: '15px' }}>
                        Saved Applicants (10)
                    </h2>
                    <SavedApplicantTable />
                </Row>
            </Col>
        </Row>
    </Container>
    );
}