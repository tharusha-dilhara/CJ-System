const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const dbConnection = require("./db/connection");
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

//chnage maintenance mode
let maintenanceMode = false;
// API endpoint to get maintenance status
app.get('/api/status', (req, res) => {
  res.json({ maintenance: maintenanceMode });
});

// Endpoint to toggle maintenance mode (for admin use)
app.post('/api/toggle-maintenance', (req, res) => {
  maintenanceMode = !maintenanceMode;
  res.json({ maintenance: maintenanceMode });
});


//chnage compnay name
let poweredBy="peogen solutions";

app.get('/api/poweredby', (req, res) => {
  res.json(poweredBy);
});

app.post('/api/poweredby', (req, res) => {
  poweredBy = req.body.poweredBy;
  res.json({ poweredBy: poweredBy });
});

//import owner routes
const ownerRoute = require("./routes/owner.route");
const stockRoute = require("./routes/stock.route");
const salesRepRoute = require("./routes/salesRep.route");
const customerRoute = require("./routes/customer.route");
const branchRoute = require("./routes/branch.route");
const reportRoute = require("./routes/report.route");
const excelRoute = require("./routes/excel.route");

//owner routes
app.use("/api/owner", ownerRoute);
app.use("/api/stock", stockRoute);
app.use("/api/salesrep", salesRepRoute);
app.use("/api/customer", customerRoute);
app.use("/api/branch", branchRoute);
app.use("/api/reports", reportRoute);
app.use("/api/excel", excelRoute);

//import sales rep routes
const s_salesRepRoute = require("./routes/s_salesRep.route");
const s_invoiceRoute = require("./routes/s_invoice.route");
const s_tempStockRoute = require("./routes/s_tempStock.route");
const s_primaryStockRoute = require("./routes/s_primaryStock.route");
const s_customerRoute = require("./routes/s_customer.route");

//sales rep routes
app.use("/api/sales/salesrep", s_salesRepRoute);
app.use("/api/sales/invoice", s_invoiceRoute);
app.use("/api/sales/tempStock", s_tempStockRoute);
app.use("/api/sales/primaryStock", s_primaryStockRoute);
app.use("/api/sales/customer", s_customerRoute);

app.get("/api/test", (req, res) => {
  res.json({ message: "Welcome to Owner test Server!" });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`CJ Server is running on port ${PORT} `);
  dbConnection();
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

module.exports = app;
