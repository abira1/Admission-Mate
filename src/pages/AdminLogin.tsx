import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogInIcon, ShieldIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function AdminLogin() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError('');
      await signInWithGoogle();
      navigate('/admin');
    } catch (err: any) {
      if (err.message === 'UNAUTHORIZED_EMAIL') {
        setError('❌ Access Denied: Your email is not authorized for admin access.');
      } else {
        setError('Failed to sign in. Please try again.');
      }
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-3xl border-4 border-black p-6 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-yellow-400 rounded-full border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <ShieldIcon className="w-10 h-10 sm:w-12 sm:h-12 text-black" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-black text-black text-center mb-3 sm:mb-4">
            Admin Login
          </h1>
          <p className="text-gray-700 font-bold text-center mb-8 text-base sm:text-lg">
            Sign in to access the admin panel
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border-3 border-black rounded-xl">
              <p className="text-red-600 font-bold text-sm">{error}</p>
            </div>
          )}

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-yellow-400 active:bg-yellow-500 text-black py-5 sm:py-4 px-6 rounded-xl font-black text-lg border-3 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-x-[3px] active:translate-y-[3px] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-black border-t-yellow-400"></div>
            ) : (
              <>
                <LogInIcon className="w-6 h-6" />
                Sign in with Google
              </>
            )}
          </motion.button>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-6 text-gray-700 font-bold text-base hover:text-indigo-600 hover:underline transition-colors py-3"
          >
            ← Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
