import React, { useState, useEffect } from "react";
import {
  LocalUser,
  RemoteUser,
  useIsConnected,
  useJoin,
  useLocalMicrophoneTrack,
  useLocalCameraTrack,
  usePublish,
  useRemoteUsers,
  useLocalScreenTrack,
  useTrackEvent,
  LocalVideoTrack,
  LocalAudioTrack
} from "agora-rtc-react";
import { useLocation, useParams } from "react-router-dom";
import "../css/video.css";
import logo from "../assets/logo3.png";
import { useAuth } from "../AuthContext";
import { postToEndpoint } from '../components/apiService';
import Swal from "sweetalert2"; 
import { faDesktop } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import apiClient from "../components/apiClient";
import { Button, Container, Row, Col } from "react-bootstrap";

export const Subscriber = () => {
  const { user } = useAuth();
  const { job_id, application_id } = useParams();
  const [calling, setCalling] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const isConnected = useIsConnected();
  const [appId] = useState("969528b81d9d47f49fe811e371eb1510");
  const [channel, setChannel] = useState("");
  const [token, setToken] = useState("");
  const [uid, setUid] = useState(null);
  const [company, setCompany] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCompany = async () => {
        try {
            const response = await postToEndpoint('/getCompanyName.php', {
                job_id: job_id,
            });

            if (response.data?.companyname) {
                setCompany(response.data.companyname);
            } else {
                console.error('No company found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching company:', error);
        }
    };

      fetchCompany();
  }, [job_id]);

  useEffect(() => {
    const fetchApplied = async () => {
        try {
            const response = await postToEndpoint('/getApplicantAppliedDetails.php', { application_id, job_id });
            if (response.data.jobs) {
                setApplications(response.data.jobs);
            } else {
                console.error('No jobs found or an error occurred:', response.data.error);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    fetchApplied();
  }, [application_id, job_id]);

  const JOIN_REQUEST_URL = `${apiClient.defaults.baseURL}/joinRequest.php`;
  const APPROVED_REQUEST_URL = `${apiClient.defaults.baseURL}/approvedRequest.php`;
  const TOKEN_FETCH_URL = `${apiClient.defaults.baseURL}/generateToken.php`;
  const DELETE_REQUEST_URL = `${apiClient.defaults.baseURL}/deleteRequest.php`;

  const handleCancel = async () => {
    try {
      const response = await fetch(DELETE_REQUEST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: job_id,
          application_id: application_id,
          channel
        }),
      });
  
      const data = await response.json();
      if (data.status === "success") {
        setPendingApproval(false); 
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error canceling request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while canceling the request.",
        confirmButtonText: "OK",
      });
    }
  };
  
  const sendJoinRequest = async (channel) => {
    try {
      const response = await fetch(JOIN_REQUEST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel, application_id, job_id }),
      });
      const data = await response.json();
      if (data.status === "pending") {
        setPendingApproval(true);
      } else {
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error sending join request:", error);
    }
  };

  const fetchRTCToken = async (channel) => {
    try {
      const uid = Math.floor(Math.random() * 100000);
      setUid(uid);
      const response = await fetch(
        `${TOKEN_FETCH_URL}?channelName=${channel}&uid=${uid}&role=subscriber`
      );
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.rtcToken;
    } catch (error) {
      console.error("Error fetching RTC token:", error);
      throw error;
    }
  };

  const checkIfChannelExists = async (channel, applicationId, jobId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${apiClient.defaults.baseURL}/checkChannelExists.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            channel_name: channel,
            application_id: applicationId,
            job_id: jobId,
          }),
        }
      );
  
      const data = await response.json();
      if (data.status === "exists") {
        return true;
      } else {
        Swal.fire({
          icon: "error",
          title: "Channel Not Found",
          text: "The channel name you are trying to access does not exist. Kindly verify the channel name and ensure it is entered correctly.",
          confirmButtonText: "OK",
        });
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error("Error checking channel existence:", error);
  
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error checking the channel existence.",
        confirmButtonText: "OK",
      });
      setLoading(false);
      return false;
    }
  };
  
  
  const handleJoin = async () => {
    setLoading(true);
    const channelExists = await checkIfChannelExists(channel, application_id, job_id);
    if (!channelExists) return;  
  
    try {
      await sendJoinRequest(channel);
      
      const approvalCheckInterval = setInterval(async () => {
        const response = await fetch(
          `${APPROVED_REQUEST_URL}?channel=${channel}&uid=${application_id}&job_id=${job_id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ channel, application_id, job_id }),
          }
        );
  
        const data = await response.json();
  
        if (data.status === "approved") {
          clearInterval(approvalCheckInterval);
          setPendingApproval(false);
          const rtcToken = await fetchRTCToken(data.channel_name);
          setToken(rtcToken);
          setCalling(true);
          setLoading(false);
        } else if (data.status === "rejected") {
          clearInterval(approvalCheckInterval);
          setPendingApproval(false);
          setLoading(false);
          Swal.fire({
            icon: "error",
            title: "Request Rejected",
            text: "Your request to join was rejected by the host.",
            confirmButtonText: "OK",
          });
        } else if (data.error) {
          console.error("Approval Error:", data.error);
          setLoading(false);
        }
      }, 3000);
    } catch (error) {
      console.error("Failed to join channel:", error);
      setLoading(false);
    }
  };
  
  
  useJoin(
    { appid: appId, channel: channel, token: token || null, uid: uid || null },
    calling
  );
  
  const [micOn, setMic] = useState(false);
  const [cameraOn, setCamera] = useState(false);
  const [screenShareOn, setScreenShareOn] = useState(false); 
  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  const { screenTrack, error: screenShareError } = useLocalScreenTrack(screenShareOn, { systemAudio: "include" });
  const [screenVideoTrack, setScreenVideoTrack] = useState(null);
  const [screenAudioTrack, setScreenAudioTrack] = useState(null);

  useTrackEvent(screenVideoTrack, "track-ended", () => {
    console.log("Screen sharing ended");
    setScreenShareOn(false);  
  });
  
  useEffect(() => {
    if (!screenTrack) {
      setScreenAudioTrack(null);
      setScreenVideoTrack(null);
    } else {
      if (Array.isArray(screenTrack)) {
        setScreenVideoTrack(
          screenTrack.find((track) => track.trackMediaType === "video") || null
        );
        setScreenAudioTrack(
          screenTrack.find((track) => track.trackMediaType === "audio") || null
        );
      } else {
        setScreenVideoTrack(screenTrack);
      }
    }
  }, [screenTrack]);

  usePublish([localMicrophoneTrack, localCameraTrack, screenVideoTrack]);

  const remoteUsers = useRemoteUsers();

  return (
    <>
  <Container fluid className="room p-3">
      {isConnected ? (
        <>
<div className="video-chat-container">
  <div className={`user-list-container ${remoteUsers.length === 0 ? 'single-user-mode' : ''}`}>
    {/* First user (local user) */}
    <div className={`user local-user ${remoteUsers.length === 0 ? 'only-user' : ''}`}>
      <div className="video-container">
        {screenShareOn && screenVideoTrack ? (
          <div className="screen-share h-100">
            <LocalVideoTrack
              disabled={!screenShareOn}
              play={screenShareOn}
              track={screenVideoTrack}
            />
            {screenAudioTrack && (
              <LocalAudioTrack
                disabled={!screenShareOn}
                track={screenAudioTrack}
              />
            )}
          </div>
        ) : (
          <LocalUser
            audioTrack={localMicrophoneTrack}
            cameraOn={cameraOn}
            micOn={micOn}
            videoTrack={localCameraTrack}
            cover={applications[0]?.profile_picture_url}
            className="h-100"
          >
            <span className="user-name">You: ({applications[0]?.firstname} {applications[0]?.lastname})</span>
          </LocalUser>
        )}
      </div>
    </div>
    
    {/* Remote users */}
    {remoteUsers.map((user) => (
      <div className="user remote-user" key={user.uid}>
        <div className="video-container">
          <RemoteUser cover={company.logo} user={user} className="h-100">
            <span className="user-name">{company.company_name}</span>
          </RemoteUser>
        </div>
      </div>
    ))}
  </div>

  <div className="control-container">
    <div className="control-buttons">
      <div className="left-control">
        <Button className="btn1" variant={micOn ? "primary" : "danger"} onClick={() => setMic((a) => !a)}>
          <i className={`i-microphone ${!micOn ? "off" : ""}`} />
        </Button>
        <Button className="btn1" variant={cameraOn ? "primary" : "danger"} onClick={() => setCamera((a) => !a)}>
          <i className={`i-camera ${!cameraOn ? "off" : ""}`} />
        </Button>
        <Button
          variant={screenShareOn ? "primary" : "secondary"}
          onClick={() => setScreenShareOn((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faDesktop} className={!screenShareOn ? "off" : ""} />
        </Button>
      </div>
      <div className="center-control">
        <Button
          variant={calling ? "success" : "danger"}
          className="btn1 btn-phone"
          onClick={() => setCalling((a) => !a)}
        >
          {calling ? <i className="i-phone-hangup" /> : <i className="i-mdi-phone" />}
        </Button>
      </div>
    </div>
  </div>
</div>

<style jsx>{`
  /* Main container */

  .room {
    position: fixed;
  }
  .video-chat-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    position: relative;
    padding-bottom: 80px;
  }
  
  /* User list container */
  .user-list-container {
    align-items: center;
    justify-content: center;
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    padding: 15px;
    gap: 15px;
  }
  
  /* Single user mode */
  .single-user-mode {
    justify-content: center;
    align-items: center;
  }
  
  /* Individual user containers */
  .user {
    position: relative;
    border-radius: 8px;
    overflow: hidden;
  }
  
  /* Only user styles */
  .only-user {
    max-width: 800px !important;
    height: 70vh !important;
    margin: 0 auto;
  }
  
  /* Video container */
  .video-container {
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    border-radius: 8px;
  }
  
  .h-100 {
    height: 100%;
  }
  
  /* User name styles */
  .user-name {
    position: absolute;
    bottom: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 14px;
  }
  
  /* Control container */
  .control-container {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #21242c;
    padding: 15px 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 100;
  }
  
  /* Control buttons container */
  .control-buttons {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    padding: 0 32px;
    position: relative;
  }
  
  /* Left controls */
  .left-control {
    display: flex;
    gap: 10px;
  }
  
  /* Center control (call button) */
  /* PC View - Side by side */
  @media (min-width: 768px) {
    .local-user {
      height: 650px !important
    }
    .remote-user {
      height: 650px !important
    }
    .user-list-container {
      flex-direction: row;
    }
    
    .user {
      flex: 1;
      max-width: calc(50% - 7.5px);
      height: 50vh;
    }
    
    /* Center only user on PC view */
    .single-user-mode .only-user {
      max-width: 800px;
      width: 80%;
      height: 70vh;
    }
  }
  
  /* Mobile View - Stacked */
  @media (max-width: 767.98px) {
    .user-list-container {
      flex-direction: column;
    }
    
    .user {
      width: 100%;
      height: 30vh;
      margin-bottom: 15px;
    }
    
    /* Center only user on Mobile view */
    .single-user-mode .only-user {
      width: 100%;
      height: 50vh !important;
      margin-bottom: 0;
    }
    
    .control-buttons button {
      padding: 8px 12px;
      font-size: 14px;
    }
  }

  @media (min-width: 576px) {
    .local-user {
      height: 330px;
    }
    .remote-user {
      height: 330px;
    }
  }
`}</style>
        </>
        ) : pendingApproval ? (
          <>
            <div className="join-room">
              <div className="header">
                <div className="logo-container">
                  <img 
                    src={logo}
                    alt="Jobsync Logo" 
                    className="logo"
                  />
                  <h1 className="title1">JobSync</h1>
                </div>
              </div>
              <div className="welcome-message">
                <h4>Welcome to the JobSync Video Conference</h4>
                <p>To proceed with your one-on-one video conference, please input the designated meeting name.</p>
              </div>
              <input
                onChange={(e) => setChannel(e.target.value)}
                placeholder="Company Name-5f9JCv5d2El2sdte4WkAnuqaXiY0LNG"
                value={channel}
              />
              <button
                className={`join-channel ${!channel ? "disabled" : ""}`}
                disabled={!channel}
                onClick={handleJoin}
              >
                <span>Request to Join</span>
              </button>
              {/* Home link */}
              <div className="link">
                <a href="/" className="home-link">
                  Back home
                </a>
              </div>
            </div>
            
            {/* Overlay */}
            <div className="overlay"></div>
            
            {/* Join request modal */}
            <div className="join-requests">
              <h4>Waiting for host approval...</h4>
              <button
                className="cancel-button"
                onClick={handleCancel}
              >
                <span>Cancel</span>
              </button>
            </div>
            <style>{`
            /* JoinRoom.css */
            .join-room {
              max-width: 630px;
              margin: 30px auto;
              border-radius: 8px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
              padding: 25px;
              background-color: #1e1e1e; 
              position: relative;
            }
            
            .header {
              margin-bottom: 35px;
            }
            
            .logo-container {
              display: flex;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              gap: 10px;
            }
            
            .logo {
              width: 150px;
              max-width: 100%;
              height: auto;
            }
            
            .title {
              font-weight: 700;
              margin: 0;
              font-size: 2rem;
            }
            
            .welcome-message h4 {
              color: #a7a7a7;
              margin-bottom: 10px;
              font-size: 1.2rem;
            }
            
            .welcome-message p {
              color: #7b7b7b;
              margin-bottom: 20px;
              font-size: 1rem;
            }
            
            input {
              width: 100%;
              padding: 12px 15px;
              margin-bottom: 20px;
              border: 1px solid #e0e0e0;
              border-radius: 4px;
              font-size: 1rem;
              box-sizing: border-box;
            }
            
            .join-channel {
              width: 100%;
              padding: 12px 0;
              background-color: #4a90e2;
              color: white;
              border: none;
              border-radius: 4px;
              font-size: 1rem;
              cursor: pointer;
              transition: background-color 0.3s;
            }
            
            .join-channel:hover:not(.disabled) {
              background-color: #3a80d2;
            }
            
            .join-channel.disabled {
              background-color: #cccccc;
              cursor: not-allowed;
            }
            
            .link {
              text-align: end;
              padding: 15px 10px 5px;
            }
            
            .home-link {
              color: #4a90e2;
              text-decoration: none;
            }
            
            .home-link:hover {
              text-decoration: underline;
            }
            
            /* Overlay */
            .overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              backdrop-filter: blur(5px);
              z-index: 99;
            }
            
            /* Join requests modal */
            .join-requests {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: #d9d9d978;
              padding: 30px;
              border-radius: 8px;
              text-align: center;
              z-index: 100;
              width: 90%;
              max-width: 400px;
            }
            
            .join-requests h4 {
              color: white;
              margin-top: 0;
              margin-bottom: 30px;
              font-size: 1.2rem;
            }
            
            .cancel-button {
              background: #f99bab;
              color: #e03131;
              border: none;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 1rem;
              transition: background-color 0.3s;
            }
            
            .cancel-button:hover {
              background: #f77a8f;
            }
            
            /* Media queries for responsiveness */
            @media screen and (max-width: 768px) {
              .join-room {
                width: 85%;
                margin-top: 4rem !important;
                padding: 15px;
              }
              
              .title {
                font-size: 1rem !important;
              }
              
              .join-requests {
                width: 85%;
              }
            }
            
            @media screen and (max-width: 480px) {
              .join-room {
                width: 90%;
                padding: 10px;
              }
              
              .logo {
                width: 120px;
              }
              
              .title {
                font-size: 1rem !important;
              }
              
              .welcome-message h4 {
                font-size: 1.1rem;
              }
              
              .welcome-message p {
                font-size: 0.9rem;
              }
              
              input {
                font-size: 0.9rem;
              }
              
              .join-channel {
                font-size: 0.9rem;
              }
              
              .join-requests {
                padding: 20px;
              }
              
              .join-requests h4 {
                font-size: 1.1rem;
              }
              
              .cancel-button {
                font-size: 0.9rem;
              }
            }
            `}</style>
        </>
        ) : (
          <>
            <div className="join-room">
              <div className="header" style={{ marginBottom: '35px' }}>
                <div className="logo-container">
                  <img 
                    src={logo}
                    alt="Jobsync Logo" 
                    className="logo" 
                    style={{ width: '150px' }}
                  />
                  <h1 className="title1" style={{ fontWeight: '700' }}>JobSync</h1>
                </div>
              </div>
              <div className="welcome-message">
                <h4 style={{color: '#a7a7a7'}}>Welcome to the JobSync Video Conference</h4>
                <p style={{color: '#7b7b7b'}}>To proceed with your one-on-one video conference, please input the designated meeting name.</p>
              </div>
              <input
                onChange={(e) => setChannel(e.target.value)}
                placeholder="Company Name-5f9JCv5d2El2sdte4WkAnuqaXiY0LNG"
                value={channel}
              />
               <button
                  className={`join-channel ${!channel ? "disabled" : ""}`}
                  disabled={!channel || loading}
                  style={{background: loading && '#5076ab',
                          border: 'none'}}
                  onClick={handleJoin}
                >
                  {loading ? <div className="loading-message">Joining...</div> : <span>Request to Join</span>}
                </button>
              {/* Home link */}
              <div className="link" style={{ textAlign: 'end', padding: '5px 10px' }}>
                <a href="/" className="home-link">
                  Back home
                </a>
              </div>
            </div>
          </>
        )}
      </Container>
      <style>{`
        #root {
          width: 100%;
        }
      `}</style>
      {/* {isConnected && (
    
      )} */}
    </>
  );
};

export default Subscriber;
