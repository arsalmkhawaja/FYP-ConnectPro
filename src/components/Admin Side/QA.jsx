import "./styles/QA.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material";
import { tokens } from "../../theme";

const SentimentAnalysis = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const token = JSON.parse(localStorage.getItem("auth")) || "";

  useEffect(() => {
    if (!token) {
      toast.warn("Please login first to access the dashboard");
      navigate("/login");
    }
  }, [token, navigate]);

  const [audioFile, setAudioFile] = useState(null);
  const [sentimentOption, setSentimentOption] = useState("Sentiment Only");
  const [language, setLanguage] = useState("");
  const [transcription, setTranscription] = useState("");
  const [sentiment, setSentiment] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const [recordedBlob, setRecordedBlob] = useState(null);

  const handleFileChange = (event) => {
    setAudioFile(event.target.files[0]);
  };

  const handleOptionChange = (event) => {
    setSentimentOption(event.target.value);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("audio", audioFile || recordedBlob, "audio.wav");
    formData.append("sentimentOption", sentimentOption);

    try {
      const response = await axios.post(
        "http://localhost:5000/inference",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setLanguage(response.data.language);
      setTranscription(response.data.transcription);
      setSentiment(response.data.sentiment);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  const handleRecord = () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    } else {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.ondataavailable = (event) => {
            setRecordedBlob(event.data);
            setAudioFile(null);
          };
          mediaRecorder.start();
          setIsRecording(true);
        })
        .catch((error) => {
          console.error("Error accessing microphone:", error);
        });
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        style={{
          backgroundColor: colors.primary[400],
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
          padding: "40px",
          maxWidth: "600px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: colors.greenAccent[500], marginBottom: "20px" }}>
          Sentiment Analysis
        </h1>

        <div style={{ marginBottom: "20px" }}>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            disabled={isRecording}
            style={{
              padding: "10px",
              border: `1px solid ${colors.blueAccent[600]}`,
              borderRadius: "5px",
              marginBottom: "10px",
              display: "block",
              width: "100%",
            }}
          />
          <button
            onClick={handleRecord}
            style={{
              padding: "10px 20px",
              backgroundColor: colors.greenAccent[500],
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "100%",
            }}
          >
            {isRecording ? "Stop Recording" : "Start Recording"}
          </button>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px" }}>
            <input
              type="radio"
              value="Sentiment Only"
              checked={sentimentOption === "Sentiment Only"}
              onChange={handleOptionChange}
            />
            Sentiment Only
          </label>
          <label>
            <input
              type="radio"
              value="Sentiment + Score"
              checked={sentimentOption === "Sentiment + Score"}
              onChange={handleOptionChange}
            />
            Sentiment + Score
          </label>
        </div>

        <button
          onClick={handleSubmit}
          style={{
            padding: "10px 20px",
            backgroundColor: colors.blueAccent[600],
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginBottom: "20px",
            width: "100%",
          }}
        >
          Transcribe
        </button>

        <div style={{ marginBottom: "20px", backgroundColor: colors.primary[600], padding: "20px", borderRadius: "8px" }}>
          <h2 style={{ color: colors.greenAccent[500] }}>Detected Language</h2>
          <p>{language}</p>
        </div>

        <div style={{ marginBottom: "20px", backgroundColor: colors.primary[600], padding: "20px", borderRadius: "8px" }}>
          <h2 style={{ color: colors.greenAccent[500] }}>Transcription</h2>
          <p>{transcription}</p>
        </div>

        <div style={{ backgroundColor: colors.primary[600], padding: "20px", borderRadius: "8px" }}>
          <h2 style={{ color: colors.greenAccent[500] }}>Sentiment Analysis</h2>
          <p>{sentiment}</p>
        </div>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
