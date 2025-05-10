// Initialize shows array
let shows = [];

// DOM elements
const showsContainer = document.getElementById('shows-container');
const searchInput = document.getElementById('search-input');
const dateFilter = document.getElementById('date-filter');
const resetFiltersButton = document.getElementById('reset-filters');
const sortBySelect = document.getElementById('sort-by');
const upcomingInfoContainer = document.getElementById('upcoming-info');

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
        showsContainer.innerHTML = '<div class="error">Failed to load shows data. Please try again later.</div>';
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
            showCard.dataset.venueId = show.venueId;
            
            // Make the show card clickable, linking to venue details
            showCard.addEventListener('click', (event) => {
                // Don't navigate if user clicked on the artist link
                if (event.target.tagName !== 'A') {
                    window.location.href = `venue.html?id=${show.venueId}`;
                }
            });
            showCard.style.cursor = 'pointer';
            
            // Format show date for display
            const formattedDate = formatDate(show.date);
            
            // Show different info depending on grouping type
            if (sortBy === 'date') {
                // When grouped by date, emphasize time, venue, and artist
                showCard.innerHTML = `
                    <h3><a href="artist.html?id=${show.artistId}" class="artist-link">${show.bandName}</a></h3>
                    <p class="show-info"><strong>Time:</strong> ${formatTime(show.time)}</p>
                    <p class="show-info"><strong>Venue:</strong> ${show.venue}</p>
                    <p class="show-info"><strong>Address:</strong> ${show.address}</p>
                `;
            } else if (sortBy === 'venue') {
                // When grouped by venue, emphasize date, time, and artist
                showCard.innerHTML = `
                    <h3><a href="artist.html?id=${show.artistId}" class="artist-link">${show.bandName}</a></h3>
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

// Get shows occurring within the next 7 days
function getUpcomingShows(allShows, days = 7) {
    // Set reference date to May 3, 2025 (current date in context)
    const today = new Date('2025-05-03');
    const endDate = new Date('2025-05-03');
    endDate.setDate(today.getDate() + days);
    
    return allShows.filter(show => {
        const showDate = new Date(show.date);
        return showDate >= today && showDate <= endDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Display upcoming shows in the sidebar, grouped by date
function displayUpcomingShows(allShows) {
    // Clear previous content except the heading and current date
    const heading = upcomingInfoContainer.querySelector('h2');
    const currentDateElement = upcomingInfoContainer.querySelector('.current-date');
    upcomingInfoContainer.innerHTML = '';
    upcomingInfoContainer.appendChild(heading);
    
    // Get shows in the next 7 days
    const upcomingShows = getUpcomingShows(allShows);
    
    // If no upcoming shows, display a message
    if (upcomingShows.length === 0) {
        const noShowsMessage = document.createElement('p');
        noShowsMessage.textContent = 'No shows scheduled for the next 7 days.';
        upcomingInfoContainer.appendChild(noShowsMessage);
    } else {
        // Display number of upcoming shows
        const countMessage = document.createElement('p');
        countMessage.textContent = `${upcomingShows.length} shows in the next 7 days:`;
        upcomingInfoContainer.appendChild(countMessage);
        
        // Group shows by date
        const showsByDate = {};
        upcomingShows.forEach(show => {
            if (!showsByDate[show.date]) {
                showsByDate[show.date] = [];
            }
            showsByDate[show.date].push(show);
        });
        
        // Get dates and sort them chronologically
        const dates = Object.keys(showsByDate).sort((a, b) => new Date(a) - new Date(b));
        
        // Create container for upcoming shows
        const upcomingShowsList = document.createElement('div');
        upcomingShowsList.classList.add('upcoming-shows-list');
        
        // For each date, create a group
        dates.forEach(dateStr => {
            const showsOnDate = showsByDate[dateStr];
            
            // Create date header
            const dateHeader = document.createElement('div');
            dateHeader.classList.add('upcoming-date-header');
            
            const date = new Date(dateStr);
            const formattedDate = date.toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric'
            });
            
            dateHeader.textContent = formattedDate;
            upcomingShowsList.appendChild(dateHeader);
            
            // Create container for shows on this date
            const dateShowsList = document.createElement('div');
            dateShowsList.classList.add('upcoming-date-shows');
            
            // Sort shows on this date by time
            showsOnDate.sort((a, b) => a.time.localeCompare(b.time));
            
            // Add each show for this date
            showsOnDate.forEach(show => {
                const showItem = document.createElement('div');
                showItem.classList.add('upcoming-show-item');
                
                // Make the show item clickable, linking to venue details
                showItem.addEventListener('click', (event) => {
                    // Don't navigate if user clicked on the artist link
                    if (event.target.tagName !== 'A') {
                        window.location.href = `venue.html?id=${show.venueId}`;
                    }
                });
                showItem.style.cursor = 'pointer';
                
                showItem.innerHTML = `
                    <div class="upcoming-show-time">${formatTime(show.time)}</div>
                    <div class="upcoming-show-details">
                        <a href="artist.html?id=${show.artistId}" class="upcoming-show-band">${show.bandName}</a>
                        <div class="upcoming-show-venue">${show.venue}</div>
                    </div>
                `;
                
                dateShowsList.appendChild(showItem);
            });
            
            upcomingShowsList.appendChild(dateShowsList);
        });
        
        upcomingInfoContainer.appendChild(upcomingShowsList);
    }
    
    // Add back the current date
    upcomingInfoContainer.appendChild(currentDateElement);
}

// Update current date
function updateCurrentDate() {
    const currentDateElement = document.querySelector('.current-date');
    if (currentDateElement) {
        // Use May 3, 2025 as the fixed date
        const today = new Date('2025-05-03');
        const formattedDate = today.toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        });
        currentDateElement.textContent = `Today: ${formattedDate}`;
    }
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

// Initial load - no need for async function or fetch
document.addEventListener('DOMContentLoaded', async function() {
    await loadShows();
    renderShows(shows);
    displayUpcomingShows(shows);
    updateCurrentDate();
});