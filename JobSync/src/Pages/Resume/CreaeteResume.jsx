import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from '../../assets/logo3.png';
import { useAuth } from "../../AuthContext";
import { postToEndpoint } from "../../components/apiService";

const ResumeAIForm = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await postToEndpoint("/generate-resume.php", { 
        name: user.firstname, 
        jobTitle 
      });

      const data = response.data;  
      if (data.success) {
        navigate("/resume-builder", { 
          state: { 
            name: user.firstname, 
            jobTitle: jobTitle, 
            skills: data.skills, 
            profileSummary: data.profileSummary, 
            workExperience: data.workExperience 
          } 
        });
      } else {
        alert("Failed to generate resume");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(255, 255, 255, 1)", zIndex: 99999999 }}>
      <header className="p-3 logo_only">
        <div className="container">
          <Link to="/" style={{ color: '#212529', textAlign: 'left' }}>
            <div className="logo d-flex align-items-center mb-2 mb-md-0">
              <img src={logo} alt="JobSync Logo" width="88" height="76" />
              <span className="ms-2 fw-bold fs-2">JobSync</span>
            </div>
          </Link>
        </div>
      </header>
      <Container className="d-flex justify-content-center">
        <Card className="p-4 shadow-lg text-center" style={{ maxWidth: "600px", borderRadius: "12px", width: '100%' }}>
          <Card.Body>
            <h3 className="fw-bold">Create your resume with AI.</h3>
            <p className="text-muted">
              Give us your name and your most recent job title, and the AI will generate a
              tailored resume for you in seconds.
            </p>
            <Form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <Row className="mb-3">
                <Col xs={12} md={6}>
                  <Form.Group controlId="name">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control className="register2" type="text" placeholder="Enter your name" value={user.firstname} onChange={(e) => setName(e.target.value)} required />
                  </Form.Group>
                </Col>
                <Col xs={12} md={6}>
                  <Form.Group controlId="jobTitle">
                    <Form.Label>Job title</Form.Label>
                    <Form.Control className="register2" type="text" placeholder="Enter your job title" value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} required />
                  </Form.Group>
                </Col>
              </Row>
              <div style={{ display: 'flex', justifyContent: 'end' }}>
                <Button 
                  type="submit" 
                  variant="primary" 
                  style={{ width: '30%', height: '40px' }} 
                  disabled={loading} // Disable button when loading
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" /> Generating...
                    </>
                  ) : (
                    "Continue ✨"
                  )}
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <style>{`
      .logo_only{
        top: 0;
        background-color: transparent;
      }

      /* Custom responsive styles */
      @media (max-width: 768px) {
        .logo {
          display: block;
          text-align: center;
          margin-bottom: 20px;
        }

        .logo img {
          width: 70px;
          height: 60px;
        }

        .logo span {
          font-size: 1.5rem;
        }

        .card {
          padding: 20px;
        }

        .form-label {
          font-size: 14px;
        }

        .form-control {
          font-size: 14px;
        }

        .btn {
          width: 50%;
        }
      }

      @media (max-width: 576px) {
        .btn {
          width: 100% !important;
        }
        .logo img {
          width: 60px;
          height: 50px;
        }

        .logo span {
          font-size: 1.3rem;
        }

        .card {
          padding: 15px;
        }

        .form-label {
          font-size: 13px;
        }

        .form-control {
          font-size: 13px;
        }

        .btn {
          width: 70%;
        }
      }
      `}</style>
    </div>
  );
};

export default ResumeAIForm;
