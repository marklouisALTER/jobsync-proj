import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import JobAdSection from "../../components/jobsection";
import "bootstrap/dist/css/bootstrap.min.css";

function Home() {
  return (
    <>
    <Container className="marginss">
      <Row className="align-items-center justify-content-between">
        {/* Main Content */}
        <Col xs={12} md={7}>
          {/* Greeting Section */}
          <Container
            fluid
            className="p-4 mb-4 border rounded greeting-section"
          >
            <h2 className="text-start greeting-title">Hi Christian</h2>
            <p className="text-start greeting-text">
              You are in the right place to find your next hire. Get started by
              creating your first job ad.
            </p>
            <div className="text-start">
              <Button variant="primary">Create a job ad</Button>
            </div>
          </Container>

          {/* Boost Hiring Section */}
          <Container
            fluid
            className="p-4 border rounded boost-section"
          >
            <Row className="align-items-center">
              {/* Text Section */}
              <Col md={8} className="text-start">
                <h5 className="fw-bold boost-title">Boost your hiring with matching candidates</h5>
                <p className="boost-text">
                  When you post a job ad, we'll match you with relevant candidates
                  from our database.
                </p>
                <Button variant="outline-dark">Post a job ad</Button>
              </Col>

              {/* Image Section */}
              <Col xs={12} md={5} className="text-center">
                <img
                  src="/assets/pic.png"
                  alt="Employer"
                  className="img-fluid w-100 employer-image"
                />
              </Col>

            </Row>
          </Container>
        </Col>

        {/* Right-side Image */}
        <Col xs={12} md={5} className="text-center">
          <img
            src="/assets/employer.jpg"
            alt="Employer"
            className="img-fluid employer-image"
          />
        </Col>
      </Row>
    </Container>
    <style>{`
    /* General Styling */
    .greeting-section, .boost-section {
      background-color: #f5f9ff;
      border-color: #e0e7ef;
    }
    
    .greeting-title, .boost-title {
      font-size: 1.8rem;
    }
    
    .greeting-text, .boost-text {
      font-size: 1.1rem;
    }
    
    /* Image Responsiveness */
    .employer-image {
      width: 100%;
      height: auto;
      margin-top: 20px;
    }
    
    .boost-image {
      max-width: 150px;
    }
    
    /* Media Queries for Smaller Screens */
    @media (max-width: 992px) {
        .marginss {
          margin-top: 6rem !important;
        }
     }

    @media (max-width: 768px) {
      .greeting-title, .boost-title {
        font-size: 1.5rem;
      }
    
      .greeting-text, .boost-text {
        font-size: 1rem;
      }
    
      .employer-image {
        max-width: 100%;
        margin-top: 0;
      margin-top: 20px;

      }
    
      .boost-image {
        max-width: 120px;
      }
    }
    
    @media (max-width: 576px) {
      .greeting-title, .boost-title {
        font-size: 1.3rem;
      }
    
      .greeting-text, .boost-text {
        font-size: 0.9rem;
      }
    
      .boost-image {
        max-width: 100px;
      }
    }
    
    `}</style>
    </>
  );
}

export default Home;
