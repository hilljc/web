// Initialize data variables
let artists = [];
let shows = [];

// DOM elements
const artistDetailsContainer = document.getElementById('artist-details');
const artistUpcomingShowsContainer = document.getElementById('artist-upcoming-shows');

// Load artists data from JSON file
async function loadArtists() {
    try {
        const response = await fetch('./data/artists.json');
        if (!response.ok) {
            throw new Error(`Failed to fetch artists data: ${response.statusText}`);
        }
        artists = await response.json();
        return artists;
    } catch (error) {
        console.error('Error loading artists data:', error);
        artistDetailsContainer.innerHTML = '<div class="error">Failed to load artist data. Please try again later.</div>';
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

// Parse the artist ID from the URL query string
function getArtistIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const artistId = urlParams.get('id');
    return artistId ? parseInt(artistId) : null;
}

// Get a specific artist by ID
function getArtist(artistId) {
    return artists.find(artist => artist.id === artistId) || null;
}

// Get shows for a specific artist
function getArtistShows(artistId) {
    return shows.filter(show => show.artistId === artistId);
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

// Render list of all artists
function renderArtistsList(artists) {
    if (!artists || artists.length === 0) {
        artistDetailsContainer.innerHTML = '<div class="error">No artists found or error loading artists.</div>';
        return;
    }
    
    // Sort artists alphabetically by name
    artists.sort((a, b) => a.name.localeCompare(b.name));

    // Group artists by first letter for easier browsing
    const artistsByLetter = {};
    artists.forEach(artist => {
        const firstLetter = artist.name.charAt(0).toUpperCase();
        if (!artistsByLetter[firstLetter]) {
            artistsByLetter[firstLetter] = [];
        }
        artistsByLetter[firstLetter].push(artist);
    });

    // Create sorted list of letters
    const letters = Object.keys(artistsByLetter).sort();
    
    let html = `
        <h1>Music City Artists</h1>
        <p>Select an artist to view details and upcoming shows:</p>
        <div class="letter-navigation">
            ${letters.map(letter => `<a href="#letter-${letter}" class="letter-link">${letter}</a>`).join(' ')}
        </div>
        <div class="artists-list">
    `;
    
    // Create section for each letter
    letters.forEach(letter => {
        const artistsForLetter = artistsByLetter[letter];
        
        html += `
            <div class="letter-section" id="letter-${letter}">
                <h2 class="letter-heading">${letter}</h2>
                <div class="artists-by-letter">
                    ${artistsForLetter.map(artist => `
                        <div class="artist-list-item">
                            <a href="artist.html?id=${artist.id}" class="artist-link">
                                <h3>${artist.name}</h3>
                                <p class="artist-genre">${artist.genre}</p>
                                <p class="artist-year">Formed: ${artist.formationYear}</p>
                            </a>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    artistDetailsContainer.innerHTML = html;
    
    // Hide the upcoming shows container since we're showing all artists
    artistUpcomingShowsContainer.innerHTML = '';
    artistUpcomingShowsContainer.style.display = 'none';
}

// Initial load
async function init() {
    const artistId = getArtistIdFromUrl();
    
    if (!artistId) {
        // No artist ID provided, show list of all artists
        const artists = await loadArtists();
        renderArtistsList(artists);
        return;
    }
    
    const artists = await loadArtists();
    const shows = await loadShows();
    const artist = getArtist(artistId);
    renderArtistDetails(artist);
    
    const artistShows = getArtistShows(artistId);
    renderArtistShows(artistShows);
}

document.addEventListener('DOMContentLoaded', init);