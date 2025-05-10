# Local Band Shows Website - Static Version for GitHub Pages

A fully static website that displays local music shows happening in various venues. This application allows users to browse shows by date, venue, or artist, and see upcoming events within the next 7 days.

## Features

- Browse shows by date, venue, or artist
- View upcoming shows for the next 7 days
- Filter shows by band name or specific date
- Responsive design that works on mobile and desktop
- Demo admin panel for adding and removing shows (changes are not persisted)

## Project Structure

The project uses a fully static approach with data embedded directly in JavaScript files:

- All data (shows, venues, artists) is directly embedded in the JavaScript files
- No server or API calls are used - everything works completely offline
- Can be deployed directly to GitHub Pages without any build step

## How It Was Created

This project was built as a fully static website for GitHub Pages:

- **Frontend**: HTML5, CSS3, and vanilla JavaScript (no frameworks)
- **Data Storage**: Data embedded directly in JavaScript files

## How to Deploy to GitHub Pages

1. Fork or clone this repository
2. Enable GitHub Pages in your repository settings (Settings > Pages)
3. Select the branch you want to deploy (usually `main` or `master`)
4. Your site will be published at `https://[your-username].github.io/[repository-name]/`

## Local Development

### Viewing the Site Locally

Simply open any of the HTML files directly in your browser. No local server is required since all data is embedded in the JavaScript files.

### Updating Data

The data is embedded directly in the JavaScript files. To update the data:

1. Edit the data arrays at the top of each JavaScript file:
   - `public/js/script.js` - Main shows data
   - `public/js/artist.js` - Artists data
   - `public/js/venue.js` - Venues data
   - `public/js/admin.js` - Admin page data

## Future Enhancements

- User authentication (would require backend integration)
- Image uploads for bands (would require backend integration)
- Integration with mapping services for venue locations
- Calendar view of upcoming events

## Technologies Used

- HTML5
- CSS3
- JavaScript
- No external dependencies or API calls required

## Project Status

This is a static version of the site optimized for GitHub Pages hosting. The admin functionality is in demo-mode only, with changes not being persisted between sessions.