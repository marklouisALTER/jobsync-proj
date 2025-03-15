import React, { useState, useRef, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Modal, Button, ListGroup, Container } from 'react-bootstrap';
import { FaBookmark, FaArrowRight, FaEllipsisV, FaEnvelope, FaDownload, FaComment, FaArrowLeft } from 'react-icons/fa';
import Pagination from './Pagination';
const applicantData = [
    {
        id: 1,
        name: 'John Doe',
        desiredPosition: 'Marketing Officer',
        image: '../../src/assets/profes.jpg',
    },
    {
        id: 2,
        name: 'Jane Smith',
        desiredPosition: 'UI/UX Designer',
        image: '../../src/assets/profes.jpg',
    },
    {
        id: 3,
        name: 'Mike Johnson',
        desiredPosition: 'Software Engineer',
        image: '../../src/assets/profes.jpg',
    },
    {
        id: 4,
        name: 'Emily Davis',
        desiredPosition: 'Graphic Designer',
        image: '../../src/assets/profes.jpg',
    },
    {
        id: 5,
        name: 'David Wilson',
        desiredPosition: 'Data Analyst',
        image: '../../src/assets/profes.jpg',
    }
];

const ApplicantRow = ({ applicant, handleShowModal }) => (
    <>
    <tr key={applicant.id} className="border-bottom">
    <td style={{ textAlign: 'left', padding: '15px' }}>
        <div className="d-flex align-items-center flex-wrap">
            <img 
                src={applicant.image} 
                alt={applicant.name} 
                className="rounded-circle me-2" 
                style={{ width: '50px', height: '50px', objectFit: 'cover' }} 
            />
            <div>
                <h6 className="mb-0">{applicant.name}</h6>
                <small className="text-muted">{applicant.desiredPosition}</small>
            </div>
        </div>
    </td>
    <td className="text-md-right">
        <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-md-end">
            <FaBookmark className="me-md-2 mb-2 mb-md-0" style={{ color: '#096fc8', height: '21px' }} />
            
            <button 
                className="btn btn-sm btn-light text-primary w-md-auto but" 
                style={{ 
                    fontWeight: '500', 
                    background: '#ddf2ff', 
                    padding: '10px', 
                    borderRadius: '6px', 
                    height: '50px',
                    width: '40%'
                }}
            >
                View Profile <FaArrowRight className="ms-1" />
            </button>

            <button 
                className="btn btn-sm btn-light text-primary fw-bold ms-md-2 mt-2 mt-md-0 w-md-auto" 
                onClick={(event) => handleShowModal(applicant, event)}
            >
                <FaEllipsisV />
            </button>
        </div>
    </td>
    </tr>
    <style>{`
    @media (max-width: 768px) {
        .but {
            width: 100% !important;
        }
    }
    `}</style>
</>
);

const ApplicantsTable = () => {
    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

    const modalRef = useRef();

    const handleShowModal = (applicant, event) => {
        setSelectedApplicant(applicant);
        const buttonRect = event.target.getBoundingClientRect();
        setModalPosition({
            top: buttonRect.bottom + window.scrollY,
            left: buttonRect.left + window.scrollX,
        });
        setShowModal(true);
    };

    const handleOutsideClick = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        if (showModal) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showModal]);

    const handleOptionClick = (option) => {
        console.log(`${option} for applicant: ${selectedApplicant.name}`);
        setShowModal(false);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentApplicants = applicantData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Container>
            <div className="table-responsive">
                <Table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <tbody>
                        {currentApplicants.map((applicant) => (
                            <ApplicantRow key={applicant.id} applicant={applicant} handleShowModal={handleShowModal} />
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Pagination with left and right arrows */}
            <Pagination
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                totalItems={applicantData.length}
                paginate={paginate}
            />

   {/* Modal */}
   {showModal && (
                <div
                    ref={modalRef}
                    className="modal-content"
                    style={{
                        position: 'absolute',
                        top: `${modalPosition.top}px`,
                        left: `${modalPosition.left}px`,
                        zIndex: 950,
                        minWidth: '150px',
                        maxWidth: '200px',
                        padding: '3px',
                        borderRadius: '8px',
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div className="modal-body p-0">
                        <ul className="list-unstyled mb-0">
                            <li className="mb-1">
                                <button
                                    className="btn btn-sm w-100 text-start text-muted text-decoration-none"
                                    style={{ padding: '4px 8px', transition: 'background-color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#d1ecf1'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                    onClick={() => handleOptionClick('Send Email')}
                                >
                                    <FaEnvelope className="me-2" /> Send Email
                                </button>
                            </li>
                            <li className="mb-1">
                                <button
                                    className="btn btn-sm w-100 text-start text-muted text-decoration-none"
                                    style={{ padding: '4px 8px', transition: 'background-color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#d1ecf1'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                    onClick={() => handleOptionClick('Download Resume')}
                                >
                                    <FaDownload className="me-2" /> Download Resume
                                </button>
                            </li>
                            <li className="mb-1">
                                <button
                                    className="btn btn-sm w-100 text-start text-muted text-decoration-none"
                                    style={{ padding: '4px 8px', transition: 'background-color 0.2s' }}
                                    onMouseOver={(e) => e.target.style.backgroundColor = '#d1ecf1'}
                                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                    onClick={() => handleOptionClick('Send Message')}
                                >
                                    <FaComment className="me-2" /> Send Message
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default ApplicantsTable;
