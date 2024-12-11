// import React, { useState, useRef, useEffect } from "react";

// const AudioRecorder = () => {
//   const [isRecording, setIsRecording] = useState(false);
//   const micStreamRef = useRef(null);
//   const browserStreamRef = useRef(null);
//   const micRecorderRef = useRef(null);
//   const browserRecorderRef = useRef(null);
//   const micChunksRef = useRef([]);
//   const browserChunksRef = useRef([]);
//   const videoRef = useRef(null);

//   useEffect(() => {
//     const videoElement = videoRef.current;

//     // Autoplay the video and log errors
//     const playVideo = async () => {
//       try {
//         await videoElement.play();
//         console.log("Video is playing");
//       } catch (error) {
//         console.error("Error playing video:", error);
//       }
//     };

//     // Play video when the component is mounted
//     videoElement.addEventListener("canplay", playVideo);

//     return () => {
//       videoElement.removeEventListener("canplay", playVideo);
//     };
//   }, []);

//   const startRecording = async () => {
//     try {
//       setIsRecording(true);

//       // Access the microphone
//       const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       micStreamRef.current = micStream;

//       // Capture browser audio from the video element
//       const audioContext = new AudioContext();
//       const destination = audioContext.createMediaStreamDestination();
//       const videoElement = videoRef.current;
//       const videoSource = audioContext.createMediaElementSource(videoElement);
//       videoSource.connect(destination);
//       videoSource.connect(audioContext.destination);

//       const browserStream = destination.stream;
//       browserStreamRef.current = browserStream;

//       // Set up MediaRecorders
//       micRecorderRef.current = new MediaRecorder(micStream);
//       browserRecorderRef.current = new MediaRecorder(browserStream);

//       micRecorderRef.current.ondataavailable = (e) => {
//         micChunksRef.current.push(e.data);
//       };

//       browserRecorderRef.current.ondataavailable = (e) => {
//         browserChunksRef.current.push(e.data);
//       };

//       micRecorderRef.current.start();
//       browserRecorderRef.current.start();
//     } catch (error) {
//       console.error("Error starting recording:", error);
//       setIsRecording(false);
//     }
//   };

//   const stopRecording = () => {
//     setIsRecording(false);

//     // Stop microphone recording
//     if (micRecorderRef.current) {
//       micRecorderRef.current.stop();
//       micStreamRef.current.getTracks().forEach((track) => track.stop());

//       micRecorderRef.current.onstop = () => {
//         const micBlob = new Blob(micChunksRef.current, { type: "audio/wav" });
//         downloadFile(micBlob, "mic-audio.wav");
//         micChunksRef.current = [];
//       };
//     }

//     // Stop browser audio recording
//     if (browserRecorderRef.current) {
//       browserRecorderRef.current.stop();
//       browserStreamRef.current.getTracks().forEach((track) => track.stop());

//       browserRecorderRef.current.onstop = () => {
//         const browserBlob = new Blob(browserChunksRef.current, { type: "audio/wav" });
//         downloadFile(browserBlob, "browser-audio.wav");
//         browserChunksRef.current = [];
//       };
//     }
//   };

//   const downloadFile = (blob, fileName) => {
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = fileName;
//     document.body.appendChild(a);
//     a.click();
//     a.remove();
//   };

//   return (
//     <div>
//       <h1>Audio Recorder with Video Test</h1>
//       {/* Ensure the video file is in the public folder */}
//       <video
//         ref={videoRef}
//         controls
//         width="600"
//         style={{ display: "block", marginBottom: "20px" }}
//       >
//         <source src="/1.mp4" type="video/mp4" />
//         Your browser does not support the video tag.
//       </video>
//       <button onClick={startRecording} disabled={isRecording}>
//         Start Recording
//       </button>
//       <button onClick={stopRecording} disabled={!isRecording}>
//         Stop Recording
//       </button>
//     </div>
//   );
// };

// export default AudioRecorder;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Optional: For notifications

const CallsTable = () => {
  const [calls, setCalls] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Retrieve the token (adjust based on how you store it)
  const token = JSON.parse(localStorage.getItem("auth"))?.token || "";

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/v5/call", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("API Response:", response.data); // Debugging
        setCalls(response.data.calls || []); // Set calls to response.data.calls
        setLoading(false);
      } catch (error) {
        console.error("Error fetching calls:", error);
        setError("Failed to fetch calls.");
        setLoading(false);
        toast.error("Failed to fetch calls."); // Optional: Show error notification
      }
    };

    fetchCalls();
  }, [token]);

  if (loading) {
    return <p>Loading calls...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Call Recordings</h2>
      {calls.length > 0 ? (
        <ul>
          {calls.map((call) => (
            <li key={call._id} style={{ marginBottom: "20px" }}>
              <p>
                <strong>Phone Number:</strong> {call.phoneNumber}
              </p>
              <p>
                <strong>Duration:</strong> {call.duration} seconds
              </p>
              <p>
                <strong>Disposition:</strong> {call.disposition}
              </p>
              <p>
                <strong>Sentiment:</strong> {call.sentiment}
              </p>
              <p>
                <strong>Transcription:</strong> {call.transcription}
              </p>
              {call.recordingUrl ? (
                <audio controls>
                  <source src={call.recordingUrl} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <p>No Recording Available.</p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No calls available.</p>
      )}
    </div>
  );
};

export default CallsTable;
