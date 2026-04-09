import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, ChevronRight } from 'lucide-react';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/jobs')
      .then(res => res.json())
      .then(data => {
        setJobs(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-3">
          <Briefcase className="w-8 h-8 text-brand-600" />
          Job Listings
        </h1>
        <p className="text-slate-600 mt-2">Find your next role. Click a job to see your compatibility score!</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-brand-300 transition-colors">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-600 transition-colors mb-2">
                  {job.title}
                </h2>
                <div className="flex items-center gap-2 text-slate-500 mb-4">
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{job.company}</span>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill, index) => (
                      <span key={index} className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mt-4 md:mt-0 flex-shrink-0">
                <Link 
                  to={`/match/${job.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-50 text-brand-600 font-medium rounded-xl hover:bg-brand-100 transition-colors w-full md:w-auto justify-center"
                >
                  Check Match
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center p-12 text-slate-500 glass-card">
              No jobs available at the moment.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
