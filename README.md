# Naples Live Music - Static Website for GitHub Pages

A fully static website that displays local music shows happening in various venues in Naples. This application allows users to browse shows by date, venue, or artist, and see upcoming events within the next 7 days. The site features a retro beachy design that brings a nostalgic coastal vibe to the user interface.

## Features

- Browse shows by date, venue, or artist
- View upcoming shows for the next 7 days
- Filter shows by band name or specific date
- Responsive design that works on mobile and desktop
- Demo admin panel for adding and removing shows (changes are not persisted)
- Retro beachy design with vibrant colors and playful typography

## Project Structure

The project uses a fully static approach with data stored in JSON files:

- All data (shows, venues, artists) is stored in static JSON files in the `/public/data/` directory
- JavaScript files load data from these JSON files
- No server or API calls to external services - everything loads directly from the static files
- Can be deployed directly to GitHub Pages without any build step

## How It Was Created

This project was built as a fully static website for GitHub Pages:

- **Frontend**: HTML5, CSS3, and vanilla JavaScript (no frameworks)
- **Data Storage**: JSON files loaded via JavaScript fetch API
- **Design**: Retro beach-inspired UI with custom CSS styling, Google Fonts, and SVG patterns

## How to Deploy to GitHub Pages

1. Fork or clone this repository
2. Enable GitHub Pages in your repository settings (Settings > Pages)
3. Select the branch you want to deploy (usually `main` or `master`)
4. Your site will be published at `https://[your-username].github.io/[repository-name]/`

## Local Development

### Viewing the Site Locally

Simply open the HTML files in the `/public` directory directly in your browser.

### Updating Data

The data is stored in JSON files in the `/public/data/` directory:
   - `public/data/shows.json` - Show information
   - `public/data/artists.json` - Artists data
   - `public/data/venues.json` - Venues data
   - `public/data/joinedShows.json` - Combined show data with artist and venue details

If you have new CSV data, you can use the included script to convert it to JSON:
```
node convertCsvToJson.js
```

## Design Details

The website features a retro beachy design with:

- Warm sandy backgrounds with subtle patterns
- Ocean blue and sunset-inspired accent colors
- Handwritten-style heading fonts (Pacifico)
- Clean, readable body text (Quicksand)
- Decorative elements like waves, circles, and surfing emojis
- Dashed borders and rounded corners for a casual, fun feel
- Subtle animations and hover effects

## Future Enhancements

- User authentication (would require backend integration)
- Image uploads for bands (would require backend integration)
- Integration with mapping services for venue locations
- Calendar view of upcoming events
- Additional beach-themed animations and interactive elements

## Technologies Used

- HTML5
- CSS3
- JavaScript
- JSON for data storage
- Google Fonts (Pacifico, Quicksand)
- CSS animations
- SVG background patterns

## Project Status

This is a static version of the site optimized for GitHub Pages hosting. The admin functionality is in demo-mode only, with changes not being persisted between sessions.