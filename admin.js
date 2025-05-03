// Initialize shows array
let shows = [];

// DOM elements
const adminShowsContainer = document.getElementById('admin-shows-container');
const showForm = document.getElementById('show-form');

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

// Save shows data to the API
async function saveShows(showsData) {
    try {
        const response = await fetch(`${API_URL}/shows`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(showsData),
        });
        
        if (!response.ok) {
            throw new Error('Failed to save shows data');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error saving shows data:', error);
        throw error;
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

// Render shows to the admin page with delete buttons
function renderAdminShows(showsToRender) {
    adminShowsContainer.innerHTML = '';
    
    if (showsToRender.length === 0) {
        adminShowsContainer.innerHTML = '<p class="no-shows">No shows found. Add a new show using the form.</p>';
        return;
    }
    
    // Sort shows by date
    const sortedShows = [...showsToRender].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedShows.forEach(show => {
        const showCard = document.createElement('div');
        showCard.classList.add('show-card', 'admin-show-card');
        
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
            <button class="delete-btn" data-id="${show.id}">Remove Show</button>
        `;
        
        adminShowsContainer.appendChild(showCard);
    });
    
    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const showId = parseInt(this.getAttribute('data-id'));
            deleteShow(showId);
        });
    });
}

// Add a new show
async function addShow(event) {
    event.preventDefault();
    
    const bandName = document.getElementById('band-name').value;
    const date = document.getElementById('show-date').value;
    const time = document.getElementById('show-time').value;
    const venue = document.getElementById('venue').value;
    const address = document.getElementById('address').value;
    
    // Generate a new ID (in a real app with a database, this would be handled by the database)
    const maxId = shows.reduce((max, show) => Math.max(max, show.id), 0);
    const newId = maxId + 1;
    
    const newShow = {
        id: newId,
        bandName,
        date,
        time,
        venue,
        address
    };
    
    // Add to shows array
    shows.push(newShow);
    
    try {
        // Save to CSV via API
        await saveShows(shows);
        
        // Show success message
        showMessage('Show added successfully!', 'success');
        
        // Refresh the display
        renderAdminShows(shows);
        
        // Reset form
        showForm.reset();
    } catch (error) {
        showMessage('Failed to save show. Please try again.', 'error');
    }
}

// Delete a show
async function deleteShow(id) {
    // Filter out the show with the matching id
    shows = shows.filter(show => show.id !== id);
    
    try {
        // Save to CSV via API
        await saveShows(shows);
        
        // Show success message
        showMessage('Show removed successfully!', 'success');
        
        // Refresh the display
        renderAdminShows(shows);
    } catch (error) {
        showMessage('Failed to remove show. Please try again.', 'error');
    }
}

// Display message to user
function showMessage(text, type = 'info') {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = text;
    
    // Add to DOM
    document.body.appendChild(messageElement);
    
    // Remove after delay
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            messageElement.remove();
        }, 500);
    }, 3000);
}

// Event listeners
showForm.addEventListener('submit', addShow);

// Initial load
document.addEventListener('DOMContentLoaded', async function() {
    try {
        shows = await fetchShows();
        renderAdminShows(shows);
    } catch (error) {
        showMessage('Failed to load shows data. Please refresh the page.', 'error');
    }
});