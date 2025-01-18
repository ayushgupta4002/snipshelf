import React, { useState } from 'react';
import { Github, Key, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { SessionOptions } from 'next-auth';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '@/app/atom';
import Link from 'next/link';

const Profile = ({session}:{session : any}) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [user, setUser] = useRecoilState(userAtom);


  const generateNewApiKey = () => {
    // In a real app, this would make an API call
    const newKey = 'sk_live_' + Math.random().toString(36).substring(2, 15);
    setUser({...user , apiKey: newKey});
    
  };

  return (
    <div className="bg-zinc-900 p-4 sm:p-6 rounded-lg mb-8">
      <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
        <div className="flex-shrink-0">
          <img 
            src={session.user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200"}
            alt="Profile"
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-zinc-700 object-cover"
          />
        </div>
        
        <div className="flex-grow w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-2">
            <div>
              <h2 className="text-xl font-semibold text-white text-center sm:text-left">{session.user?.name}</h2>
              <p className="text-zinc-400 text-center sm:text-left">{session.user?.email}</p>
            </div>
            <Link href={"/api/github/oauthGithub"} >
            <div className="w-full sm:w-auto">
              <button className="flex items-center gap-2 px-2 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-md transition w-full justify-center group">
                <Github size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Connect to GitHub Gists</span>
              </button>
              <p className="text-xs text-zinc-500 mt-1 text-center sm:text-right">
                Sync and backup your snippets to a GitHub Gists
              </p>
            </div></Link>
          </div>

          
          <div className="space-y-3 sm:space-y-2 mt-4">
            <div className="flex items-center gap-2 text-zinc-400 justify-center sm:justify-start">
              <Key size={16} />
              <span className="font-mono text-sm break-all">
                {showApiKey ? user.apiKey : '•'.repeat(user.apiKey.length)}
              </span>
              <button 
                onClick={() => setShowApiKey(!showApiKey)}
                className="p-1 hover:bg-zinc-800 rounded transition flex-shrink-0"
                title={showApiKey ? 'Hide API Key' : 'Show API Key'}
              >
                {showApiKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            
            <button 
              onClick={generateNewApiKey}
              className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-md text-sm transition w-full sm:w-auto justify-center"
            >
              <RefreshCw size={14} />
              <span>Generate New API Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;