const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// In-memory data store
let studentProfile = {
  name: '',
  skills: [],
  interests: ''
};

const jobs = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'TechCorp',
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS']
  },
  {
    id: 2,
    title: 'Backend Engineer',
    company: 'Innovate Solutions',
    requiredSkills: ['Node.js', 'Express', 'JavaScript', 'MongoDB', 'SQL']
  },
  {
    id: 3,
    title: 'Full Stack Web Developer',
    company: 'WebWorks',
    requiredSkills: ['React', 'Node.js', 'Express', 'Tailwind CSS']
  },
  {
    id: 4,
    title: 'Python Data Analyst',
    company: 'Data Analytics Inc',
    requiredSkills: ['Python', 'SQL', 'Pandas']
  },
  {
    id: 5,
    title: 'DevOps Engineer',
    company: 'Cloud Systems',
    requiredSkills: ['Docker', 'Kubernetes', 'AWS', 'Linux']
  },
  {
    id: 6,
    title: 'UI/UX Designer',
    company: 'Creative Studio',
    requiredSkills: ['Figma', 'Adobe XD', 'User Research']
  },
  {
    id: 7,
    title: 'Mobile App Developer',
    company: 'AppVentures',
    requiredSkills: ['React Native', 'JavaScript', 'Firebase']
  },
  {
    id: 8,
    title: 'Cybersecurity Analyst',
    company: 'SecureNet',
    requiredSkills: ['Networking', 'Linux', 'Security Auditing']
  },
  {
    id: 9,
    title: 'Machine Learning Engineer',
    company: 'AILabs',
    requiredSkills: ['Python', 'PyTorch', 'Mathematics']
  },
  {
    id: 10,
    title: 'Cloud Architect',
    company: 'Global Cloud',
    requiredSkills: ['AWS', 'Azure', 'Terraform']
  },
  {
    id: 11,
    title: 'Database Administrator',
    company: 'DataStore',
    requiredSkills: ['SQL', 'PostgreSQL', 'Performance Tuning']
  },
  {
    id: 12,
    title: 'QA Automation Engineer',
    company: 'TestLogic',
    requiredSkills: ['Selenium', 'Cypress', 'JavaScript']
  },
  {
    id: 13,
    title: 'Embedded Systems Engineer',
    company: 'ChipTech',
    requiredSkills: ['C', 'C++', 'Microcontrollers']
  },
  {
    id: 14,
    title: 'Digital Marketing Specialist',
    company: 'GrowFast',
    requiredSkills: ['SEO', 'Google Analytics', 'Content Strategy']
  },
  {
    id: 15,
    title: 'Blockchain Developer',
    company: 'CryptoInnovate',
    requiredSkills: ['Solidity', 'Ethereum', 'Smart Contracts']
  }
];

// Endpoints

app.get('/api/student', (req, res) => {
  res.json(studentProfile);
});

app.post('/api/student', (req, res) => {
  const { name, skills, interests } = req.body;
  if (name !== undefined) studentProfile.name = name;
  if (skills !== undefined) {
    // Expecting skills to either be an array or string
    if (typeof skills === 'string') {
      studentProfile.skills = skills.split(',').map(s => s.trim()).filter(s => s.length > 0);
    } else if (Array.isArray(skills)) {
      studentProfile.skills = skills;
    }
  }
  if (interests !== undefined) studentProfile.interests = interests;
  
  res.json({ message: 'Profile updated successfully', profile: studentProfile });
});

app.get('/api/jobs', (req, res) => {
  res.json(jobs);
});

app.post('/api/match/:jobId', (req, res) => {
  const jobId = parseInt(req.params.jobId);
  const job = jobs.find(j => j.id === jobId);

  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }

  const { skills } = req.body;
  const studentSkills = Array.isArray(skills) ? skills.map(s => s.toLowerCase()) : [];

  const matchedSkills = job.requiredSkills.filter(s => studentSkills.includes(s.toLowerCase()));
  const missingSkills = job.requiredSkills.filter(s => !studentSkills.includes(s.toLowerCase()));
  
  let matchPercentage = 0;
  if (job.requiredSkills.length > 0) {
    matchPercentage = Math.round((matchedSkills.length / job.requiredSkills.length) * 100);
  }

  res.json({
    jobId: job.id,
    matchPercentage,
    matchedSkills,
    missingSkills
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
