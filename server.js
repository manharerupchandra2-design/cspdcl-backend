const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");


const consumerRoutes = require("./routes/consumerRoutes");
const readingRoutes = require("./routes/readingRoutes");
const billRoutes = require("./routes/billRoutes");
const meterRoutes=require("./routes/meterRoutes");
const userRoutes=require("./routes/userRoutes")

const app = express();

dotenv.config();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/consumers", consumerRoutes);
app.use("/api/readings", readingRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/meters",meterRoutes);
app.use("/api/user", userRoutes);

const { verifyToken } = require("./middleware/authMiddleware");

app.get("/api/profile", verifyToken, (req, res) => {
  res.json({
    success: true,
    message: "Protected route",
    user: req.user,
  });
});


app.get("/", (req, res) => {
  res.send("API is running 🚀");
});
const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});