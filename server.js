const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
const upload = multer({ dest: "uploads/" });

app.post("/upload", upload.single("invoiceFile"), (req, res) => {
  const { companyName, invoiceNumber, invoiceDate } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Simulated processing
  const result = {
    message: "Invoice uploaded successfully!",
    file: file.originalname,
    parsedDetails: {
      companyName,
      invoiceNumber,
      invoiceDate,
      totalAmount: "₹12,500",
      dueDate: "2025-07-15",
    },
  };

  return res.status(200).json(result);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
