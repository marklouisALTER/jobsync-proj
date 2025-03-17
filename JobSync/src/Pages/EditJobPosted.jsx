import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EmployerSidebar from '../components/employersidebar';
import { Container, Row, Col, Button, Offcanvas, Form  } from "react-bootstrap";
import { FaBars } from "react-icons/fa";
import { useSelectedJobStore } from '../store/SelectedJobStore';
import { useNavigate } from 'react-router-dom';


export default function EditJobPosted(){
    const [showSidebar, setShowSidebar] = useState(false);
    const [selectedBenefits, setSelectedBenefits] = useState([]);
    const navigate = useNavigate();
    const { selectedJob } = useSelectedJobStore();

    const [jobBenefits, setJobBenefits] = useState([
        'Health Insurance', 'Paid Time Off', '401(k)', 'Bonuses', 'Work from Home',
        'Paid Holidays', 'Gym Membership', 'Stock Options', 'Retirement Plans', 'Child Care',
        'Dental Insurance', 'Life Insurance', 'Flexible Hours', 'Commuter Benefits', 'Tuition Reimbursement',
        'Relocation Assistance', 'Employee Assistance Program', 'Pet Insurance', 'Mental Health Days', 'Disability Insurance'
    ]);
    
    const handleBenefitSelect = (benefit) => {
        setSelectedBenefits((prev) => {
            const newSelection = prev.includes(benefit)
                ? prev.filter((item) => item !== benefit)  
                : [...prev, benefit];  
    
            setFormData((prevFormData) => ({
                ...prevFormData,
                selectedBenefits: newSelection, 
            }));
    
            return newSelection;
        });
    };

    useEffect(() => {
        if(!selectedJob.jobTitle){
            navigate('/employer/myjobs');
        }
    })
    const handleAddBenefit = () => {
        if (newBenefit.trim() && !jobBenefits.includes(newBenefit)) {
            setJobBenefits([...jobBenefits, newBenefit]);
        }
        setNewBenefit("");  // Clear input after adding
        setShowInput(false); // Hide input field
    };

    const selectedBenefitsArray = Array.isArray(selectedJob?.selectedBenefits) 
    ? selectedJob.selectedBenefits 
    : (selectedJob?.selectedBenefits || "").split(",");

  return (
    <Container className="d-flex flex-column flex-md-row" style={{ marginTop: "3rem" }}>
    <Row className="mb-4">
            <Col lg={3} className="applicant-sidebar bg-light vh-100 p-3 d-none d-lg-block">
                <EmployerSidebar />
            </Col>
            {/* Sidebar Toggle Button (Small Screens) */}
            <Col xs={12} className="d-lg-none" style={{display: 'flex'}}>
                <Button
                    variant="link"
                    // onClick={() => setShowSidebar(true)}
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
            <div className="content" style={{ flex: 1, marginTop: "60px", textAlign: "left" }}>
            <h2
                style={{
                fontSize: "24px",
                color: "#626262",
                fontWeight: "600",
                marginTop: "25px",
                marginLeft: "20px",
                }}
            >
                Post Jobs
            </h2>
    
        <Form style={{ marginLeft: "10px", textAlign: "left" }}>
    <Form.Group controlId="jobTitle" style={{ padding: "0 15px" }} className='no-paddings'>
      <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
        Job Title
      </Form.Label>
      <Form.Control
        type="text"
        name="jobTitle"
        value={selectedJob.jobTitle || ""}
        // onChange={handleChange}
        className="register1"
        style={{ width: "100%" }}
        placeholder="Add job title"
        required
      />
    </Form.Group>

    <Row style={{ padding: "20px" }} className='no-paddings'>
      <Col md={6}>
        <Form.Group controlId="jobTags">
          <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
            Job Tags
          </Form.Label>
          <Form.Control
            type="text"
            name="jobTags"
            value={selectedJob.jobTags || ""}
            // onChange={handleChange}
            className="register1"
            placeholder="Job keywords, tags"
            required
          />
        </Form.Group>
      </Col>

      <Col md={6}>
        <Form.Group controlId="jobRole">
          <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
            Job Role
          </Form.Label>
          <Form.Control
            type="text"
            name="jobRole"
            value={selectedJob.jobRole || ""}
            // onChange={handleChange}
            className="register1"
            placeholder="Add job role"
            required
          />
        </Form.Group>
      </Col>
    </Row>

    <Form.Group style={{ padding: "20px" }} className='no-paddings'>
      <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "19px" }}>Salary</Form.Label>
      <Row style={{ marginTop: "10px" }}>
        <Col md={4}>
          <Form.Group controlId="minSalary">
            <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
              Min Salary
            </Form.Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Control
                type="text"
                className="register1"
                style={{
                  backgroundColor: "#eee",
                  width: "50px",
                  marginRight: "-1px",
                  borderRadius: "10px 0px 0px 10px",
                  textAlign: "center",
                  fontWeight: "500",
                }}
                value="₱"
                disabled
              />
              <Form.Control
                type="text"
                name="minSalary"
                value={selectedJob.minSalary || ""}
                // onChange={handleChange}
                // onKeyDown={handleKeyDown}
                className="register1"
                style={{ flex: "1", borderRadius: "0px 10px 10px 0px" }}
                placeholder="Minimum salary..."
                required
              />
            </div>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="maxSalary">
            <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
              Max Salary
            </Form.Label>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Control
                type="text"
                className="register1"
                style={{
                  backgroundColor: "#eee",
                  width: "50px",
                  marginRight: "-1px",
                  borderRadius: "10px 0px 0px 10px",
                  textAlign: "center",
                  fontWeight: "500",
                }}
                value="₱"
                disabled
              />
              <Form.Control
                type="text"
                name="maxSalary"
                value={selectedJob.maxSalary || ""}
                // onChange={handleChange}
                // onKeyDown={handleKeyDown}
                className="register1"
                style={{ flex: "1", borderRadius: "0px 10px 10px 0px" }}
                placeholder="Maximum salary..."
                required
              />
            </div>
          </Form.Group>
        </Col>

        <Col md={4}>
          <Form.Group controlId="salaryType">
            <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
              Salary Type
            </Form.Label>
            <Form.Control
              as="select"
              name="salaryType"
              value={selectedJob.salaryType || ""}
            //   onChange={handleChange}
              className="register1"
              required
            >
              <option value="" disabled>
                Select type
              </option>
              <option value="Hourly">Hourly</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
            </Form.Control>
          </Form.Group>
        </Col>
      </Row>
    </Form.Group>
      
      <Form.Group style={{ padding: "20px" }} className='no-paddings'>
        <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "19px" }}>
        Advanced Information
        </Form.Label>

      <Row className="mt-3">
            {/* Education */}
            <Col md={4}>
                <Form.Group controlId="education">
                <Form.Label style={{ fontWeight: "500", fontSize: "14px", color: "#454545" }}>
                    Education
                </Form.Label>
                <Form.Select
                    name="education"
                    value={selectedJob.education || ""}
                    // onChange={handleChange}
                    className="register1"
                    required
                >
                    <option value="" disabled>Select education level</option>
                    <option value="High School">High School</option>
                    <option value="Associate Degree">Associate Degree</option>
                    <option value="Bachelor's Degree">Bachelor's Degree</option>
                    <option value="Master's Degree">Master's Degree</option>
                    <option value="Doctorate">Doctorate</option>
                </Form.Select>
                </Form.Group>
            </Col>

            {/* Experience */}
            <Col md={4}>
                <Form.Group controlId="experience">
                <Form.Label style={{ fontWeight: "500", fontSize: "14px", color: "#454545" }}>
                    Experience
                </Form.Label>
                <Form.Select
                    name="experience"
                    value={selectedJob.experience || ""}
                    // onChange={handleChange}
                    required
                    className="register1"
                >
                    <option value="" disabled>Select experience level</option>
                    <option value="1 year - 2 years">1 year - 2 years</option>
                    <option value="3 years - 4 years">3 years - 4 years</option>
                    <option value="5 years - 6 years">5 years - 6 years</option>
                    <option value="7 years and Above">7 years and Above</option>
                </Form.Select>
                </Form.Group>
            </Col>

            {/* Job Type */}
            <Col md={4}>
                <Form.Group controlId="jobType">
                <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
                    Job Type
                </Form.Label>
                <Form.Select
                    name="jobType"
                    value={selectedJob.jobType || ""}
                    // onChange={handleChange}
                    required
                    className="register1"
                >
                    <option value="" disabled>Select job type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Contract">Contract</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                </Form.Select>
                </Form.Group>
            </Col>
            </Row>

            {/* Expiration Date & Job Level */}
            <Row className="mt-3">
            {/* Expiration Date */}
            <Col md={6}>
                <Form.Group controlId="expirationDate" style={{ display: 'inline-grid' }}> 
                <Form.Label style={{ fontWeight: "500", fontSize: "14px", color: "#454545" }}>
                    Expiration Date
                </Form.Label>
                <DatePicker
                    id="expirationDate"
                    name="expirationDate"
                    selected={selectedJob.expirationDate}
                    // onChange={(date) => handleChange({ target: { name: "expirationDate", value: date } })}
                    className="form-control register1"
                    required
                    dateFormat="MM-dd-yyyy"
                    placeholderText="Select a date"
                    
                />
                </Form.Group>
            </Col>

            {/* Job Level */}
            <Col md={6}>
                <Form.Group controlId="jobLevel">
                <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
                    Job Level
                </Form.Label>
                <Form.Select
                    name="jobLevel"
                    value={selectedJob.jobLevel || ""}
                    // onChange={handleChange}
                    required
                    className="register1"
                >
                    <option value="" disabled>Select job level</option>
                    <option value="Entry Level">Entry Level</option>
                    <option value="Mid Level">Mid Level</option>
                    <option value="Senior Level">Senior Level</option>
                    <option value="Manager Level">Manager Level</option>
                    <option value="Director Level">Director Level</option>
                    <option value="Executive Level">Executive Level</option>
                </Form.Select>
                </Form.Group>
            </Col>
            </Row>
        </Form.Group>

        {/* Location Section */}
        <Form.Group style={{ padding: "20px", backgroundColor: "#f4f4f4", borderRadius: "8px" }} className='mt-3'>
            <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "19px" }}>
                Job Location
            </Form.Label>

            <Row className="mt-3">
                {/* Address */}
                <Col md={6}>
                    <Form.Group controlId="address">
                    <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
                        Address
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="address"
                        value={selectedJob.address || ""}
                        // onChange={handleChange}
                        placeholder="Enter address"
                        className="register1"
                        required
                    />
                    </Form.Group>
                </Col>

                {/* City */}
                <Col md={6}>
                    <Form.Group controlId="city">
                    <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "14px" }}>
                        City
                    </Form.Label>
                    <Form.Control
                        type="text"
                        name="city"
                        value={selectedJob.city || ""}
                        // onChange={handleChange}
                        placeholder="Enter city"
                        className="register1"
                        required
                    />
                    </Form.Group>
                </Col>
                </Row>
            </Form.Group>

            <Form.Group style={{ padding: "20px" }} className='no-paddings'>
                <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "19px" }}>
                Job Benefits
                </Form.Label>

                <Row className="mt-2">


                    <Col>
                    <div className="d-flex flex-wrap gap-2">
                        {jobBenefits.map((benefit, index) => (
                        <Button
                            key={index}
                            variant={selectedBenefitsArray.includes(benefit) ? "primary" : "outline-secondary"}
                            onClick={() => handleBenefitSelect(benefit)}
                            className="mb-2"
                        >
                            {benefit}
                        </Button>
                        ))}
                    </div>
                    </Col>

                </Row>

                {/* Input Field for Custom Benefits */}
                {/* {showInput ? (
                <Row className="mt-3">
                    <Col md={6} className="d-flex">
                    <Form.Control
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="Enter a new benefit..."
                        autoFocus
                        onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddBenefit();
                        if (e.key === "Escape") setShowInput(false);
                        }}
                    />
                    <Button onClick={handleAddBenefit} variant="success" className="ms-2">+</Button>
                    </Col>
                </Row>
                ) : (
                <Button onClick={() => setShowInput(true)} variant="primary" className="mt-3">+</Button>
                )} */}
            </Form.Group>
            <Form.Group style={{ padding: "0px 20px" }} className='no-paddings'>
                <Row className="align-items-center mb-2">
                {/* Job Description Label */}
                <Col xs={12} md={8}>
                    <Form.Label style={{ fontWeight: "500", color: "#454545", fontSize: "19px" }}>
                    Job Description
                    </Form.Label>
                </Col>

                {/* AI Generate Button */}
                <Col xs={12} md="auto">
                    <Button 
                    variant="primary" 
                    // onClick={handleGenerateJobDescription} 
                    // disabled={loading} 
                    className="d-flex align-items-center"
                    >
                    {/* {loading ? (
                        <>
                        Generating...
                        <div className="spinner" style={{ border: "2px solid #fff", borderTop: "2px solid transparent", borderRadius: "50%", width: "16px", height: "16px", animation: "spin 1s linear infinite", marginTop: '5px', marginLeft: '10px' }}></div>
                        </>
                    ) : (
                        "Write Job Description with AI"
                    )} */}
                    </Button>
                </Col>
                </Row>

                {/* Job Description Editor */}
                <ReactQuill
                    value={selectedJob.jobDescription || ""}
                    // onChange={(value) => handleChange({ target: { name: "jobDescription", value } })}
                    theme="snow"
                    placeholder="Describe the job"
                    className="form-control"
                    style={{ width: "100%", minHeight: "150px", marginTop: "10px" }}
                    // modules={modules}
                    formats={[
                        "header", "font", "size", "bold", "italic", "underline", "strike",
                        "color", "background", "align", "list", "indent", "link", "image", "video"
                    ]}
                    />
            </Form.Group>

            {/* Next Button */}
            <div className="d-flex justify-content-end mt-4">
            <Button 
                variant="primary" 
                size="lg" 
                style={{ width: "150px" }} 
                // onClick={handleNext}
              
            >
                Next
            </Button>
            </div>
            </Form>
</div>
</Col>
</Row>

<style>{`
  @media (max-width: 576px) {
    .no-paddings {
        padding: 0px !important;
    }
  }
`}</style>
</Container>
  )
}
