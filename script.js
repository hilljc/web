// Initialize shows array
let shows = [];

// DOM elements
const showsContainer = document.getElementById('shows-container');
const searchInput = document.getElementById('search-input');
const dateFilter = document.getElementById('date-filter');
const resetFiltersButton = document.getElementById('reset-filters');
const sortBySelect = document.getElementById('sort-by');

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

// Group shows based on sorting method
function groupShows(shows, sortBy) {
    const grouped = {};
    
    shows.forEach(show => {
        let key;
        
        // Determine grouping key based on sort type
        switch (sortBy) {
            case 'date':
                key = show.date;
                break;
            case 'venue':
                key = show.venue;
                break;
            case 'artist':
                key = show.bandName;
                break;
            default:
                key = show.date;
        }
        
        // Create group if it doesn't exist
        if (!grouped[key]) {
            grouped[key] = [];
        }
        
        // Add show to group
        grouped[key].push(show);
    });
    
    // Sort shows within each group by date
    Object.keys(grouped).forEach(key => {
        grouped[key].sort((a, b) => new Date(a.date) - new Date(b.date));
    });
    
    return grouped;
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

// Render shows to the page
function renderShows(showsToRender) {
    showsContainer.innerHTML = '';
    
    if (showsToRender.length === 0) {
        showsContainer.innerHTML = '<p class="no-shows">No shows found. Adjust your filters to see more shows.</p>';
        return;
    }
    
    // Get sorting method
    const sortBy = sortBySelect.value;
    
    // First, sort all shows by the selected method
    const sortedShows = sortShows(showsToRender, sortBy);
    
    // Then group the sorted shows
    const groupedShows = groupShows(sortedShows, sortBy);
    
    // Get group keys and sort them
    let groupKeys = Object.keys(groupedShows);
    
    if (sortBy === 'date') {
        // Sort date keys chronologically
        groupKeys.sort((a, b) => new Date(a) - new Date(b));
    } else {
        // Sort other keys alphabetically
        groupKeys.sort();
    }
    
    // Render each group
    groupKeys.forEach(key => {
        const shows = groupedShows[key];
        
        // Create group header
        const groupHeader = document.createElement('div');
        groupHeader.classList.add('group-header');
        
        switch (sortBy) {
            case 'date':
                groupHeader.innerHTML = `<h2>${formatDate(key)}</h2>`;
                break;
            case 'venue':
                groupHeader.innerHTML = `<h2>${key}</h2>`;
                break;
            case 'artist':
                groupHeader.innerHTML = `<h2>${key}</h2>`;
                break;
        }
        
        showsContainer.appendChild(groupHeader);
        
        // Create group container
        const groupContainer = document.createElement('div');
        groupContainer.classList.add('show-group');
        
        // Add all shows in this group
        shows.forEach(show => {
            const showCard = document.createElement('div');
            showCard.classList.add('show-card');
            
            // Format show date for display
            const formattedDate = formatDate(show.date);
            
            // Show different info depending on grouping type
            if (sortBy === 'date') {
                // When grouped by date, emphasize time, venue, and artist
                showCard.innerHTML = `
                    <h3>${show.bandName}</h3>
                    <p class="show-info"><strong>Time:</strong> ${formatTime(show.time)}</p>
                    <p class="show-info"><strong>Venue:</strong> ${show.venue}</p>
                    <p class="show-info"><strong>Address:</strong> ${show.address}</p>
                `;
            } else if (sortBy === 'venue') {
                // When grouped by venue, emphasize date, time, and artist
                showCard.innerHTML = `
                    <h3>${show.bandName}</h3>
                    <p class="show-info"><strong>Date:</strong> ${formattedDate}</p>
                    <p class="show-info"><strong>Time:</strong> ${formatTime(show.time)}</p>
                    <p class="show-info"><strong>Address:</strong> ${show.address}</p>
                `;
            } else if (sortBy === 'artist') {
                // When grouped by artist, emphasize date, time, and venue
                showCard.innerHTML = `
                    <p class="show-info"><strong>Date:</strong> ${formattedDate}</p>
                    <p class="show-info"><strong>Time:</strong> ${formatTime(show.time)}</p>
                    <p class="show-info"><strong>Venue:</strong> ${show.venue}</p>
                    <p class="show-info"><strong>Address:</strong> ${show.address}</p>
                `;
            }
            
            groupContainer.appendChild(showCard);
        });
        
        showsContainer.appendChild(groupContainer);
    });
}

// Sort shows based on the selected option
function sortShows(showsToSort, sortBy) {
    const showsCopy = [...showsToSort];
    
    switch (sortBy) {
        case 'date':
            return showsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
        case 'venue':
            return showsCopy.sort((a, b) => a.venue.localeCompare(b.venue));
        case 'artist':
            return showsCopy.sort((a, b) => a.bandName.localeCompare(b.bandName));
        default:
            return showsCopy.sort((a, b) => new Date(a.date) - new Date(b.date));
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
sortBySelect.addEventListener('change', filterShows); // Re-apply filtering when sort option changes
resetFiltersButton.addEventListener('click', function() {
    searchInput.value = '';
    dateFilter.value = '';
    sortBySelect.value = 'date'; // Reset to default sort
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