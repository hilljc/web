// Initialize shows array
let shows = [];

// DOM elements
const showsContainer = document.getElementById('shows-container');
const searchInput = document.getElementById('search-input');
const dateFilter = document.getElementById('date-filter');
const resetFiltersButton = document.getElementById('reset-filters');

// API URL - can be easily updated when moving to a database backend
const API_URL = 'http://localhost:3000/api';

// Fetch shows data from the API
async function fetchShows() {
    try {
        const response = await fetch(`${API_URL}/shows`);
        if (!response.ok) {
            throw new Error('Failed to fetch shows data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error loading shows data:', error);
        return [];
    }
}

// Render shows to the page
function renderShows(showsToRender) {
    showsContainer.innerHTML = '';
    
    if (showsToRender.length === 0) {
        showsContainer.innerHTML = '<p class="no-shows">No shows found. Adjust your filters to see more shows.</p>';
        return;
    }
    
    // Sort shows by date
    const sortedShows = [...showsToRender].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedShows.forEach(show => {
        const showCard = document.createElement('div');
        showCard.classList.add('show-card');
        
        // Format date for display
        const showDate = new Date(show.date);
        const formattedDate = showDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        showCard.innerHTML = `
            <h3>${show.bandName}</h3>
            <p class="show-info"><strong>Date:</strong> ${formattedDate}</p>
            <p class="show-info"><strong>Time:</strong> ${formatTime(show.time)}</p>
            <p class="show-info"><strong>Venue:</strong> ${show.venue}</p>
            <p class="show-info"><strong>Address:</strong> ${show.address}</p>
        `;
        
        showsContainer.appendChild(showCard);
    });
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

// Filter shows based on search and date inputs
function filterShows() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterDate = dateFilter.value;
    
    let filteredShows = shows;
    
    if (searchTerm) {
        filteredShows = filteredShows.filter(show => 
            show.bandName.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filterDate) {
        filteredShows = filteredShows.filter(show => show.date === filterDate);
    }
    
    renderShows(filteredShows);
}

// Event listeners
searchInput.addEventListener('input', filterShows);
dateFilter.addEventListener('change', filterShows);
resetFiltersButton.addEventListener('click', function() {
    searchInput.value = '';
    dateFilter.value = '';
    renderShows(shows);
});

// Update current date
function updateCurrentDate() {
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        const today = new Date();
        const formattedDate = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        currentDateElement.textContent = `Today: ${formattedDate}`;
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', async function() {
    shows = await fetchShows();
    renderShows(shows);
    updateCurrentDate();
});