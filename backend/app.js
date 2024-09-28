require("dotenv").config();
require("express-async-errors");
const path = require("path");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();
const mainRouter = require("./routes/user");
const campaignRouter = require("./routes/campaign_routes");
const formsRouter = require("./routes/forms");
const salesRouter = require("./routes/sales");

// Middleware to parse JSON
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Routes
app.use("/api/v1", mainRouter);
app.use("/api/v2", campaignRouter);
app.use("/api/v3", formsRouter);
app.use("/api/v4", salesRouter); // Add the sales routes under a new version /api/v4

// Default port set from .env or fallback to 3000
const port = process.env.PORT || 4000;

// Function to start the server
const start = async () => {
  try {
    // Connect to MongoDB
    await connectDB(process.env.MONGO_URI);

    // Start server after successful DB connection
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error starting the server:", error);
  }
};

// Test route for checking if the server is running
app.get("/", (req, res) => {
  res.send("Server is running");
});
app.get("/api/v3", (req, res) => {
  res.send("Server is running");
});

start();
