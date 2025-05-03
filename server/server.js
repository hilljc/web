const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../public'))); // Serve static files from public directory

// Route to get all artists
app.get('/api/artists', (req, res) => {
    try {
        const csvFilePath = path.join(__dirname, 'data/artists.csv');
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        
        // Parse CSV and return as JSON
        const artists = parseCSV(csvData);
        res.json(artists);
    } catch (error) {
        console.error('Error reading artists CSV file:', error);
        res.status(500).json({ error: 'Failed to read artists data' });
    }
});

// Route to get a specific artist by ID
app.get('/api/artists/:id', (req, res) => {
    try {
        const artistId = parseInt(req.params.id);
        const csvFilePath = path.join(__dirname, 'data/artists.csv');
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        
        const artists = parseCSV(csvData);
        const artist = artists.find(a => a.id === artistId);
        
        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }
        
        res.json(artist);
    } catch (error) {
        console.error('Error retrieving artist data:', error);
        res.status(500).json({ error: 'Failed to retrieve artist data' });
    }
});

// Route to get all venues
app.get('/api/venues', (req, res) => {
    try {
        const csvFilePath = path.join(__dirname, 'data/venues.csv');
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        
        // Parse CSV and return as JSON
        const venues = parseCSV(csvData);
        res.json(venues);
    } catch (error) {
        console.error('Error reading venues CSV file:', error);
        res.status(500).json({ error: 'Failed to read venues data' });
    }
});

// Route to get a specific venue by ID
app.get('/api/venues/:id', (req, res) => {
    try {
        const venueId = parseInt(req.params.id);
        const csvFilePath = path.join(__dirname, 'data/venues.csv');
        const csvData = fs.readFileSync(csvFilePath, 'utf8');
        
        const venues = parseCSV(csvData);
        const venue = venues.find(v => v.id === venueId);
        
        if (!venue) {
            return res.status(404).json({ error: 'Venue not found' });
        }
        
        res.json(venue);
    } catch (error) {
        console.error('Error retrieving venue data:', error);
        res.status(500).json({ error: 'Failed to retrieve venue data' });
    }
});

// Route to get all shows with joined artist and venue data
app.get('/api/shows', (req, res) => {
    try {
        // Read all three CSV files
        const showsPath = path.join(__dirname, 'data/shows.csv');
        const artistsPath = path.join(__dirname, 'data/artists.csv');
        const venuesPath = path.join(__dirname, 'data/venues.csv');
        
        const showsData = fs.readFileSync(showsPath, 'utf8');
        const artistsData = fs.readFileSync(artistsPath, 'utf8');
        const venuesData = fs.readFileSync(venuesPath, 'utf8');
        
        // Parse all three files
        const shows = parseCSV(showsData);
        const artists = parseCSV(artistsData);
        const venues = parseCSV(venuesData);
        
        // Create lookup maps for artists and venues
        const artistMap = artists.reduce((map, artist) => {
            map[artist.id] = artist;
            return map;
        }, {});
        
        const venueMap = venues.reduce((map, venue) => {
            map[venue.id] = venue;
            return map;
        }, {});
        
        // Join data
        let joinedShows = shows.map(show => {
            const artist = artistMap[show.artistId] || { name: 'Unknown Artist' };
            const venue = venueMap[show.venueId] || { name: 'Unknown Venue', address: 'No address' };
            
            return {
                id: show.id,
                artistId: show.artistId,
                venueId: show.venueId,
                date: show.date,
                time: show.time,
                ticketPrice: show.ticketPrice,
                bandName: artist.name,
                genre: artist.genre,
                venue: venue.name,
                address: venue.address,
                capacity: venue.capacity
            };
        });
        
        // Apply filters if provided
        if (req.query.artistId) {
            const artistId = parseInt(req.query.artistId);
            joinedShows = joinedShows.filter(show => show.artistId === artistId);
        }
        
        if (req.query.venueId) {
            const venueId = parseInt(req.query.venueId);
            joinedShows = joinedShows.filter(show => show.venueId === venueId);
        }
        
        if (req.query.date) {
            joinedShows = joinedShows.filter(show => show.date === req.query.date);
        }
        
        res.json(joinedShows);
    } catch (error) {
        console.error('Error reading and joining CSV data:', error);
        res.status(500).json({ error: 'Failed to read shows data' });
    }
});

// Route to save shows data
app.post('/api/shows', (req, res) => {
    try {
        const shows = req.body;
        
        // Extract only the columns that belong in the shows.csv file
        const showsToSave = shows.map(show => ({
            id: show.id,
            artistId: show.artistId,
            venueId: show.venueId,
            date: show.date,
            time: show.time,
            ticketPrice: show.ticketPrice || '0.00'
        }));
        
        const csvData = convertToCSV(showsToSave);
        
        const csvFilePath = path.join(__dirname, 'data/shows.csv');
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
        const item = {};
        
        headers.forEach((header, index) => {
            // Convert numeric values where appropriate
            if (header === 'id' || header === 'artistId' || header === 'venueId' || header === 'capacity' || header === 'formationYear') {
                item[header] = parseInt(values[index]);
            } else if (header === 'ticketPrice') {
                item[header] = parseFloat(values[index]);
            } else {
                item[header] = values[index];
            }
        });
        
        return item;
    });
}

// Helper function to convert data to CSV
function convertToCSV(items) {
    if (!items || items.length === 0) {
        return '';
    }
    
    const headers = Object.keys(items[0]).join(',');
    const rows = items.map(item => {
        return Object.values(item).join(',');
    });
    
    return [headers, ...rows].join('\n');
}

// Serve index.html for the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});