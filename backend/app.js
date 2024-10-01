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
const callsRouter = require("./routes/calls");

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(cors());

app.use("/api/v1", mainRouter);
app.use("/api/v2", campaignRouter);
app.use("/api/v3", formsRouter);
app.use("/api/v4", salesRouter);
app.use("/api/v5", callsRouter);

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
