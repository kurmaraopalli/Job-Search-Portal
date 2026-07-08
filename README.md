# Enterprise AI & Architecture Job Search Portal

A full-stack web application that automatically aggregates job openings from multiple sources for Bengaluru and Hyderabad locations. Features include real-time filtering, one-click applications, and automatic daily updates.

## 🎯 Target Geographic Focus
The application filters and tracks matching high-scale positions restricted exclusively to India's primary technology hubs:
* 📍 **Bengaluru (Bangalore)**
* 📍 **Hyderabad**

## 💻 Tech Stack & Architecture

### Frontend
- **UI:** Semantic HTML5, Responsive CSS3 Grid/Flexbox Layouts
- **Styling:** Modern gradient themes with mobile-first design
- **Logic:** Vanilla JavaScript (ES6+) with API integration
- **Apply System:** mailto-based email generation with pre-formatted templates

### Backend
- **Server:** Node.js with Express.js
- **Database:** SQLite for job storage and caching
- **Job Aggregation:** Multiple API integrations (Remotive, RSS feeds)
- **Scheduling:** node-cron for automatic daily updates
- **API:** RESTful endpoints for job data retrieval

## ✨ Core Features
- **Automatic Job Aggregation:** Fetches jobs from multiple APIs automatically
- **Daily Updates:** Scheduled tasks update job database once daily at 2 AM
- **Location Filtering:** Only shows jobs from Bengaluru and Hyderabad
- **Date Filtering:** Displays jobs posted within the last month only
- **Profile Integration:** Displays candidate core competencies with portfolio and LinkedIn links
- **Portfolio Link:** Direct link to candidate's portfolio (kurmaraopalli.github.io/About-Me/)
- **LinkedIn Profile:** Direct link to LinkedIn profile (linkedin.com/in/kurma-rao-05b34a32/)
- **Dual-Core Filter Matrix:** Real-time filtering by City and Domain
- **Apply Button Functionality:** One-click apply with pre-formatted emails
- **Responsive Design:** Mobile-first approach for all devices
- **API Fallback:** Graceful degradation to static data if API unavailable

## 📁 Project Structure
```
Job-Search-Portal/
├── index.html          # Main HTML structure
├── styles.css          # Modern responsive styling
├── script.js           # Frontend logic with API integration
├── server.js           # Node.js backend server
├── package.json        # Node.js dependencies
├── jobs.db            # SQLite database (auto-created)
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (comes with Node.js)
- Modern web browser

### Backend Setup

1. **Install Dependencies:**
```bash
npm install
```

2. **Start the Server:**
```bash
npm start
```

The server will start on `http://localhost:3000` and automatically:
- Create the SQLite database
- Fetch initial jobs from APIs
- Schedule daily updates

3. **Development Mode:**
```bash
npm run dev
```

### Frontend Setup

Simply open `http://localhost:3000` in your browser, or open `index.html` directly for static mode with fallback data.

## 🔧 Configuration

### Job Sources

The backend currently fetches from:
- **Remotive API:** Remote job listings
- **RSS Feeds:** Stack Overflow Jobs (configurable)

To add more sources, edit the `jobFetchers` object in `server.js`:

```javascript
async fetchFromCustomAPI() {
    const response = await axios.get('YOUR_API_ENDPOINT');
    return response.data.jobs.map(job => ({
        title: job.title,
        company: job.company,
        location: job.location,
        domain: this.classifyDomain(job.title),
        // ... other fields
    }));
}
```

### Schedule Configuration

Modify the cron schedule in `server.js`:
```javascript
// Current: Daily at 2 AM
cron.schedule('0 2 * * *', async () => {
    await fetchAllJobs();
});

// Example: Every 6 hours
cron.schedule('0 */6 * * *', async () => {
    await fetchAllJobs();
});
```

### Location Filtering

The system automatically filters for Bengaluru and Hyderabad. To add more locations, modify the `filterByLocation` function:

```javascript
filterByLocation(jobs) {
    const targetLocations = ['Bengaluru', 'Bangalore', 'Hyderabad', 'Chennai'];
    return jobs.filter(job => 
        targetLocations.some(loc => 
            job.location.toLowerCase().includes(loc.toLowerCase())
        )
    );
}
```

## 🎨 Features Overview

### Automatic Job Updates
- **Schedule:** Runs automatically at 2 AM daily
- **Sources:** Multiple job APIs and RSS feeds
- **Filtering:** Only stores jobs from target locations posted within last month
- **Deduplication:** Prevents duplicate job entries

### API Endpoints

- **GET /api/jobs** - Retrieve all jobs (with optional filters)
  - Query params: `?city=Bengaluru&domain=Architect`
- **POST /api/jobs/fetch** - Manually trigger job fetch
- **GET /api/stats** - Get job statistics by location and domain

### Frontend Features

- **Real-time Filtering:** Instant filtering without page reloads
- **Apply System:** Generates professional email templates
- **Responsive Design:** Works on all device sizes
- **Fallback Mode:** Uses static data if API unavailable
- **Candidate Profile:** Displays core competencies with portfolio and LinkedIn links
- **Portfolio Integration:** Direct link to kurmaraopalli.github.io/About-Me/
- **LinkedIn Integration:** Direct link to linkedin.com/in/kurma-rao-05b34a32/

## 🌐 Deployment

### Local Development
```bash
npm install
npm start
```

### Production Deployment

#### Option 1: VPS/Cloud Server
1. Deploy code to server
2. Install Node.js dependencies
3. Use PM2 for process management:
```bash
npm install -g pm2
pm2 start server.js --name job-portal
pm2 startup
pm2 save
```

#### Option 2: Docker
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t job-portal .
docker run -p 3000:3000 job-portal
```

#### Option 3: Serverless (AWS Lambda/Google Functions)
Adapt `server.js` for serverless deployment using serverless frameworks.

## 🔍 Important Notes

### Job API Limitations
- **Naukri/LinkedIn:** Direct scraping violates Terms of Service
- **Legal Alternatives:** Use official APIs where available
- **Rate Limiting:** Implement proper rate limiting for production
- **API Keys:** Some services require API keys (add to `.env` file)

### Data Freshness
- Jobs are filtered to show only postings from the last month
- Automatic updates run daily (configurable)
- Manual trigger available via API endpoint

### Performance
- SQLite database for fast queries
- Job caching to reduce API calls
- Efficient filtering at database level

## 📱 Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🎯 Use Cases
- **Job Seekers:** Track and apply to enterprise-level positions
- **Recruiters:** Aggregate and display open positions
- **Career Portfolios:** Integrate into personal websites
- **Job Boards:** Custom job aggregation platform

## 🔒 Security Considerations
- Add authentication for admin endpoints
- Implement rate limiting on API endpoints
- Use environment variables for sensitive data
- Add HTTPS for production deployments
- Validate and sanitize all user inputs

## 📄 License
This project is open source and available for personal and professional use.

## 🤝 Contributing
Contributions are welcome! Areas for improvement:
- Add more job API integrations
- Implement user authentication
- Add job application tracking
- Create admin dashboard
- Implement email notifications

---
*Maintained under enterprise architectural templates — Designed for structural scaling.*
