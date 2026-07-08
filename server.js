const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cron = require('node-cron');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '')));

// Database setup
const db = new sqlite3.Database('./jobs.db', (err) => {
    if (err) {
        console.error('Error opening database:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database schema
function initializeDatabase() {
    db.run(`
        CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            domain TEXT NOT NULL,
            experience TEXT,
            salary TEXT,
            description TEXT,
            tags TEXT,
            email TEXT,
            source TEXT,
            posted_date TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(title, company, location)
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Database initialized successfully');
            // Fetch jobs on startup
            fetchAllJobs();
        }
    });
}

// Job fetching functions for different sources
const jobFetchers = {
    // Fetch from public job APIs (using free APIs where available)
    async fetchFromAPI() {
        try {
            // Using a public job API example (replace with actual API keys)
            const response = await axios.get('https://remotive.com/api/remote-jobs?limit=20');
            return response.data.jobs.map(job => ({
                title: job.title,
                company: job.company_name,
                location: job.job_type === 'full_time' ? 'Bengaluru' : 'Hyderabad', // Mock location for demo
                domain: this.classifyDomain(job.title),
                experience: 'Not specified',
                salary: 'Not specified',
                description: job.description,
                tags: job.tags.join(','),
                email: 'hr@company.com',
                source: 'Remotive API',
                posted_date: job.publication_date
            }));
        } catch (error) {
            console.error('Error fetching from API:', error.message);
            return [];
        }
    },

    // Fetch from RSS feeds (many job boards provide RSS)
    async fetchFromRSS() {
        try {
            // Example RSS feed (replace with actual job board RSS feeds)
            const rssFeeds = [
                'https://stackoverflow.com/jobs/feed?q=python&l=Bengaluru&d=20&u=Km',
                'https://stackoverflow.com/jobs/feed?q=python&l=Hyderabad&d=20&u=Km'
            ];
            
            const jobs = [];
            for (const feed of rssFeeds) {
                try {
                    const response = await axios.get(feed);
                    // Parse RSS XML (would need xml2js package)
                    // For now, return mock data
                    jobs.push(...this.getMockRSSJobs());
                } catch (error) {
                    console.error('Error fetching RSS feed:', error.message);
                }
            }
            return jobs;
        } catch (error) {
            console.error('Error in RSS fetcher:', error.message);
            return [];
        }
    },

    // Mock RSS jobs for demonstration
    getMockRSSJobs() {
        return [
            {
                title: 'Senior Software Engineer',
                company: 'Tech Corp',
                location: 'Bengaluru',
                domain: 'Architect',
                experience: '5+ years',
                salary: '₹25-40 LPA',
                description: 'Looking for senior software engineer with cloud experience.',
                tags: 'Cloud,Backend,API',
                email: 'careers@techcorp.com',
                source: 'RSS Feed',
                posted_date: new Date().toISOString()
            },
            {
                title: 'ML Engineer',
                company: 'AI Solutions',
                location: 'Hyderabad',
                domain: 'Generative AI',
                experience: '3+ years',
                salary: '₹20-35 LPA',
                description: 'Machine learning engineer position for AI/ML projects.',
                tags: 'ML,AI,Python',
                email: 'hiring@aisolutions.com',
                source: 'RSS Feed',
                posted_date: new Date().toISOString()
            }
        ];
    },

    // Classify job domain based on title
    classifyDomain(title) {
        const titleLower = title.toLowerCase();
        if (titleLower.includes('architect') || titleLower.includes('lead')) {
            return 'Architect';
        } else if (titleLower.includes('manager') || titleLower.includes('head') || titleLower.includes('director')) {
            return 'Manager';
        } else if (titleLower.includes('ai') || titleLower.includes('ml') || titleLower.includes('machine learning') || 
                   titleLower.includes('data scientist') || titleLower.includes('llm') || titleLower.includes('generative')) {
            return 'Generative AI';
        }
        return 'Architect'; // Default
    },

    // Filter jobs for Bangalore and Hyderabad only
    filterByLocation(jobs) {
        const targetLocations = ['Bengaluru', 'Bangalore', 'Hyderabad'];
        return jobs.filter(job => 
            targetLocations.some(loc => 
                job.location.toLowerCase().includes(loc.toLowerCase())
            )
        );
    },

    // Filter jobs from last month
    filterByDate(jobs) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        return jobs.filter(job => {
            const jobDate = new Date(job.posted_date);
            return jobDate >= oneMonthAgo;
        });
    }
};

// Fetch jobs from all sources
async function fetchAllJobs() {
    console.log('Starting job fetch...');
    
    try {
        // Fetch from different sources
        const apiJobs = await jobFetchers.fetchFromAPI();
        const rssJobs = await jobFetchers.fetchFromRSS();
        
        // Combine all jobs
        let allJobs = [...apiJobs, ...rssJobs];
        
        // Filter by location (Bangalore/Hyderabad only)
        allJobs = jobFetchers.filterByLocation(allJobs);
        
        // Filter by date (last month only)
        allJobs = jobFetchers.filterByDate(allJobs);
        
        console.log(`Fetched ${allJobs.length} jobs from all sources`);
        
        // Store jobs in database
        await storeJobsInDatabase(allJobs);
        
        return allJobs;
    } catch (error) {
        console.error('Error fetching jobs:', error);
        return [];
    }
}

// Store jobs in database
function storeJobsInDatabase(jobs) {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO jobs 
            (title, company, location, domain, experience, salary, description, tags, email, source, posted_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        
        let inserted = 0;
        jobs.forEach(job => {
            stmt.run(
                job.title,
                job.company,
                job.location,
                job.domain,
                job.experience,
                job.salary,
                job.description,
                job.tags,
                job.email,
                job.source,
                job.posted_date,
                function(err) {
                    if (err) {
                        console.error('Error inserting job:', err);
                    } else {
                        inserted++;
                    }
                }
            );
        });
        
        stmt.finalize();
        console.log(`Stored ${inserted} jobs in database`);
        resolve(inserted);
    });
}

// API endpoint to get all jobs
app.get('/api/jobs', (req, res) => {
    const { city, domain } = req.query;
    
    let query = 'SELECT * FROM jobs WHERE 1=1';
    const params = [];
    
    if (city && city !== 'all') {
        query += ' AND location LIKE ?';
        params.push(`%${city}%`);
    }
    
    if (domain && domain !== 'all') {
        query += ' AND domain = ?';
        params.push(domain);
    }
    
    query += ' ORDER BY posted_date DESC';
    
    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching jobs:', err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            // Convert tags string back to array
            const jobs = rows.map(job => ({
                ...job,
                tags: job.tags ? job.tags.split(',') : []
            }));
            res.json(jobs);
        }
    });
});

// API endpoint to trigger manual job fetch
app.post('/api/jobs/fetch', async (req, res) => {
    try {
        const jobs = await fetchAllJobs();
        res.json({ 
            success: true, 
            message: `Fetched ${jobs.length} jobs`,
            count: jobs.length 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// API endpoint to get job statistics
app.get('/api/stats', (req, res) => {
    db.all('SELECT location, domain, COUNT(*) as count FROM jobs GROUP BY location, domain', (err, rows) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json(rows);
        }
    });
});

// Schedule daily job updates (runs at 2 AM every day)
cron.schedule('0 2 * * *', async () => {
    console.log('Running scheduled job fetch...');
    await fetchAllJobs();
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
});
