import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  TextField,
  Box,
  Container,
  Paper,
  Grid,
  Typography,
  Modal,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const CallCenterScreen = () => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showDisposition, setShowDisposition] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [currentNumberIndex, setCurrentNumberIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);
  const [confirmationText, setConfirmationText] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postCode: "",
    gender: "",
    phone: "",
    altPhone: "",
    email: "",
    comments: "",
  });

  const handleFormChange = (updatedFormData) => {
    setFormData(updatedFormData);
  };

  const handleClearForm = () => {
    setFormData({
      title: "",
      firstName: "",
      lastName: "",
      address: "",
      city: "",
      state: "",
      postCode: "",
      gender: "",
      phone: "",
      altPhone: "",
      email: "",
      comments: "",
    });
  };

  useEffect(() => {
    if (window.Twilio) {
      console.log("Twilio SDK is loaded and available");
    } else {
      console.error(
        "Twilio SDK is not available. Make sure it is loaded correctly."
      );
    }

    const loadScript = (src, onLoad) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = onLoad;
      document.body.appendChild(script);
    };

    const initializeScripts = () => {
      loadScript("/jquery.min.js", () => {
        loadScript("/twilio.min.js", () => {
          loadScript("/quickstart.js", () => {
            if (window.initializeQuickstart) {
              window.initializeQuickstart();
            }
          });
        });
      });
    };

    initializeScripts();
  }, []);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleHangup = async () => {
    setShowDisposition(true);
    const id = setTimeout(() => {
      if (!isPaused) {
        dialNextNumber();
      }
    }, 5000);
    setTimeoutId(id);

    if (window.Twilio) {
      window.Twilio.Device.disconnectAll();
    }
  };

  const handleCloseDisposition = () => {
    setShowDisposition(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      complete: (result) => {
        const numbers = result.data.map((row) => ({
          phoneNumber: row[0],
          confirmationText: row[1] || "",
        }));
        setPhoneNumbers(numbers);
      },
      header: false,
    });
  };

  const startAutoDial = () => {
    if (phoneNumbers.length > 0) {
      dialNextNumber();
    }
  };

  const dialNextNumber = () => {
    if (currentNumberIndex < phoneNumbers.length && !isPaused) {
      const { phoneNumber, confirmationText } =
        phoneNumbers[currentNumberIndex];
      if (confirmationText) {
        setConfirmationText(confirmationText);
        setShowConfirmation(true);
      } else {
        dialNumber(phoneNumber);
      }
    } else {
      console.log("All numbers have been dialed. Stopping auto-dialer.");
      alert("All numbers have been dialed.");
    }
  };

  const dialNumber = (number) => {
    console.log(`Calling ${number}...`);
    if (window.Twilio) {
      window.Twilio.Device.connect({ To: number });
    }
    setCurrentNumberIndex(currentNumberIndex + 1);
  };

  const handlePause = () => {
    setIsPaused(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const handleResume = () => {
    setIsPaused(false);
    dialNextNumber();
  };

  const handleConfirmDial = () => {
    const { phoneNumber } = phoneNumbers[currentNumberIndex];
    dialNumber(phoneNumber);
    setShowConfirmation(false);
  };

  const handleSkipDial = () => {
    setCurrentNumberIndex(currentNumberIndex + 1);
    setShowConfirmation(false);
    dialNextNumber();
  };

  return (
    <Container>
      <Box
        sx={{
          perspective: "1000px",
          position: "relative",
          minHeight: "100vh",
        }}
      >
        <Box
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            transformStyle: "preserve-3d",
            transition: "transform 0.6s ease",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: isFlipped ? "none" : "block",
              backfaceVisibility: "hidden",
            }}
          >
            <Grid container spacing={3} sx={{ padding: 3 }}>
              <Grid item xs={12} md={3}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Phone:{" "}
                    {phoneNumbers[currentNumberIndex]?.phoneNumber ||
                      "No number"}
                  </Typography>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={startAutoDial}
                    sx={{ marginTop: 2 }}
                  >
                    Start Auto Dial
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handlePause}
                    sx={{ marginTop: 2 }}
                  >
                    Pause
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    fullWidth
                    onClick={handleResume}
                    sx={{ marginTop: 2 }}
                  >
                    Resume
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={handleHangup}
                    sx={{ marginTop: 2 }}
                  >
                    Hangup
                  </Button>
                  <Button
                    variant="contained"
                    color="info"
                    fullWidth
                    onClick={handleFlip}
                    sx={{ marginTop: 2 }}
                  >
                    Manual Dial
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={9}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                  <CustomerForm
                    formData={formData}
                    onFormChange={handleFormChange}
                    handleClearForm={handleClearForm} // Pass handleClearForm here for Automatic Dial
                    twoColumns
                  />
                </Paper>
              </Grid>
            </Grid>
          </Box>

          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: isFlipped ? "block" : "none",
              transform: "rotateY(180deg)",
              backfaceVisibility: "hidden",
            }}
          >
            <Grid container spacing={3} sx={{ padding: 3 }}>
              <Grid item xs={12} md={3}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                  <Box>
                    <Dialer handleHangup={handleHangup} />
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleFlip}
                    sx={{ marginTop: 2 }}
                  >
                    Automatic Dial
                  </Button>
                </Paper>
              </Grid>

              <Grid item xs={12} md={9}>
                <Paper elevation={3} sx={{ padding: 2, borderRadius: 2 }}>
                  <Box>
                    <CustomerForm
                      formData={formData}
                      onFormChange={handleFormChange}
                      handleClearForm={handleClearForm} // Pass handleClearForm here for Manual Dial
                      twoColumns
                    />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Box>

      <Modal open={showDisposition} onClose={handleCloseDisposition}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <DispositionModal onClose={handleCloseDisposition} />
        </Box>
      </Modal>

      <Modal open={showConfirmation} onClose={() => setShowConfirmation(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <ConfirmationModal
            text={confirmationText}
            onConfirm={handleConfirmDial}
            onCancel={handleSkipDial}
          />
        </Box>
      </Modal>
    </Container>
  );
};

const ConfirmationModal = ({ text, onConfirm, onCancel }) => {
  return (
    <Paper sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        {text}
      </Typography>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button variant="contained" color="primary" onClick={onConfirm}>
          Confirm
        </Button>
        <Button variant="contained" color="secondary" onClick={onCancel}>
          Skip
        </Button>
      </Box>
    </Paper>
  );
};

const Dialer = ({ handleHangup }) => {
  const [dialerInput, setDialerInput] = useState("");

  const handleDialerButtonClick = (value) => {
    setDialerInput(dialerInput + value);
  };

  const handleCallButtonClick = () => {
    if (window.Twilio) {
      window.Twilio.Device.connect({ To: dialerInput });
    }
    console.log("Call button clicked");
  };

  const handleHangupButtonClick = () => {
    if (window.Twilio) {
      window.Twilio.Device.disconnectAll();
    }
    console.log("Hangup button clicked");
    handleHangup();
  };

  const handleKeyPress = (e) => {
    const { key } = e;
    if (/^[0-9*#]$/.test(key)) {
      setDialerInput(dialerInput + key);
    }
  };

  useEffect(() => {
    window.addEventListener("keypress", handleKeyPress);
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [dialerInput]);

  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="h4" sx={{ marginBottom: 2 }}>
        {dialerInput || "Enter number"}
      </Typography>
      <Grid container spacing={1}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((num) => (
          <Grid item xs={4} key={num}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => handleDialerButtonClick(num.toString())}
              sx={{ height: 60 }}
            >
              {num}
            </Button>
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button
          variant="contained"
          color="success"
          sx={{ height: 80, width: 80, fontSize: 32 }}
          onClick={handleCallButtonClick}
        >
          📞
        </Button>
        <Button
          variant="contained"
          color="error"
          sx={{ height: 80, width: 80, fontSize: 32 }}
          onClick={handleHangupButtonClick}
        >
          ✖
        </Button>
      </Box>
    </Box>
  );
};

const CustomerForm = ({
  formData,
  onFormChange,
  handleClearForm,
  twoColumns,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.phone || !formData.gender) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const genderMapping = {
      M: "Male",
      F: "Female",
      U: "Other",
    };

    const dataToSend = {
      title: formData.title,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      postalCode: formData.postCode,
      gender: genderMapping[formData.gender],
      email: formData.email,
      comments: formData.comments,
      phoneNumber: formData.phone,
      altPhoneNumber: formData.altPhone,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/v3/forms",
        dataToSend
      );
      toast.success("Form submitted successfully");
      console.log("Form submitted successfully:", response.data);
    } catch (error) {
      console.error("Error submitting form:", error.response?.data || error);
      toast.error("Failed to submit form. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="State"
            name="state"
            value={formData.state}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Post Code"
            name="postCode"
            value={formData.postCode}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              label="Gender"
            >
              <MenuItem value="">Select Gender</MenuItem>
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
              <MenuItem value="U">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Alt. Phone"
            name="altPhone"
            value={formData.altPhone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={twoColumns ? 6 : 12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            label="Comments"
            name="comments"
            value={formData.comments}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button variant="contained" color="primary" type="submit">
          Submit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearForm} // Attach the handleClearForm function here
        >
          Clear Form
        </Button>
      </Box>
    </form>
  );
};

const DispositionModal = ({ onClose }) => {
  const [checkedItems, setCheckedItems] = useState({
    A: false,
    B: false,
    CALLBK: false,
    DC: false,
    DEC: false,
    DNC: false,
    N: false,
    NI: false,
    NP: false,
    SALE: false,
    XFER: false,
  });

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCheckedItems((prevState) => ({ ...prevState, [name]: checked }));
  };

  const handleSubmit = () => {
    const isAnyChecked = Object.values(checkedItems).some((item) => item);
    if (isAnyChecked) {
      onClose();
    } else {
      alert("Please select at least one option before submitting.");
    }
  };

  const handleClearDispositionForm = () => {
    setCheckedItems({
      A: false,
      B: false,
      CALLBK: false,
      DC: false,
      DEC: false,
      DNC: false,
      N: false,
      NI: false,
      NP: false,
      SALE: false,
      XFER: false,
    });
  };

  return (
    <Paper sx={{ padding: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>
        CALL DISPOSITION
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {Object.keys(checkedItems).map((key) => (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={checkedItems[key]}
                onChange={handleCheckboxChange}
                name={key}
              />
            }
            label={getLabel(key)}
          />
        ))}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleClearDispositionForm}
        >
          Clear Form
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Paper>
  );
};

const getLabel = (key) => {
  const labels = {
    A: "Answering Machine",
    B: "Busy",
    CALLBK: "Call Back",
    DC: "Disconnected Number",
    DEC: "Declined Sale",
    DNC: "DO NOT CALL",
    N: "No Answer",
    NI: "Not Interested",
    NP: "No Pitch No Price",
    SALE: "Sale Made",
    XFER: "Call Transferred",
  };
  return labels[key];
};

export default CallCenterScreen;