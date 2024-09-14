const mongoose = require("mongoose");
const Invoice = require("../models/invoice.model");
const primaryStock = require("../models/primaryStock.model");
const DailyReport = require("../models/dailyReport.model");
const MonthlySummary = require("../models/MonthlySummary.model");
const SalesRep = require("../models/salesRep.model");

// Function to get the current date in the format used in the database
function getCurrentDate() {
    const currentDate = new Date();
    return (
        currentDate.getDate() +
        "/" +
        (currentDate.getMonth() + 1) +
        "/" +
        currentDate.getFullYear()
    );
}

// Function to get the start and end dates of the current month
function getCurrentMonthRange() {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { start, end };
}

// Controller functions
// exports.getSalesAndMargins = async (req, res) => {
//     try {
//         const today = getCurrentDate();
        
//         // Get daily sales
//         const invoices = await Invoice.find({ customDate: today });
//         const totalSalesAmount = invoices.reduce((total, invoice) => total + invoice.amount, 0);
        
//         // Collect all item names
//         const itemNames = invoices.flatMap(invoice => invoice.items.map(item => item.itemName));
//         const stockItems = await primaryStock.find({ itemName: { $in: itemNames } });
//         const stockItemMap = stockItems.reduce((map, stockItem) => {
//             map[stockItem.itemName] = stockItem;
//             return map;
//         }, {});
        
//         // Calculate total margin
//         let totalMargin = 0;
//         for (const invoice of invoices) {
//             for (const item of invoice.items) {
//                 const stockItem = stockItemMap[item.itemName];
//                 if (stockItem) {
//                     totalMargin += item.qty * stockItem.margin;
//                 }
//             }
//         }

//         // Calculate item percentages for pie chart
//         const itemAggregation = {};
//         invoices.forEach(invoice => {
//             invoice.items.forEach(item => {
//                 const itemKey = item.itemName;
//                 if (!itemAggregation[itemKey]) {
//                     itemAggregation[itemKey] = {
//                         totalQty: 0,
//                         totalAmount: 0
//                     };
//                 }
//                 const itemTotal = item.qty * item.price * ((100 - item.discount) / 100);
//                 itemAggregation[itemKey].totalQty += item.qty;
//                 itemAggregation[itemKey].totalAmount += itemTotal;
//             });
//         });

//         const grandTotalAmount = Object.values(itemAggregation).reduce((acc, item) => acc + item.totalAmount, 0);

//         const pieChartData = Object.keys(itemAggregation).map(itemName => {
//             const { totalAmount } = itemAggregation[itemName];
//             const percentage = (totalAmount / grandTotalAmount) * 100;
//             return {
//                 itemName,
//                 percentage
//             };
//         });

//         // Send combined response
//         res.status(200).json({
//             totalSalesAmount,
//             totalMargin,
//             pieChartData
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

// exports.getSalesAndMargins = async (req, res) => {
//     try {
//         const today = getCurrentDate();
        
//         // Get daily sales
//         const invoices = await Invoice.find({ customDate: today });
//         const totalSalesAmount = invoices.reduce((total, invoice) => total + invoice.amount, 0);
        
//         // Collect all item names
//         const itemNames = invoices.flatMap(invoice => invoice.items.map(item => item.itemName));
//         const stockItems = await primaryStock.find({ itemName: { $in: itemNames } });
//         const stockItemMap = stockItems.reduce((map, stockItem) => {
//             map[stockItem.itemName] = stockItem;
//             return map;
//         }, {});
        
//         // Calculate total margin
//         let totalMargin = 0;
//         for (const invoice of invoices) {
//             for (const item of invoice.items) {
//                 const stockItem = stockItemMap[item.itemName];
//                 if (stockItem) {
//                     totalMargin += item.qty * stockItem.margin;
//                 }
//             }
//         }

//         // Calculate item percentages for pie chart
//         const itemAggregation = {};
//         invoices.forEach(invoice => {
//             invoice.items.forEach(item => {
//                 const itemKey = item.itemName;
//                 if (!itemAggregation[itemKey]) {
//                     itemAggregation[itemKey] = {
//                         totalQty: 0,
//                         totalAmount: 0
//                     };
//                 }
//                 const itemTotal = item.qty * item.price * ((100 - item.discount) / 100);
//                 itemAggregation[itemKey].totalQty += item.qty;
//                 itemAggregation[itemKey].totalAmount += itemTotal;
//             });
//         });

//         const grandTotalAmount = Object.values(itemAggregation).reduce((acc, item) => acc + item.totalAmount, 0);

//         const pieChartData = Object.keys(itemAggregation).map(itemName => {
//             const { totalAmount } = itemAggregation[itemName];
//             const percentage = (totalAmount / grandTotalAmount) * 100;
//             return {
//                 itemName,
//                 percentage
//             };
//         });

//         function getCurrentDate() {
//             const currentDate = new Date();
//             return (
//               currentDate.getDate() +
//               "/" +
//               (currentDate.getMonth() + 1) +
//               "/" +
//               currentDate.getFullYear()
//             );
//           }
          
//           // Function to get the current time in the desired format
//           function getCurrentTime() {
//             const currentDate = new Date();
//             return (
//               currentDate.getHours() +
//               ":" +
//               currentDate.getMinutes() +
//               ":" +
//               currentDate.getSeconds()
//             );
//           }

//           function getCurrentMonth() {
//             const currentDatef = new Date();
//             const monthNames = [
//                 'January', 'February', 'March', 'April', 'May', 'June',
//                 'July', 'August', 'September', 'October', 'November', 'December'
//             ];
//             console.log(monthNames[currentDatef.getMonth()]);
//             return monthNames[currentDatef.getMonth()] + ' ' + currentDatef.getFullYear();
//         }

//         // Save the report to the new model
//         await DailyReport.findOneAndUpdate(
//             { currentDate: today }, // Find by currentDate
//             {
//                 currentTime: getCurrentTime(),
//                 totalSalesAmount,
//                 totalMargin,
//                 pieChartData
//             },
//             { upsert: true, new: true } // Create if not exists, return new document
//         );

        

//         // Send combined response
//         res.status(200).json({
//             totalSalesAmount,
//             totalMargin,
//             pieChartData
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };
// exports.getSalesAndMargins = async (req, res) => {
//   try {
//       const today = getCurrentDate();
      
//       // Get daily sales
//       const invoices = await Invoice.find({ customDate: today });
//       const totalSalesAmount = invoices.reduce((total, invoice) => total + invoice.amount, 0);
      
//       // Collect all item names
//       const itemNames = invoices.flatMap(invoice => invoice.items.map(item => item.itemName));
//       const stockItems = await primaryStock.find({ itemName: { $in: itemNames } });
//       const stockItemMap = stockItems.reduce((map, stockItem) => {
//           map[stockItem.itemName] = stockItem;
//           return map;
//       }, {});
      
//       // Calculate total margin
//       let totalMargin = 0;
//       for (const invoice of invoices) {
//           for (const item of invoice.items) {
//               const stockItem = stockItemMap[item.itemName];
//               if (stockItem) {
//                   totalMargin += item.qty * stockItem.margin;
//               }
//           }
//       }

//       // Calculate item percentages for pie chart
//       const itemAggregation = {};
//       invoices.forEach(invoice => {
//           invoice.items.forEach(item => {
//               const itemKey = item.itemName;
//               if (!itemAggregation[itemKey]) {
//                   itemAggregation[itemKey] = {
//                       totalQty: 0,
//                       totalAmount: 0
//                   };
//               }
//               const itemTotal = item.qty * item.price * ((100 - item.discount) / 100);
//               itemAggregation[itemKey].totalQty += item.qty;
//               itemAggregation[itemKey].totalAmount += itemTotal;
//           });
//       });

//       const grandTotalAmount = Object.values(itemAggregation).reduce((acc, item) => acc + item.totalAmount, 0);

//       const pieChartData = Object.keys(itemAggregation).map(itemName => {
//           const { totalAmount } = itemAggregation[itemName];
//           const percentage = (totalAmount / grandTotalAmount) * 100;
//           return {
//               itemName,
//               percentage
//           };
//       });

//       function getCurrentDate() {
//           const currentDate = new Date();
//           return (
//             currentDate.getDate() +
//             "/" +
//             (currentDate.getMonth() + 1) +
//             "/" +
//             currentDate.getFullYear()
//           );
//         }
        
//         // Function to get the current time in the desired format
//         function getCurrentTime() {
//           const currentDate = new Date();
//           return (
//             currentDate.getHours() +
//             ":" +
//             currentDate.getMinutes() +
//             ":" +
//             currentDate.getSeconds()
//           );
//         }

//         function getCurrentMonth() {
//           const currentDatef = new Date();
//           const monthNames = [
//               'January', 'February', 'March', 'April', 'May', 'June',
//               'July', 'August', 'September', 'October', 'November', 'December'
//           ];
//           console.log(monthNames[currentDatef.getMonth()]);
//           return monthNames[currentDatef.getMonth()] + ' ' + currentDatef.getFullYear();
//       }

//       // Save the report to the new model
//       await DailyReport.findOneAndUpdate(
//           { currentDate: today }, // Find by currentDate
//           {
//               currentTime: getCurrentTime(),
//               totalSalesAmount,
//               totalMargin,
//               pieChartData
//           },
//           { upsert: true, new: true } // Create if not exists, return new document
//       );

      

//       // Send combined response
//       res.status(200).json({
//           totalSalesAmount,
//           totalMargin,
//           pieChartData
//       });

//   } catch (error) {
//       // Check for duplicate key error
//       if (error.code === 11000) {
//           return res.status(400).json({
//               message: 'Duplicate entry for the current date.'
//           });
//       }

//       console.error(error);
//       res.status(500).json({ message: 'Server error' });
//   }
// };

exports.getSalesAndMargins = async (req, res) => {
  try {
      const today = getCurrentDate();
      console.log(today);

      // Get daily sales
      const invoices = await Invoice.find({ customDate: today });
      console.log(invoices);
      const totalSalesAmount = invoices.reduce((total, invoice) => total + invoice.amount, 0);

      // Collect all item names
      const itemNames = invoices.flatMap(invoice => invoice.items.map(item => item.itemName));
      const stockItems = await primaryStock.find({ itemName: { $in: itemNames } });
      const stockItemMap = stockItems.reduce((map, stockItem) => {
          map[stockItem.itemName] = stockItem;
          return map;
      }, {});

      // Calculate total margin
      let totalMargin = 0;
      for (const invoice of invoices) {
          for (const item of invoice.items) {
              const stockItem = stockItemMap[item.itemName];
              if (stockItem) {
                  const margin = parseFloat(stockItem.margin || 0); // Ensure margin is a valid number
                  totalMargin += item.qty * margin;
              }
          }
      }

      // Calculate item percentages for pie chart
      const itemAggregation = {};
      invoices.forEach(invoice => {
          invoice.items.forEach(item => {
              const itemKey = item.itemName;
              if (!itemAggregation[itemKey]) {
                  itemAggregation[itemKey] = {
                      totalQty: 0,
                      totalAmount: 0
                  };
              }
              const itemTotal = item.qty * item.price * ((100 - item.discount) / 100);
              itemAggregation[itemKey].totalQty += item.qty;
              itemAggregation[itemKey].totalAmount += itemTotal;
          });
      });
      console.log(itemAggregation);

      const grandTotalAmount = Object.values(itemAggregation).reduce((acc, item) => acc + item.totalAmount, 0);
      console.log(grandTotalAmount);

      const pieChartData = Object.keys(itemAggregation).map(itemName => {
          const { totalAmount } = itemAggregation[itemName];
          const percentage = (totalAmount / grandTotalAmount) * 100;
          return {
              itemName,
              percentage
          };
      });
      console.log(pieChartData);

      // Save the report to the DailyReport model
      await DailyReport.findOneAndUpdate(
          { currentDate: today }, // Find by currentDate
          {
              currentTime: getCurrentTime(),
              totalSalesAmount,
              totalMargin,
              pieChartData
          },
          { upsert: true, new: true } // Create if not exists, return new document
      );

      // Send combined response
      res.status(200).json({
          totalSalesAmount,
          totalMargin,
          pieChartData
      });

  } catch (error) {
      // Check for duplicate key error
      if (error.code === 11000) {
          return res.status(400).json({
              message: 'Duplicate entry for the current date.'
          });
      }

      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
};

// Utility functions for getting current date and time
function getCurrentDate() {
  const currentDate = new Date();
  return (
      currentDate.getDate() +
      "/" +
      (currentDate.getMonth() + 1) +
      "/" +
      currentDate.getFullYear()
  );
}

function getCurrentTime() {
  const currentDate = new Date();
  return (
      currentDate.getHours() +
      ":" +
      currentDate.getMinutes() +
      ":" +
      currentDate.getSeconds()
  );
}




// exports.getMonthlyReport = async (req, res) => {
//     try {
//         const { start, end } = getCurrentMonthRange();
//         const invoices = await Invoice.find({ customDate: { $gte: start, $lte: end } });
        
//         if (!invoices.length) {
//             return res.status(404).json({ message: 'No invoices found for the current month' });
//         }

//         const totalSalesAmount = invoices.reduce((total, invoice) => total + invoice.amount, 0);

//         const itemNames = invoices.flatMap(invoice => invoice.items.map(item => item.itemName));
//         const stockItems = await primaryStock.find({ itemName: { $in: itemNames } });
//         const stockItemMap = stockItems.reduce((map, stockItem) => {
//             map[stockItem.itemName] = stockItem;
//             return map;
//         }, {});

//         let totalMargin = 0;
//         for (const invoice of invoices) {
//             for (const item of invoice.items) {
//                 const stockItem = stockItemMap[item.itemName];
//                 if (stockItem) {
//                     totalMargin += item.qty * stockItem.margin;
//                 }
//             }
//         }

//         const itemAggregation = {};
//         invoices.forEach(invoice => {
//             invoice.items.forEach(item => {
//                 const itemKey = item.itemName;
//                 if (!itemAggregation[itemKey]) {
//                     itemAggregation[itemKey] = {
//                         totalQty: 0,
//                         totalAmount: 0
//                     };
//                 }
//                 const itemTotal = item.qty * item.price * ((100 - item.discount) / 100);
//                 itemAggregation[itemKey].totalQty += item.qty;
//                 itemAggregation[itemKey].totalAmount += itemTotal;
//             });
//         });

//         const grandTotalAmount = Object.values(itemAggregation).reduce((acc, item) => acc + item.totalAmount, 0);

//         const pieChartData = Object.keys(itemAggregation).map(itemName => {
//             const { totalAmount } = itemAggregation[itemName];
//             const percentage = (totalAmount / grandTotalAmount) * 100;
//             return {
//                 itemName,
//                 percentage
//             };
//         });

//         res.status(200).json({
//             totalSalesAmount,
//             totalMargin,
//             pieChartData
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


// exports.getMonthlyReport = async (req, res) => {
//     try {
//         const now = new Date();
//         const start = new Date(now.getFullYear(), now.getMonth(), 1);
//         const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

//         // Find invoices within the current month
//         const invoices = await Invoice.find({ customDate: { $gte: start, $lte: end } });

//         if (!invoices.length) {
//             return res.status(404).json({ message: 'No invoices found for the current month' });
//         }

//         // Aggregate daily data
//         const dailyData = {};
//         invoices.forEach(invoice => {
//             const date = new Date(invoice.customDate);
//             const day = date.getDate();
//             const key = `${date.getFullYear()}-${date.getMonth() + 1}-${day}`;

//             if (!dailyData[key]) {
//                 dailyData[key] = {
//                     totalSalesAmount: 0,
//                     totalMargin: 0,
//                     itemAggregation: {}
//                 };
//             }

//             // Calculate total sales amount for the day
//             dailyData[key].totalSalesAmount += invoice.amount;

//             // Calculate total margin for the day
//             invoice.items.forEach(item => {
//                 if (!dailyData[key].itemAggregation[item.itemName]) {
//                     dailyData[key].itemAggregation[item.itemName] = {
//                         totalQty: 0,
//                         totalAmount: 0
//                     };
//                 }
//                 const stockItem = stockItemsMap[item.itemName];
//                 if (stockItem) {
//                     dailyData[key].totalMargin += item.qty * stockItem.margin;
//                 }
//                 const itemTotal = item.qty * item.price * ((100 - item.discount) / 100);
//                 dailyData[key].itemAggregation[item.itemName].totalQty += item.qty;
//                 dailyData[key].itemAggregation[item.itemName].totalAmount += itemTotal;
//             });
//         });

//         // Calculate daily item percentages
//         const dailyPieChartData = {};
//         for (const [day, data] of Object.entries(dailyData)) {
//             const grandTotalAmount = Object.values(data.itemAggregation).reduce((acc, item) => acc + item.totalAmount, 0);
//             dailyPieChartData[day] = Object.keys(data.itemAggregation).map(itemName => {
//                 const { totalAmount } = data.itemAggregation[itemName];
//                 const percentage = grandTotalAmount ? (totalAmount / grandTotalAmount) * 100 : 0;
//                 return {
//                     itemName,
//                     percentage
//                 };
//             });
//         }

//         // Send response with daily data
//         res.status(200).json({
//             dailyData,
//             dailyPieChartData
//         });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };


// Export the getMonthlyReport function
exports.getMonthlyReport = async (req, res) => {

  function getCurrentDate() {
    const currentDate = new Date();
    return (
      currentDate.getDate().toString().padStart(2, '0') + // Ensures two-digit format for day
      "/" +
      (currentDate.getMonth() + 1).toString().padStart(2, '0') + // Ensures two-digit format for month
      "/" +
      currentDate.getFullYear()
    );
  }
  
  // Function to get the current time in the desired format (HH:MM:SS)
  function getCurrentTime() {
    const currentDate = new Date();
    return (
      currentDate.getHours().toString().padStart(2, '0') + // Ensures two-digit format for hours
      ":" +
      currentDate.getMinutes().toString().padStart(2, '0') + // Ensures two-digit format for minutes
      ":" +
      currentDate.getSeconds().toString().padStart(2, '0') // Ensures two-digit format for seconds
    );
  }

  try {
    // Get current date
    const currentDate = new Date();
    
    // Calculate the start and end of the current month
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    console.log(startOfMonth);
    console.log(endOfMonth);
    
    // Fetch all reports for the current month
    const monthlyReports = await DailyReport.find();

    console.log(monthlyReports);
    
    // Calculate total sales and margin for the month
    let totalSalesAmount = 0;
    let totalMargin = 0;
    
    // Object to store consolidated pie chart data
    const pieChartConsolidation = {};
    
    monthlyReports.forEach(report => {
      totalSalesAmount += report.totalSalesAmount;
      totalMargin += report.totalMargin;
      
      // Aggregate pie chart data
      report.pieChartData.forEach(item => {
        if (pieChartConsolidation[item.itemName]) {
          pieChartConsolidation[item.itemName] += item.percentage;
        } else {
          pieChartConsolidation[item.itemName] = item.percentage;
        }
      });
    });
    
    // Convert pieChartConsolidation object to array format
    const consolidatedPieChartData = Object.entries(pieChartConsolidation).map(([itemName, percentage]) => ({
      itemName,
      percentage
    }));
    
    // Construct the monthly report summary
    const monthlySummary = {
      month: currentDate.toLocaleString('default', { month: 'long' }), // e.g., "August"
      year: currentDate.getFullYear(),
      totalSalesAmount,
      totalMargin,
      pieChartData: consolidatedPieChartData,
      reportGeneratedDate: getCurrentDate(), // Current date in DD/MM/YYYY format
      reportGeneratedTime: getCurrentTime(), // Current time in HH:MM:SS format
    };
    
    // Save the monthly summary to the database
    const savedSummary = await MonthlySummary.findOneAndUpdate(
      { month: monthlySummary.month, year: monthlySummary.year },
      monthlySummary,
      { upsert: true, new: true }
    );
    
    // Return the summarized data
    res.status(200).json(savedSummary);
  } catch (error) {
    // Handle errors and send response
    console.error('Error fetching monthly report summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }


  
};


// Get the monthly summary fetch all data
exports.findAllMonthlySummaries = async (req, res,next) => {
  try {
    // Fetch all documents from the MonthlySummary collection
    const monthlySummaries = await MonthlySummary.find();

    // Send the result as a response
    res.status(200).json({
      success: true,
      data: monthlySummaries,
    });
  } catch (error) {
    // Handle any errors during the database operation
    res.status(500).json({
      success: false,
      message: 'Error retrieving monthly summaries',
      error: error.message,
    });
  }
};



// Controller function to find all daily reports
exports.findAllDailyReports = async (req, res) => {
  try {
      // Fetch all daily reports from the database
      const dailyReports = await DailyReport.find();

      // Send the fetched reports as a response
      res.status(200).json({
          success: true,
          message: "Daily reports retrieved successfully",
          data: dailyReports
      });
  } catch (error) {
      // Handle any errors that occur during fetching
      console.error("Error retrieving daily reports:", error);
      res.status(500).json({
          success: false,
          message: "Failed to retrieve daily reports",
          error: error.message
      });
  }
};



  
  // Helper function to format date as 'd/m/yyyy'
  function formatDate(date) {
    return (
      date.getDate() +
      "/" +
      (date.getMonth() + 1) +
      "/" +
      date.getFullYear()
    );
  }



  // exports.getBranchWiseSalesAndMargin = async (req, res) => {
  //   try {
  //     // Fetch all invoices from the database and populate branch details
  //     const invoices = await Invoice.find({}).populate("branchName", "branchName");

  //     console.log(invoices);
  
  //     // Initialize variables to hold overall total sales and margin
  //     let overallTotalSales = 0;
  //     let overallTotalMargin = 0;
  
  //     // Create a map to store sales and margins for each branch
  //     const branchSalesData = {};
  
  //     // Iterate over each invoice
  //     invoices.forEach((invoice) => {
  //       const branchName = invoice.branchId.branchName;
  //       console.log(branchName);
  
  //       if (!branchSalesData[branchName]) {
  //         branchSalesData[branchName] = {
  //           totalSales: 0,
  //           totalMargin: 0,
  //         };
  //       }
  
  //       // Accumulate sales and calculate margins for each branch
  //       branchSalesData[branchName].totalSales += invoice.amount;
  //       overallTotalSales += invoice.amount;
  
  //       invoice.items.forEach((item) => {
  //         const sellingPrice = item.price;
  //         const discount = item.discount;
  //         const qty = item.qty;
  
  //         // Calculate the price after discount
  //         const priceAfterDiscount = sellingPrice * (1 - discount / 100);
  
  //         // Assuming a cost price for margin calculation
  //         // Replace this with your actual cost price logic if available
  //         const costPrice = sellingPrice * 0.8; // Assuming 20% margin
  
  //         // Calculate the total cost for each item
  //         const itemCost = costPrice * qty;
  
  //         // Calculate the total price after discount for each item
  //         const itemSales = priceAfterDiscount * qty;
  
  //         // Calculate margin
  //         const itemMargin = (itemSales - itemCost);
  
  //         // Accumulate total margin for the branch
  //         branchSalesData[branchName].totalMargin += itemMargin;
  //         overallTotalMargin += itemMargin;
  //       });
  //     });
  
  //     // Calculate overall average margin percentage
  //     const overallAverageMarginPercentage = (
  //       (overallTotalMargin / overallTotalSales) *
  //       100
  //     ).toFixed(2);
  
  //     // Prepare the response data
  //     const branchWiseData = Object.keys(branchSalesData).map((branchName) => {
  //       const totalSales = branchSalesData[branchName].totalSales;
  //       const totalMargin = branchSalesData[branchName].totalMargin;
  //       const averageMarginPercentage = (
  //         (totalMargin / totalSales) *
  //         100
  //       ).toFixed(2);
  
  //       return {
  //         branchName,
  //         totalSales: totalSales.toFixed(2),
  //         totalMargin: totalMargin.toFixed(2),
  //         averageMarginPercentage: `${averageMarginPercentage}%`,
  //       };
  //     });
  
  //     // Send response with overall and branch-wise data
  //     res.status(200).json({
  //       status: "success",
  //       data: {
  //         overall: {
  //           totalSales: overallTotalSales.toFixed(2),
  //           totalMargin: overallTotalMargin.toFixed(2),
  //           overallAverageMarginPercentage: `${overallAverageMarginPercentage}%`,
  //         },
  //         branches: branchWiseData,
  //       },
  //     });
  //   } catch (error) {
  //     // Handle any errors
  //     res.status(500).json({
  //       status: "error",
  //       message: error.message,
  //     });
  //   }
  // };


  exports.getBranchWiseSalesAndMargin = async (req, res) => {
    try {
      // Fetch all invoices from the database and populate branch details
      const invoices = await Invoice.find();

      console.log(invoices);
  
      // Initialize variables to hold overall total sales and margin
      let overallTotalSales = 0;
      let overallTotalMargin = 0;
  
      // Create a map to store sales and margins for each branch
      const branchSalesData = {};
  
      // Iterate over each invoice
      invoices.forEach((invoice) => {
        // Correctly access the populated branch name
        const branchName = invoice.branchname;
        
        if (!branchSalesData[branchName]) {
          branchSalesData[branchName] = {
            totalSales: 0,
            totalMargin: 0,
          };
        }
  
        // Accumulate sales and calculate margins for each branch
        branchSalesData[branchName].totalSales += invoice.amount;
        overallTotalSales += invoice.amount;
  
        invoice.items.forEach((item) => {
          const sellingPrice = item.price;
          const discount = item.discount;
          const qty = item.qty;
  
          // Calculate the price after discount
          const priceAfterDiscount = sellingPrice * (1 - discount / 100);
  
          // Assuming a cost price for margin calculation
          // Replace this with your actual cost price logic if available
          const costPrice = sellingPrice * 0.8; // Assuming 20% margin
  
          // Calculate the total cost for each item
          const itemCost = costPrice * qty;
  
          // Calculate the total price after discount for each item
          const itemSales = priceAfterDiscount * qty;
  
          // Calculate margin
          const itemMargin = (itemSales - itemCost);
  
          // Accumulate total margin for the branch
          branchSalesData[branchName].totalMargin += itemMargin;
          overallTotalMargin += itemMargin;
        });
      });
  
      // Calculate overall average margin percentage
      const overallAverageMarginPercentage = (
        (overallTotalMargin / overallTotalSales) *
        100
      ).toFixed(2);
  
      // Prepare the response data
      const branchWiseData = Object.keys(branchSalesData).map((branchName) => {
        const totalSales = branchSalesData[branchName].totalSales;
        const totalMargin = branchSalesData[branchName].totalMargin;
        const averageMarginPercentage = (
          (totalMargin / totalSales) *
          100
        ).toFixed(2);
  
        return {
          branchName,
          totalSales: totalSales.toFixed(2),
          totalMargin: totalMargin.toFixed(2),
          averageMarginPercentage: `${averageMarginPercentage}%`,
        };
      });
  
      // Send response with overall and branch-wise data
      res.status(200).json({
        status: "success",
        data: {
          overall: {
            totalSales: overallTotalSales.toFixed(2),
            totalMargin: overallTotalMargin.toFixed(2),
            overallAverageMarginPercentage: `${overallAverageMarginPercentage}%`,
          },
          branches: branchWiseData,
        },
      });
    } catch (error) {
      // Handle any errors
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  };
  


  // Controller to get sales data for each SalesRep
exports.getSalesDataForSalesReps = async (req, res) => {
  try {
    // Fetch all sales reps
    const salesReps = await SalesRep.find();

    // Prepare an array to store the sales data for each sales rep
    const salesData = [];

    for (const salesRep of salesReps) {
      // Fetch all invoices for the current sales rep
      const invoices = await Invoice.find({ salesRepId: salesRep._id });

      // Calculate total sales and margin
      let totalSales = 0;
      let totalMargin = 0;

      invoices.forEach((invoice) => {
        totalSales += invoice.amount;

        // Calculate margin for each invoice
        invoice.items.forEach((item) => {
          const costPrice = item.price * ((100 - item.discount) / 100);
          const margin = item.price - costPrice;
          totalMargin += margin * item.qty;
        });
      });

      // Push the sales data for the current sales rep into the array
      salesData.push({
        salesRepId: salesRep._id,
        salesRepName: salesRep.name,
        totalSales: totalSales,
        totalMargin: totalMargin,
        numberOfInvoices: invoices.length,
        salesRepDetails: {
          nic: salesRep.nic,
          address: salesRep.address,
          dob: salesRep.dob,
          mobileNumber: salesRep.mobileNumber,
          email: salesRep.email,
        },
      });
    }

    // Send the response with the sales data
    res.status(200).json({
      success: true,
      salesData: salesData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching sales data",
      error: error.message,
    });
  }
};
