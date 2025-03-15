import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBriefcase, FaGraduationCap, FaCogs, FaClipboardCheck, FaCertificate, FaLanguage, FaEdit, FaSuitcase } from "react-icons/fa";
import { postToEndpoint, getFromEndpoint } from "../../../components/apiService";
import { useAuth } from "../../../AuthContext";
import { Button, Card, Container, Row, Col, Modal, Form } from 'react-bootstrap';


export default function Qualifications() {
  const { user } = useAuth();
  const [qualifications, setQualifications] = useState({
    workExperience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
  });

  useEffect(() => {
    fetchQualifications();
  }, []);

  const fetchQualifications = async () => {
    try {
      const response = await getFromEndpoint(`/GetQualifications.php?applicant_id=${user.id}`);
      if (response.data.status === "success") {
        setQualifications(response.data.qualifications);
      } else {
        console.error("Error fetching data:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching qualifications:", error);
    }
  };

  const [activeForm, setActiveForm] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({
    workExperience: { jobTitle: "", yearsOfExperience: "" },
    education: { degree: "", fieldOfStudy: "" },
    skills: { skillName: "", yearsOfExperience: "" },
    certifications: { certificationName: "" },
    languages: { language: "", proficiency: "" },
  });

  const handleInputChange = (e, key) => {
    const { name, value } = e.target;
    setNewEntry((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [name]: value,
      },
    }));
  };

  const handleCancel = () => {
    setActiveForm(null);
    setEditingEntry(null);
    setNewEntry({
      workExperience: { jobTitle: "", yearsOfExperience: "" },
      education: { degree: "", fieldOfStudy: "" },
      skills: { skillName: "", yearsOfExperience: "" },
      certifications: { certificationName: "" },
      languages: { language: "", proficiency: "" },
    });
  };

  const handleAddOrUpdateEntry = async (key) => {
    if (editingEntry && editingEntry.id) {
      setQualifications((prev) => ({
        ...prev,
        [key]: prev[key].map((entry) =>
          entry.id === editingEntry.id ? { ...newEntry[key], id: editingEntry.id } : entry
        ),
      }));
    } else {
      setQualifications((prev) => ({
        ...prev,
        [key]: [...prev[key], { ...newEntry[key], id: Date.now() }],
      }));
    }

    const entryData = { 
      ...newEntry[key], 
      qualificationType: key, 
      applicant_id: user.id 
    };

    try {
      const response = await postToEndpoint("/AddQualification.php", entryData);
      if (response.data.status === "success") {
        console.log("Data saved successfully");
      } else {
        console.error("Error saving data: ", response.data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
    }

    setNewEntry({
      ...newEntry,
      [key]: Object.keys(newEntry[key]).reduce((acc, field) => ({ ...acc, [field]: "" }), {}),
    });
    setActiveForm(null);
    setEditingEntry(null);
  };

  const handleEditEntry = (key, entry) => {
    const { id, created_at, applicant_id, ...entryWithoutId } = entry;
    setNewEntry((prev) => ({
      ...prev,
      [key]: { ...entryWithoutId },
    }));
    setEditingEntry(entry);
    setActiveForm(key);
  };

  const sections = [
    { label: "Work Experience", icon: <FaBriefcase />, key: "workExperience" },
    { label: "Education", icon: <FaGraduationCap />, key: "education" },
    { label: "Skills", icon: <FaCogs />, key: "skills" },
    { label: "Languages", icon: <FaLanguage />, key: "languages" },
    { label: "Certifications", icon: <FaCertificate />, key: "certifications" },
  ];

  return (
    <Container className="con-height" style={{ maxWidth: "1200px", margin: "20px auto", height: '660px' }}>
      <h4 className="mb-3" style={{ fontSize: '28px', textAlign: 'start' }}>Qualifications</h4>
      <p className="mb-4" style={{ color: "#555", textAlign: 'start'  }}>
        Using your unique skills and experience, we refine job recommendations to connect you with the most suitable opportunities on JobSync.
      </p>

      <Row className="g-3">
        {sections.map((item, index) => (
          <Col key={index} xs={12} sm={6} lg={6}>
            <Card className="p-3" style={{ backgroundColor: "#f9f9f9", borderRadius: "5px" }}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center" style={{ fontSize: "16px", color: "#333" }}>
                  {item.icon}
                  <strong className="ms-2">{item.label}</strong>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  className="plus-btn"
                  style={{ borderRadius: "50%" }}
                  onClick={() => setActiveForm(item.key)}
                >
                  +
                </Button>
              </div>
              {qualifications[item.key] && Array.isArray(qualifications[item.key]) ? (
                qualifications[item.key].map((entry) => (
                    <div key={entry.id} className="d-flex justify-content-between align-items-center mt-3 p-2" style={{ backgroundColor: "#ffffff", borderRadius: "5px" }}>
                      <span 
                        className="truncate-text"
                        style={{ flex: 1 }}
                      >
                        {Object.entries(entry)
                          .filter(([key]) => key !== "id" && key !== "created_at" && key !== "applicant_id")
                          .map(([, value]) => value)
                          .join(" - ")}
                      </span>
                      <FaEdit
                        onClick={() => handleEditEntry(item.key, entry)}
                        style={{ cursor: "pointer", color: "#007bff" }}
                      />
                    </div>
                ))
              ) : (
                <p>No {item.label} added yet.</p>
              )}
            </Card>

            {activeForm === item.key && (
              <Modal show={true} onHide={handleCancel} style={{zIndex: '99999'}}>
                <Modal.Header closeButton>
                  <Modal.Title>Add {item.label}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    {Object.keys(newEntry[item.key]).map((field) => (
                      <Form.Group key={field} className="mb-3">
                        <Form.Control
                          type="text"
                          name={field}
                          placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                          value={newEntry[item.key][field]}
                          onChange={(e) => handleInputChange(e, item.key)}
                        />
                      </Form.Group>
                    ))}
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCancel}>Close</Button>
                  <Button
                    variant="primary"
                    onClick={() => handleAddOrUpdateEntry(item.key)}
                  >
                    {editingEntry && editingEntry.id ? "Update" : "Save"}
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </Col>
        ))}
      </Row>

      {activeForm && (
        <div
          onClick={() => setActiveForm(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            zIndex: "9999",
          }}
        ></div>
      )}
      <style>{`
      @media (max-width: 768px) { /* Apply only on mobile */
      .con-height {
        height: auto !important;
      }
      .truncate-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 70%; /* Adjust as needed */
        display: inline-block;
      }
    }
    @media (max-width: 576px) {
      .plus-btn {
        font-size: 14px !important;
        padding: 2px 8px !important;
      }
    }
    `}</style>
    </Container>
  );
}
