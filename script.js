// API Configuration
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Job Database - Fallback data if API is unavailable
const fallbackJobs = [
    {
        id: 1,
        title: "Principal AI Architect",
        company: "Tech Giant India",
        location: "Bengaluru",
        domain: "Architect",
        experience: "10+ years",
        salary: "₹50-80 LPA",
        description: "Lead AI architecture design for enterprise-scale ML systems. Design and implement RAG pipelines, LLM integration, and scalable AI infrastructure.",
        tags: ["AI/ML", "Architecture", "LLM", "RAG"],
        email: "careers@techgiant.in"
    },
    {
        id: 2,
        title: "Engineering Manager - AI Platform",
        company: "CloudScale Solutions",
        location: "Hyderabad",
        domain: "Manager",
        experience: "8+ years",
        salary: "₹40-65 LPA",
        description: "Manage a team of 15+ engineers building AI/ML platforms. Drive technical strategy, mentorship, and delivery of high-impact AI solutions.",
        tags: ["Management", "AI Platform", "Leadership"],
        email: "hiring@cloudscale.io"
    },
    {
        id: 3,
        title: "Senior Generative AI Engineer",
        company: "InnovateTech Labs",
        location: "Bengaluru",
        domain: "Generative AI",
        experience: "6+ years",
        salary: "₹35-55 LPA",
        description: "Build cutting-edge generative AI applications using GPT-4, Claude, and custom LLMs. Implement RAG systems and fine-tuning pipelines.",
        tags: ["GenAI", "LLM", "RAG", "Fine-tuning"],
        email: "jobs@innovatetech.com"
    },
    {
        id: 4,
        title: "Enterprise Solutions Architect",
        company: "Global Systems Inc",
        location: "Hyderabad",
        domain: "Architect",
        experience: "12+ years",
        salary: "₹60-90 LPA",
        description: "Design enterprise-grade cloud architectures for Fortune 500 clients. Lead digital transformation initiatives and system modernization.",
        tags: ["Cloud", "Enterprise", "Architecture"],
        email: "recruitment@globalsys.com"
    },
    {
        id: 5,
        title: "Head of AI Engineering",
        company: "DataDriven Corp",
        location: "Bengaluru",
        domain: "Manager",
        experience: "15+ years",
        salary: "₹80-120 LPA",
        description: "Lead the entire AI engineering organization. Define AI strategy, build high-performing teams, and deliver transformative AI products.",
        tags: ["Leadership", "AI Strategy", "Executive"],
        email: "exec-hiring@datadriven.co"
    },
    {
        id: 6,
        title: "RAG Systems Engineer",
        company: "KnowledgeAI Startup",
        location: "Hyderabad",
        domain: "Generative AI",
        experience: "5+ years",
        salary: "₹30-45 LPA",
        description: "Design and implement production-grade RAG systems. Work with vector databases, embedding models, and retrieval optimization.",
        tags: ["RAG", "Vector DB", "Embeddings", "GenAI"],
        email: "talent@knowledgeai.io"
    },
    {
        id: 7,
        title: "Cloud Architecture Lead",
        company: "Enterprise Cloud Solutions",
        location: "Bengaluru",
        domain: "Architect",
        experience: "10+ years",
        salary: "₹45-70 LPA",
        description: "Lead cloud architecture initiatives across AWS, Azure, and GCP. Design multi-cloud strategies and cost-optimized solutions.",
        tags: ["Cloud", "Multi-cloud", "Cost Optimization"],
        email: "careers@enterprisecloud.com"
    },
    {
        id: 8,
        title: "AI Platform Engineering Manager",
        company: "ScaleUp Technologies",
        location: "Hyderabad",
        domain: "Manager",
        experience: "9+ years",
        salary: "₹45-70 LPA",
        description: "Manage platform engineering team building internal AI/ML tools. Drive infrastructure as code, CI/CD, and developer experience.",
        tags: ["Platform", "DevOps", "AI Infrastructure"],
        email: "hiring@scaleup.tech"
    },
    {
        id: 9,
        title: "LLM Application Architect",
        company: "NextGen AI",
        location: "Bengaluru",
        domain: "Generative AI",
        experience: "7+ years",
        salary: "₹40-60 LPA",
        description: "Architect LLM-powered applications for enterprise use cases. Design prompt engineering strategies and evaluation frameworks.",
        tags: ["LLM", "Prompt Engineering", "Architecture"],
        email: "careers@nextgenai.com"
    },
    {
        id: 10,
        title: "Solutions Architect - AI/ML",
        company: "Enterprise Software Co",
        location: "Hyderabad",
        domain: "Architect",
        experience: "11+ years",
        salary: "₹55-85 LPA",
        description: "Design AI/ML solutions for enterprise customers. Work with sales teams on technical pre-sales and solution architecture.",
        tags: ["Solutions", "AI/ML", "Pre-sales"],
        email: "recruitment@enterprisesoft.com"
    }
];

let jobs = [];

// DOM Elements
const jobsContainer = document.getElementById('jobsContainer');
const cityFilter = document.getElementById('cityFilter');
const domainFilter = document.getElementById('domainFilter');
const noResults = document.getElementById('noResults');

// Fetch jobs from API
async function fetchJobsFromAPI(city = 'all', domain = 'all') {
    try {
        const params = new URLSearchParams();
        if (city !== 'all') params.append('city', city);
        if (domain !== 'all') params.append('domain', domain);
        
        const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`);
        if (!response.ok) {
            throw new Error('API request failed');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching jobs from API:', error);
        console.log('Using fallback jobs data');
        return fallbackJobs;
    }
}

// Initialize the application
async function init() {
    try {
        // Try to fetch from API first
        jobs = await fetchJobsFromAPI();
        
        if (jobs.length === 0) {
            console.log('No jobs from API, using fallback data');
            jobs = fallbackJobs;
        }
    } catch (error) {
        console.error('Failed to initialize with API, using fallback:', error);
        jobs = fallbackJobs;
    }
    
    renderJobs(jobs);
    setupEventListeners();
}

// Render jobs to the DOM
function renderJobs(jobsToRender) {
    jobsContainer.innerHTML = '';
    
    if (jobsToRender.length === 0) {
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    
    jobsToRender.forEach(job => {
        const jobCard = createJobCard(job);
        jobsContainer.appendChild(jobCard);
    });
}

// Create a single job card element
function createJobCard(job) {
    const card = document.createElement('div');
    card.className = 'job-card';
    card.innerHTML = `
        <div class="job-header">
            <h3 class="job-title">${job.title}</h3>
            <p class="job-company">${job.company}</p>
        </div>
        <div class="job-details">
            <div class="job-detail">
                <span class="job-detail-icon">📍</span>
                <span>${job.location}</span>
            </div>
            <div class="job-detail">
                <span class="job-detail-icon">💼</span>
                <span>${job.domain}</span>
            </div>
            <div class="job-detail">
                <span class="job-detail-icon">⏱️</span>
                <span>${job.experience}</span>
            </div>
            <div class="job-detail">
                <span class="job-detail-icon">💰</span>
                <span>${job.salary}</span>
            </div>
        </div>
        <div class="job-description">
            ${job.description}
        </div>
        <div class="job-tags">
            ${job.tags.map(tag => `<span class="job-tag">${tag}</span>`).join('')}
        </div>
        <button class="apply-button" onclick="applyForJob(${job.id})">
            📧 Apply Now
        </button>
    `;
    return card;
}

// Filter jobs based on selected criteria
async function filterJobs() {
    const selectedCity = cityFilter.value;
    const selectedDomain = domainFilter.value;
    
    try {
        // Fetch filtered jobs from API
        const filteredJobs = await fetchJobsFromAPI(selectedCity, selectedDomain);
        renderJobs(filteredJobs);
    } catch (error) {
        console.error('Error filtering jobs:', error);
        // Fallback to local filtering
        const localFiltered = jobs.filter(job => {
            const cityMatch = selectedCity === 'all' || job.location === selectedCity;
            const domainMatch = selectedDomain === 'all' || job.domain === selectedDomain;
            return cityMatch && domainMatch;
        });
        renderJobs(localFiltered);
    }
}

// Apply for a job using mailto link
function applyForJob(jobId) {
    const job = jobs.find(j => j.id === jobId);
    if (!job) return;
    
    const subject = encodeURIComponent(`Application for ${job.title} position at ${job.company}`);
    const body = encodeURIComponent(
        `Dear Hiring Manager,\n\n` +
        `I am writing to express my interest in the ${job.title} position at ${job.company}.\n\n` +
        `Position Details:\n` +
        `- Role: ${job.title}\n` +
        `- Location: ${job.location}\n` +
        `- Domain: ${job.domain}\n\n` +
        `I believe my experience in enterprise architecture and AI/ML systems makes me a strong candidate for this role.\n\n` +
        `Please find my resume attached for your review.\n\n` +
        `Best regards,\n` +
        `[Your Name]\n` +
        `[Your Phone]\n` +
        `[Your LinkedIn Profile]`
    );
    
    const mailtoLink = `mailto:${job.email}?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}

// Setup event listeners
function setupEventListeners() {
    cityFilter.addEventListener('change', filterJobs);
    domainFilter.addEventListener('change', filterJobs);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
