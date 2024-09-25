import "./styles/QA.css";
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const SentimentAnalysis = () => {
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem("auth")) || "";
  useEffect(() => {
    // Check if token exists and redirect if not
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
            setAudioFile(null); // Clear any previously selected file
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
    <div className="container">
      <h1 className="title">Sentiment Analysis</h1>
      <div className="input-group">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isRecording}
          className="file-input"
        />
        <button onClick={handleRecord} className="record-button">
          {isRecording ? "Stop Recording" : "Start Recording"}
        </button>
      </div>
      <div className="options-group">
        <label className="radio-container">
          <input
            type="radio"
            value="Sentiment Only"
            checked={sentimentOption === "Sentiment Only"}
            onChange={handleOptionChange}
          />
          Sentiment Only
        </label>
        <label className="radio-container">
          <input
            type="radio"
            value="Sentiment + Score"
            checked={sentimentOption === "Sentiment + Score"}
            onChange={handleOptionChange}
          />
          Sentiment + Score
        </label>
      </div>
      <button onClick={handleSubmit} className="submit-button">
        Transcribe
      </button>
      <div className="output-group">
        <h2 className="output-title">Detected Language</h2>
        <p>{language}</p>
      </div>
      <div className="output-group">
        <h2 className="output-title">Transcription</h2>
        <p>{transcription}</p>
      </div>
      <div className="output-group">
        <h2 className="output-title">Sentiment Analysis</h2>
        <p>{sentiment}</p>
      </div>
    </div>
  );
};

export default SentimentAnalysis;
