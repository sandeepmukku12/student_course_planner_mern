require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const MONGO_DB_URI = process.env.MONGO_DB_URI;

const app = express();

app.use(cors());
app.use(express.json());

//MongoDB Connection
mongoose
  .connect(MONGO_DB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

//To get database name
// mongoose.connection.once("open", () => {
//   console.log("Connected to DB:", mongoose.connection.name);
// });

app.get("/", (req, res) => {
  res.send("API running successfully");
});
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server running successfully on port ${PORT}`);
});
