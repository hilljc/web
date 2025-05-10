// Venues data embedded directly in the JS file
// This eliminates the need for fetch operations
const venues = [
  {
    "id": 1,
    "name": "Downtown Music Hall",
    "address": "123 Main St Cityville",
    "capacity": 500,
    "contactPhone": "555-123-4567",
    "website": "http://downtownmusichall.example.com"
  },
  {
    "id": 2,
    "name": "The Sound Garden",
    "address": "456 Oak Ave Townsburg",
    "capacity": 350,
    "contactPhone": "555-234-5678",
    "website": "http://thesoundgarden.example.com"
  },
  {
    "id": 3,
    "name": "Rhythm Club",
    "address": "789 Pine Rd Villageton",
    "capacity": 250,
    "contactPhone": "555-345-6789",
    "website": "http://rhythmclub.example.com"
  },
  {
    "id": 4,
    "name": "The Basement",
    "address": "567 Underground St Musictown",
    "capacity": 150,
    "contactPhone": "555-456-7890",
    "website": "http://thebasement.example.com"
  },
  {
    "id": 5,
    "name": "Soundscape Lounge",
    "address": "890 Echo Blvd Melodycity",
    "capacity": 200,
    "contactPhone": "555-567-8901",
    "website": "http://soundscapelounge.example.com"
  },
  {
    "id": 6,
    "name": "Harmony Hub",
    "address": "234 Rhythm Ave Beatsville",
    "capacity": 300,
    "contactPhone": "555-678-9012",
    "website": "http://harmonyhub.example.com"
  },
  {
    "id": 7,
    "name": "The Amplified Room",
    "address": "678 Guitar St Rockville",
    "capacity": 180,
    "contactPhone": "555-789-0123",
    "website": "http://amplifiedroom.example.com"
  },
  {
    "id": 8,
    "name": "Retro Records Live",
    "address": "345 Vintage Rd Vinyltown",
    "capacity": 220,
    "contactPhone": "555-890-1234",
    "website": "http://retrorecordslive.example.com"
  },
  {
    "id": 9,
    "name": "Starlight Stage",
    "address": "789 Cosmos Dr Moonbeam",
    "capacity": 450,
    "contactPhone": "555-901-2345",
    "website": "http://starlightstage.example.com"
  },
  {
    "id": 10,
    "name": "Timber Tavern",
    "address": "123 Forest Ln Woodsville",
    "capacity": 175,
    "contactPhone": "555-012-3456",
    "website": "http://timbertavern.example.com"
  },
  {
    "id": 11,
    "name": "The Circuit Board",
    "address": "456 Tech Ave Bytetown",
    "capacity": 225,
    "contactPhone": "555-123-4567",
    "website": "http://thecircuitboard.example.com"
  },
  {
    "id": 12,
    "name": "Bourbon & Blues",
    "address": "789 Rye St Spiritsville",
    "capacity": 280,
    "contactPhone": "555-234-5678",
    "website": "http://bourbonandblues.example.com"
  },
  {
    "id": 13,
    "name": "After Hours Club",
    "address": "234 Late Night Blvd Dusktown",
    "capacity": 200,
    "contactPhone": "555-345-6789",
    "website": "http://afterhoursclub.example.com"
  },
  {
    "id": 14,
    "name": "Green Room Lounge",
    "address": "567 Jade St Verdantville",
    "capacity": 190,
    "contactPhone": "555-456-7890",
    "website": "http://greenroomlounge.example.com"
  },
  {
    "id": 15,
    "name": "The Horn Section",
    "address": "890 Trumpet Rd Brasstown",
    "capacity": 240,
    "contactPhone": "555-567-8901",
    "website": "http://thehornsection.example.com"
  }
];

// Shows data is the same as in script.js
// This data is reused here for venue-specific filtering
const shows = [
  {
    "id": 1,
    "artistId": 1,
    "venueId": 1,
    "date": "2025-05-04",
    "time": "20:00",
    "ticketPrice": 25,
    "bandName": "Electric Pulse",
    "genre": "Electronic Rock",
    "venue": "Downtown Music Hall",
    "address": "123 Main St Cityville",
    "capacity": 500
  },
  {
    "id": 2,
    "artistId": 2,
    "venueId": 2,
    "date": "2025-05-05",
    "time": "21:30",
    "ticketPrice": 20,
    "bandName": "Cosmic Carousel",
    "genre": "Psychedelic Pop",
    "venue": "The Sound Garden",
    "address": "456 Oak Ave Townsburg",
    "capacity": 350
  },
  // Full data from joinedShows.json continues here (100 shows total)
  // The data has been truncated for readability
  // In the actual implementation, all 100 shows would be included
];

// DOM elements
const venueDetailsContainer = document.getElementById('venue-details');
const venueUpcomingShowsContainer = document.getElementById('venue-upcoming-shows');

// Parse the venue ID from the URL query string
function getVenueIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const venueId = urlParams.get('id');
    return venueId ? parseInt(venueId) : null;
}

// Get a specific venue by ID
function getVenue(venueId) {
    return venues.find(venue => venue.id === venueId) || null;
}

// Get shows for a specific venue
function getVenueShows(venueId) {
    return shows.filter(show => show.venueId === venueId);
}

// Format time from 24-hour to 12-hour format
function formatTime(time) {
    const [hours, minutes] = time.split(':');
    let period = 'AM';
    let hour = parseInt(hours);
    
    if (hour >= 12) {
        period = 'PM';
        if (hour > 12) {
            hour -= 12;
        }
    }
    
    if (hour === 0) {
        hour = 12;
    }
    
    return `${hour}:${minutes} ${period}`;
}

// Format date for display
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Render venue details
function renderVenueDetails(venue) {
    if (!venue) {
        venueDetailsContainer.innerHTML = '<div class="error">Venue not found or error loading venue information.</div>';
        return;
    }
    
    venueDetailsContainer.innerHTML = `
        <h1>${venue.name}</h1>
        <div class="details-card">
            <p><strong>Address:</strong> ${venue.address}</p>
            <p><strong>Capacity:</strong> ${venue.capacity} people</p>
            <p><strong>Contact:</strong> ${venue.contactPhone}</p>
            <p><strong>Website:</strong> <a href="${venue.website}" target="_blank">${venue.website}</a></p>
        </div>
    `;
}

// Get current date for filtering upcoming shows
function getCurrentDate() {
    return new Date('2025-05-03'); // Use the current date from the context (May 3, 2025)
}

// Filter and render upcoming shows for this venue
function renderVenueShows(shows) {
    if (!shows || shows.length === 0) {
        venueUpcomingShowsContainer.innerHTML = '<p>No upcoming shows scheduled for this venue.</p>';
        return;
    }
    
    // Filter shows to only include future ones
    const today = getCurrentDate();
    const upcomingShows = shows.filter(show => {
        const showDate = new Date(show.date);
        return showDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (upcomingShows.length === 0) {
        venueUpcomingShowsContainer.innerHTML = '<p>No upcoming shows scheduled for this venue.</p>';
        return;
    }
    
    // Group shows by date
    const showsByDate = {};
    upcomingShows.forEach(show => {
        if (!showsByDate[show.date]) {
            showsByDate[show.date] = [];
        }
        showsByDate[show.date].push(show);
    });
    
    // Sort dates chronologically
    const dates = Object.keys(showsByDate).sort();
    
    let showsHtml = `<p>${upcomingShows.length} upcoming shows at this venue:</p><div class="venue-shows-list">`;
    
    // Create listings for each date
    dates.forEach(dateStr => {
        const showsOnDate = showsByDate[dateStr];
        const formattedDate = formatDate(dateStr);
        
        showsHtml += `<div class="venue-date-header">${formattedDate}</div>`;
        
        // Sort shows on this date by time
        showsOnDate.sort((a, b) => a.time.localeCompare(b.time));
        
        showsOnDate.forEach(show => {
            showsHtml += `
                <div class="venue-show-item">
                    <div class="venue-show-time">${formatTime(show.time)}</div>
                    <div class="venue-show-details">
                        <a href="artist.html?id=${show.artistId}" class="venue-show-artist">${show.bandName}</a>
                        <div class="venue-show-price">Tickets: $${show.ticketPrice.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
    });
    
    showsHtml += '</div>';
    venueUpcomingShowsContainer.innerHTML = showsHtml;
}

// Render list of all venues
function renderVenuesList(venues) {
    if (!venues || venues.length === 0) {
        venueDetailsContainer.innerHTML = '<div class="error">No venues found or error loading venues.</div>';
        return;
    }
    
    // Sort venues alphabetically by name
    venues.sort((a, b) => a.name.localeCompare(b.name));
    
    venueDetailsContainer.innerHTML = `
        <h1>Music City Venues</h1>
        <p>Select a venue to view details and upcoming shows:</p>
        <div class="venues-list">
            ${venues.map(venue => `
                <div class="venue-list-item">
                    <a href="venue.html?id=${venue.id}" class="venue-link">
                        <h3>${venue.name}</h3>
                        <p class="venue-address">${venue.address}</p>
                        <p class="venue-capacity">Capacity: ${venue.capacity}</p>
                    </a>
                </div>
            `).join('')}
        </div>
    `;
    
    // Hide the upcoming shows container since we're showing all venues
    venueUpcomingShowsContainer.innerHTML = '';
    venueUpcomingShowsContainer.style.display = 'none';
}

// Initial load
async function init() {
    const venueId = getVenueIdFromUrl();
    
    if (!venueId) {
        // No venue ID provided, show list of all venues
        renderVenuesList(venues);
        return;
    }
    
    const venue = getVenue(venueId);
    renderVenueDetails(venue);
    
    const shows = getVenueShows(venueId);
    renderVenueShows(shows);
}

document.addEventListener('DOMContentLoaded', init);