const mongoose = require('mongoose');

// Function to get the current month in "Month Year" format
function getCurrentMonth() {
    var currentDate = new Date();
    var monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[currentDate.getMonth()] + ' ' + currentDate.getFullYear();
}

// Define the daily report schema
const dailyReportSchema = new mongoose.Schema({
    currentDate: { 
        type: String, 
        required: true, 
        unique: true // Ensures only one record per day
    },
    currentTime: { 
        type: String, 
        required: true 
    },
    currentMonth: { 
        type: String, 
        default: getCurrentMonth 
    },
    totalSalesAmount: { 
        type: Number, 
        required: true 
    },
    totalMargin: { 
        type: Number, 
        required: true 
    },
    pieChartData: [
        {
            itemName: { 
                type: String, 
                required: true 
            },
            percentage: { 
                type: Number, 
                required: true 
            }
        }
    ]
});

// Pre-save hook to auto-generate currentMonth
dailyReportSchema.pre('save', function(next) {
    // Always set currentMonth before saving the document
    this.currentMonth = getCurrentMonth();
    next();
});

// Create a model using the schema
const DailyReport = mongoose.model('DailyReport', dailyReportSchema);

module.exports = DailyReport;

