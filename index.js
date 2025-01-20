require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors"); // Import the CORS package

const app = express();
const PORT = process.env.PORT || 8000;

// MongoDB connection URI from environment variables
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: MONGO_URI is not defined in the environment variables");
  process.exit(1); // Exit the application if MONGO_URI is not provided
}

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "TAP", // Explicitly specify the database name
  })
  .then(() => console.log("Connected to MongoDB - TAP database"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Enable CORS for all origins
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// /all endpoint to fetch data from TAP database's data collection
app.get("/all", async (req, res) => {
  console.log("Fetching all documents from data collection");

  try {
    const collection = mongoose.connection.collection("data");

    // Fetch all documents
    const documents = await collection.find({}).toArray();
    console.log(`Fetched ${documents.length} documents from data collection`);

    // Return the documents as a response
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error fetching data collection:", error);
    res.status(500).json({ error: "Failed to fetch collection" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
