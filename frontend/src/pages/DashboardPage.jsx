import { useState, useEffect } from 'react';
import { UserCircle, Save, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [profile, setProfile] = useState({ name: '', skills: '', interests: '' });
  const [savedProfile, setSavedProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check localStorage first for persistence on Vercel
    const localData = localStorage.getItem('studentProfile');
    if (localData) {
      const parsed = JSON.parse(localData);
      setSavedProfile(parsed);
      setProfile({
        name: parsed.name || '',
        skills: parsed.skills.join(', ') || '',
        interests: parsed.interests || ''
      });
    }

    // Still fetch from API to ensure backend is in sync (optional but good for dev)
    fetch('/api/student')
      .then(res => res.json())
      .then(data => {
        if (data.name && !localData) { // Only override if local storage is empty
          setSavedProfile(data);
          setProfile({
            name: data.name || '',
            skills: data.skills.join(', ') || '',
            interests: data.interests || ''
          });
        }
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const profileData = {
      name: profile.name,
      skills: profile.skills.split(',').map(s => s.trim()).filter(s => s.length > 0),
      interests: profile.interests
    };

    try {
      // Save to localStorage immediately
      localStorage.setItem('studentProfile', JSON.stringify(profileData));
      
      const res = await fetch('/api/student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });
      const data = await res.json();
      setSavedProfile(data.profile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      // Fallback: update UI from local data even if API fails
      setSavedProfile(profileData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center sm:text-left flex items-center justify-center sm:justify-start gap-3">
        <UserCircle className="w-8 h-8 text-brand-600" />
        <h1 className="text-3xl font-bold text-slate-800">Student Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-5 gap-8">
        <div className="md:col-span-3">
          <div className="glass-card p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-6 border-b border-slate-200 pb-2">Update Your Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="input-field" 
                  placeholder="John Doe"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Skills (comma separated)</label>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="React, Node.js, Python"
                  value={profile.skills}
                  onChange={(e) => setProfile({...profile, skills: e.target.value})}
                />
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  We use these skills to find your perfect job matches!
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Interests</label>
                <textarea 
                  className="input-field min-h-[100px] resize-y" 
                  placeholder="Tell us what you're passionate about..."
                  value={profile.interests}
                  onChange={(e) => setProfile({...profile, interests: e.target.value})}
                />
              </div>

              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Profile'}
                </button>
                {success && <span className="ml-4 text-green-600 font-medium text-sm animate-pulse">Profile updating successful!</span>}
              </div>
            </form>
          </div>
        </div>

        <div className="md:col-span-2">
          {savedProfile && savedProfile.name ? (
            <div className="glass-card p-6 md:p-8 bg-gradient-to-br from-brand-50 to-white">
              <h2 className="text-xl font-semibold mb-6 border-b border-brand-200 pb-2 text-brand-900">Current Profile</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-brand-600 mb-1">Name</h3>
                  <p className="text-slate-800 font-medium">{savedProfile.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-brand-600 mb-2">My Skills</h3>
                  {savedProfile.skills && savedProfile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {savedProfile.skills.map((skill, index) => (
                        <span key={index} className="px-3 py-1 bg-white border border-brand-200 rounded-full text-sm font-medium text-brand-700 shadow-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  ) : <p className="text-slate-500 text-sm">No skills added yet.</p>}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-brand-600 mb-1">Interests</h3>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap">{savedProfile.interests || 'None'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-6 md:p-8 text-center flex flex-col items-center justify-center min-h-[300px] border-dashed">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                <UserCircle className="w-8 h-8" />
              </div>
              <p className="text-slate-500">No profile saved yet.<br /> Fill out the form to create one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
