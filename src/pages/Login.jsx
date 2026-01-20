import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Hexagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // --- Mock Authentication Logic ---
    // Using a promise to simulate network request properly
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (email === 'admin@a.com' && password === '123') {
      localStorage.setItem('userRole', 'admin');
      localStorage.setItem('userName', 'Super Admin');
      navigate('/dashboard');
    } else if (email === 'operator@a.com' && password === '123') {
      localStorage.setItem('userRole', 'operator');
      localStorage.setItem('userName', 'Branch Operator');
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
      setLoading(false);
    }
  };

  // --- Animation Variants ---
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const shake = {
    hidden: { x: 0 },
    visible: { x: [-10, 10, -10, 10, 0], transition: { duration: 0.4 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col md:flex-row min-h-[600px]"
      >
        
        {/* --- Left Side: Visual / Branding --- */}
        <div className="relative w-full md:w-1/2 bg-blue-600 p-12 text-white flex flex-col justify-between overflow-hidden">
          {/* Animated Background Shapes */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-20 -right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70"
          />

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-6">
              <Hexagon size={32} fill="currentColor" className="text-white" />
              <span className="text-2xl font-bold tracking-wide">FumiManager</span>
            </div>
            <motion.h1 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold leading-tight mb-4"
            >
              Manage Your <br/> Operations Efficiently.
            </motion.h1>
            <motion.p 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-blue-100 text-lg"
            >
              Streamline fumigation certificates, stock tracking, and billing in one secure portal.
            </motion.p>
          </div>

          <div className="relative z-10 flex gap-2">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="w-2 h-2 rounded-full bg-white/50" 
              />
            ))}
          </div>
        </div>

        {/* --- Right Side: Login Form --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white relative">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
            className="max-w-md mx-auto w-full"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h2>
              <p className="text-slate-500">Please enter your details to sign in.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase">Password</label>
                  <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-800">Forgot Password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div 
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={shake}
                    className="flex items-center gap-2 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100"
                  >
                    <AlertCircle size={16} />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={loading}
                className={`w-full py-3.5 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
              >
                {loading ? (
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                ) : (
                  <>
                    Sign In <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="flex flex-col gap-2 text-xs text-slate-400 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 size={12} className="text-green-500"/>
                    <span>Secure Encryption</span>
                  </div>
                  <div className="flex justify-center gap-4 mt-2 font-mono bg-slate-50 p-2 rounded border border-slate-100">
                    <span>Admin: admin@a.com / 123</span>
                    <span>User: operator@a.com / 123</span>
                  </div>
               </div>
            </div>

          </motion.div>
        </div>

      </motion.div>
    </div>
  );
};

export default Login;