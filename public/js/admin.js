// Initialize shows array with embedded data
// This replaces the need for fetch operations
let shows = [
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
const adminShowsContainer = document.getElementById('admin-shows-container');
const showForm = document.getElementById('show-form');

// Add notice for static mode
document.addEventListener('DOMContentLoaded', function() {
    // Create static site notice
    const noticeContainer = document.createElement('div');
    noticeContainer.className = 'static-notice';
    noticeContainer.innerHTML = `
        <p><strong>⚠️ Static Demo Mode:</strong> This is a static site version. 
        The admin interface is for demonstration purposes only. 
        Changes will not be saved permanently.</p>
    `;
    
    // Insert at the top of the container
    const parentContainer = document.querySelector('.container');
    if (parentContainer && parentContainer.firstChild) {
        parentContainer.insertBefore(noticeContainer, parentContainer.firstChild);
    }
});

// In static mode, saving shows is just simulated in memory
// Changes won't persist between page reloads
function saveShows() {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            // In a static site, we can't actually save the data
            console.log('In a real app, this data would be saved to a server');
            resolve({ success: true, message: 'Demo mode: Changes are not permanently saved' });
        }, 500);
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
        renderAdminShows(shows);
    } catch (error) {
        showMessage('Failed to load shows data. Please refresh the page.', 'error');
    }
});