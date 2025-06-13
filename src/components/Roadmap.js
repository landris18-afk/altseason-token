'use client';

import React from 'react';

const Roadmap = () => {
    return (
        <section id="roadmap" className="relative py-20 px-4 md:px-8 lg:px-16 bg-black">
            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="text-center mb-20">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Roadmap
                    </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Phase 1 */}
                    <div className="group relative bg-gradient-to-br from-black to-gray-900 p-8 rounded-2xl border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">Phase 1</h3>
                                <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-semibold border border-yellow-500/20">Current</span>
                            </div>
                            <ul className="space-y-5 text-gray-300">
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Launch on Pump.fun</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Community Building</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Social Media Presence</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Initial Marketing Push</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="group relative bg-gradient-to-br from-black to-gray-900 p-8 rounded-2xl border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">Phase 2</h3>
                                <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-semibold border border-yellow-500/20">Upcoming</span>
                            </div>
                            <ul className="space-y-5 text-gray-300">
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">CEX Listings</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Partnership Announcements</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Enhanced Marketing</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Community Events</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="group relative bg-gradient-to-br from-black to-gray-900 p-8 rounded-2xl border-2 border-yellow-500/30 hover:border-yellow-500 transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-yellow-500/20">
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-300 bg-clip-text text-transparent">Phase 3</h3>
                                <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-500 rounded-full text-sm font-semibold border border-yellow-500/20">Future</span>
                            </div>
                            <ul className="space-y-5 text-gray-300">
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Major Exchange Listings</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Global Marketing Campaign</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Ecosystem Expansion</span>
                                </li>
                                <li className="flex items-center group/item">
                                    <span className="text-yellow-500 mr-3 group-hover/item:text-yellow-400 transition-colors">•</span>
                                    <span className="group-hover/item:text-white transition-colors">Long-term Development</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Roadmap; 