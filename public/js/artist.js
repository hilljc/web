// API URL - can be easily updated when moving to a database backend
const API_URL = '/api';

// DOM elements
const artistDetailsContainer = document.getElementById('artist-details');
const artistUpcomingShowsContainer = document.getElementById('artist-upcoming-shows');

// Parse the artist ID from the URL query string
function getArtistIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');
    return artistId ? parseInt(artistId) : null;
}

// Fetch artist data from the API
async function fetchArtist(artistId) {
    try {
        const response = await fetch(`${API_URL}/artists/${artistId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch artist data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error loading artist data:', error);
        return null;
    }
}

// Fetch shows for this artist from the API
async function fetchArtistShows(artistId) {
    try {
        const response = await fetch(`${API_URL}/shows?artistId=${artistId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch artist shows data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error loading artist shows data:', error);
        return [];
    }
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

// Render artist details
function renderArtistDetails(artist) {
    if (!artist) {
        artistDetailsContainer.innerHTML = '<div class="error">Artist not found or error loading artist information.</div>';
        return;
    }
    
    artistDetailsContainer.innerHTML = `
        <h1>${artist.name}</h1>
        <div class="details-card">
            <p><strong>Genre:</strong> ${artist.genre}</p>
            <p><strong>Formed:</strong> ${artist.formationYear}</p>
            <p><strong>Website:</strong> <a href="${artist.website}" target="_blank">${artist.website}</a></p>
        </div>
    `;
}

// Get current date for filtering upcoming shows
function getCurrentDate() {
    return new Date('2025-05-03'); // Use the current date from the context (May 3, 2025)
}

// Filter and render upcoming shows for this artist
function renderArtistShows(shows) {
    if (!shows || shows.length === 0) {
        artistUpcomingShowsContainer.innerHTML = '<p>No upcoming shows scheduled for this artist.</p>';
        return;
    }
    
    // Filter shows to only include future ones
    const today = getCurrentDate();
    const upcomingShows = shows.filter(show => {
        const showDate = new Date(show.date);
        return showDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
    
    if (upcomingShows.length === 0) {
        artistUpcomingShowsContainer.innerHTML = '<p>No upcoming shows scheduled for this artist.</p>';
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
    
    let showsHtml = `<p>${upcomingShows.length} upcoming shows:</p><div class="artist-shows-list">`;
    
    // Create listings for each date
    dates.forEach(dateStr => {
        const showsOnDate = showsByDate[dateStr];
        const formattedDate = formatDate(dateStr);
        
        showsHtml += `<div class="artist-date-header">${formattedDate}</div>`;
        
        // Sort shows on this date by time
        showsOnDate.sort((a, b) => a.time.localeCompare(b.time));
        
        showsOnDate.forEach(show => {
            showsHtml += `
                <div class="artist-show-item">
                    <div class="artist-show-time">${formatTime(show.time)}</div>
                    <div class="artist-show-details">
                        <a href="venue.html?id=${show.venueId}" class="artist-show-venue">${show.venue}</a>
                        <div class="artist-show-address">${show.address}</div>
                        <div class="artist-show-price">Tickets: $${show.ticketPrice.toFixed(2)}</div>
                    </div>
                </div>
            `;
        });
    });
    
    showsHtml += '</div>';
    artistUpcomingShowsContainer.innerHTML = showsHtml;
}

// Initial load
async function init() {
    const artistId = getArtistIdFromUrl();
    
    if (!artistId) {
        artistDetailsContainer.innerHTML = '<div class="error">No artist ID provided. Please select an artist from the main page.</div>';
        artistUpcomingShowsContainer.innerHTML = '';
        return;
    }
    
    const artist = await fetchArtist(artistId);
    renderArtistDetails(artist);
    
    const shows = await fetchArtistShows(artistId);
    renderArtistShows(shows);
}

document.addEventListener('DOMContentLoaded', init);