// frontend-web/src/pages/LandingPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Layout/Header';
import { FiActivity, FiShield, FiCloud, FiCheck, FiArrowRight, FiTrendingUp, FiDatabase } from 'react-icons/fi';

const FeatureCard = ({ icon, title, desc, color }) => (
    <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white text-2xl mb-6 shadow-lg`}>
            {icon}
        </div>
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
);

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 font-sans overflow-x-hidden">
            <Header />

            {/* HERO SECTION */}
            <section className="pt-32 pb-20 lg:pt-40 lg:pb-32 relative overflow-hidden">
                {/* Clean Background */}
                <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[800px] h-[800px] bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[600px] h-[600px] bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        
                        {/* Left Text Content */}
                        <div className="lg:w-1/2 text-center lg:text-left">
                            
                            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white leading-tight mb-6">
                                Analytics for <br/>
                                <span className="text-blue-600 dark:text-blue-500">Modern Engineering</span>
                            </h1>
                            
                            <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed font-medium">
                                Transform your static equipment data into a dynamic intelligence engine. Real-time monitoring, safety compliance, and predictive insights in one premier dashboard.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <button 
                                    onClick={() => navigate('/login', { state: { isRegistering: true } })}
                                    className="px-10 py-4 bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold rounded-2xl shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                                >
                                    Access Analytics Platform <FiArrowRight />
                                </button>
                                <button 
                                    onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                                    className="px-10 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white border-2 border-slate-200 dark:border-slate-700 text-lg font-bold rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 transition-all"
                                >
                                    See Demo
                                </button>
                            </div>
                        </div>

                        {/* Right Image - Charts Preview */}
                        <div className="lg:w-1/2 relative">
                            <div className="absolute inset-0 bg-blue-500 rounded-3xl transform rotate-6 blur-2xl opacity-20"></div>
                            
                            <div className="relative bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform hover:-rotate-1 transition-all duration-500">
                                {/* Browser Bar UI */}
                                <div className="bg-slate-100 dark:bg-slate-900 px-6 py-4 border-b border-slate-200 dark:border-slate-700 flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                
                                {/* Image Container */}
                                <div className="aspect-[16/10] bg-slate-50 dark:bg-slate-900 relative">
                                    {/* UPDATED IMAGE URL */}
                                    <img 
                                        src="https://spreadsheetweb.com/wp-content/uploads/2019/04/pie-chart-excel-1080x675.jpg" 
                                        alt="Data Analytics Dashboard" 
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
                                </div>
                            </div>
                            
                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 flex items-center gap-4 animate-bounce">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600">
                                    <FiActivity size={24} />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold">System Status</p>
                                    <p className="text-lg font-black text-slate-800 dark:text-white">Optimal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20 max-w-3xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-black mb-6 text-slate-900 dark:text-white">The ChemSight Advantage</h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            We combined advanced data science with intuitive design to create the ultimate tool for process safety management.
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard 
                            icon={<FiTrendingUp />}
                            title="Predictive Trends"
                            desc="Visualize complex correlations between pressure, flow, and temperature with our advanced charting engine."
                            color="bg-blue-600"
                        />
                        <FeatureCard 
                            icon={<FiShield />}
                            title="Smart Safety Logic"
                            desc="Automated algorithms detect critical thresholds (e.g., Pressure > 120psi) and alert you instantly."
                            color="bg-red-500"
                        />
                        <FeatureCard 
                            icon={<FiDatabase />}
                            title="Data Continuity"
                            desc="Your data survives the session. We use persistent cloud databases to ensure your history is never lost."
                            color="bg-amber-500"
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-6">
                    <div className="bg-blue-900 rounded-[3rem] p-12 md:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-900/20">
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to upgrade your workflow?</h2>
                            <p className="text-blue-200 text-xl mb-10 max-w-2xl mx-auto">
                                Join thousands of chemical engineers who rely on ChemSight for data accuracy and operational safety.
                            </p>
                            <button 
                                onClick={() => navigate('/login', { state: { isRegistering: true } })}
                                className="px-12 py-5 bg-white text-blue-900 font-black text-lg rounded-2xl hover:bg-blue-50 transition-transform transform hover:scale-105 shadow-xl"
                            >
                                Get Started for Free
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-slate-50 dark:bg-slate-900 py-12 border-t border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-6 text-center text-slate-500 font-medium">
                    <p>&copy; 2025 ChemSight Analytics. Crafted for Engineers.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;