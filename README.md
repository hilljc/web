# Local Band Shows Website

A simple web application that displays local music shows happening in various venues. This application allows users to browse shows by date, venue, or artist, and see upcoming events within the next 7 days.

## Features

- Browse shows by date, venue, or artist
- View upcoming shows for the next 7 days
- Filter shows by band name or specific date
- Responsive design that works on mobile and desktop
- Admin panel for adding and removing shows

## Project Structure

The project uses a CSV-based "database" structure:

- `shows.csv`: Contains show information, referencing artists and venues by ID
- `artists.csv`: Contains information about bands/artists
- `venues.csv`: Contains information about venues

The application simulates a client-server architecture with:

- Frontend: HTML, CSS, and vanilla JavaScript
- Backend: Node.js with Express serving the data via API endpoints

## How It Was Created

This project was built as a proof-of-concept for a band shows website. It uses:

- **Frontend**: HTML5, CSS3, and vanilla JavaScript (no frameworks)
- **Backend**: Node.js with Express
- **Data Storage**: CSV files (simulating a database)

The architecture is designed to be easily migrated to a real database system in the future.

## How to Run Locally

### Prerequisites

- Node.js (v14 or higher recommended)
- npm (comes with Node.js)

### Installation Steps

1. Clone the repository or download the source code

2. Navigate to the project directory:
   ```
   cd /path/to/project
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the server:
   ```
   npm start
   ```

5. Open your browser and go to:
   ```
   http://localhost:3000
   ```

### Accessing the Admin Panel

To access the admin panel for managing shows, navigate to:
```
http://localhost:3000/admin.html
```

## Future Enhancements

- User authentication for admin access
- Database integration (replacing CSV files)
- Image uploads for bands
- Integration with mapping services for venue locations
- Online ticket purchasing functionality

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Node.js
- Express
- CSV for data storage (temporary)

## Project Status

This is a proof of concept and is intended for demonstration purposes. It shows how a more complex application could be structured and provides a foundation for future development.