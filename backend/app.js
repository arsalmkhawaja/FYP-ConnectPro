require("dotenv").config();
require("express-async-errors");
const path = require("path");
const connectDB = require("./config/db");
const express = require("express");
const cors = require("cors");
const app = express();

// Importing routes
const mainRouter = require("./routes/user");
const campaignRouter = require("./routes/campaign_routes");
const formsRouter = require("./routes/forms");
const salesRouter = require("./routes/sales");
const callsRouter = require("./routes/calls");
const analyticsRouter = require("./routes/analytics"); // Add this line
const scriptRouter = require("./routes/scripts"); // Add this line


// Middleware
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());

// API Routes
app.use("/api/v1", mainRouter);
app.use("/api/v2", campaignRouter);
app.use("/api/v3", formsRouter);
app.use("/api/v4", salesRouter);
app.use("/api/v5", callsRouter);
app.use("/api/v6/analytics", analyticsRouter); // Add this line for the analytics route
app.use("/api/v7", scriptRouter); // Add this line


// Server startup
const port = process.env.PORT || 4000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);

    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  } catch (error) {
    console.log("Error starting the server:", error);
  }
};

app.get("/", (req, res) => {
  res.send("Server is running");
});
app.get("/api/v3", (req, res) => {
  res.send("Server is running");
});

start();
