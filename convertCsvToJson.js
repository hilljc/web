const fs = require('fs');
const path = require('path');

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

// Convert CSV files to JSON
function convertCsvToJson() {
    const csvFiles = ['artists', 'venues', 'shows'];
    
    csvFiles.forEach(file => {
        try {
            const csvPath = path.join(__dirname, 'server', 'data', `${file}.csv`);
            const csvData = fs.readFileSync(csvPath, 'utf8');
            const jsonData = parseCSV(csvData);
            
            // Write JSON to public folder
            const jsonPath = path.join(__dirname, 'public', 'data', `${file}.json`);
            fs.writeFileSync(jsonPath, JSON.stringify(jsonData, null, 2), 'utf8');
            console.log(`Converted ${file}.csv to ${file}.json successfully!`);
        } catch (error) {
            console.error(`Error processing ${file}.csv:`, error);
        }
    });
    
    // Create a joined shows file that includes artist and venue details
    try {
        // Read all JSON files
        const showsPath = path.join(__dirname, 'public', 'data', 'shows.json');
        const artistsPath = path.join(__dirname, 'public', 'data', 'artists.json');
        const venuesPath = path.join(__dirname, 'public', 'data', 'venues.json');
        
        const shows = JSON.parse(fs.readFileSync(showsPath, 'utf8'));
        const artists = JSON.parse(fs.readFileSync(artistsPath, 'utf8'));
        const venues = JSON.parse(fs.readFileSync(venuesPath, 'utf8'));
        
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
        const joinedShows = shows.map(show => {
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
        
        // Write joined shows to public folder
        const joinedShowsPath = path.join(__dirname, 'public', 'data', 'joinedShows.json');
        fs.writeFileSync(joinedShowsPath, JSON.stringify(joinedShows, null, 2), 'utf8');
        console.log('Created joinedShows.json successfully!');
    } catch (error) {
        console.error('Error creating joined shows JSON:', error);
    }
}

convertCsvToJson();
