// Initialize data variables
let venues = [];
let shows = [];

// DOM elements
const venueDetailsContainer = document.getElementById('venue-details');
const venueUpcomingShowsContainer = document.getElementById('venue-upcoming-shows');

// Load venues data from JSON file
async function loadVenues() {
    try {
        const response = await fetch('./data/venues.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch venues data: ${response.statusText}`);
        }
        venues = await response.json();
        return venues;
    } catch (error) {
        console.error('Error loading venues data:', error);
        venueDetailsContainer.innerHTML = '<div class="error">Failed to load venue data. Please try again later.</div>';
        return [];
    }
}

// Load shows data from JSON file
async function loadShows() {
    try {
        const response = await fetch('./data/joinedShows.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch shows data: ${response.statusText}`);
        }
        shows = await response.json();
        return shows;
    } catch (error) {
        console.error('Error loading shows data:', error);
        return [];
    }
}

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
    
    await loadVenues();
    await loadShows();
    
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