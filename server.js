const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.static('.')); // Serve static files from current directory

// Route to get all shows
app.get('/api/shows', (req, res) => {
    try {
        const csvFilePath = path.join(__dirname, 'shows.csv');
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        
        // Parse CSV and return as JSON
        const shows = parseCSV(csvData);
        res.json(shows);
    } catch (error) {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ error: 'Failed to read shows data' });
    }
});

// Route to save shows data
app.post('/api/shows', (req, res) => {
    try {
        const shows = req.body;
        const csvData = convertToCSV(shows);
        
        const csvFilePath = path.join(__dirname, 'shows.csv');
        fs.writeFileSync(csvFilePath, csvData, 'utf8');
        
        res.json({ success: true, message: 'Shows data saved successfully' });
    } catch (error) {
        console.error('Error writing to CSV file:', error);
        res.status(500).json({ error: 'Failed to save shows data' });
    }
});

// Helper function to parse CSV
function parseCSV(csvString) {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const show = {};
        
        headers.forEach((header, index) => {
            // Convert id to number
            if (header === 'id') {
                show[header] = parseInt(values[index]);
            } else {
                show[header] = values[index];
            }
        });
        
        return show;
    });
}

// Helper function to convert shows to CSV
function convertToCSV(shows) {
    const headers = Object.keys(shows[0]).join(',');
    const rows = shows.map(show => {
        return Object.values(show).join(',');
    });
    
    return [headers, ...rows].join('\n');
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});