'use client';

import Stairs from '@/src/lib/animations/StairTransition';
import { BigTitle } from '../components/common/BigTitle';
import { CyberpunkFooter } from '../components/Footer/Footer';
import { CyberpunkHeader } from '../components/Header/CyberpunkHeader';
import { motion } from 'framer-motion';

export default function PrivacyPolicy() {
  return (
    <Stairs backgroundColor='ffffff'>
      <div className="main-container bg-gray-200 text-black/80 min-h-screen">
        <CyberpunkHeader />
        
        <BigTitle 
          text="PRIVACY PROTOCOL" 
          highlightWords={["PROTOCOL"]} 
          highlightColor='neon-blue'
          className='py-50 bg-yellow-500' 
        />
          
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto px-6 py-12 font-mono"
        >
          {/* Policy Header */}
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16 text-center"
          >
            <div className="text-neon-blue text-lg flex justify-center gap-8">
              <p>Effective: <span className="text-neon-green">08.04.2025</span></p>
              <p>Last Update: <span className="text-neon-green">08.04.2025</span></p>
            </div>
          </motion.div>

          {/* 1. Introduction */}
          <motion.section
            initial={{ x: -50 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16 border-b border-neon-purple pb-8"
          >
            <h2 className="text-neon-yellow text-3xl mb-6 font-bold tracking-wider">
              [1.0] SYSTEM INTRODUCTION
            </h2>
            <div className="space-y-4 leading-relaxed">
              <p>
                <span className="text-neon-green font-bold">AI HAVEN LABS</span> (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) 
                is committed to protecting the privacy of our users. This Privacy Policy outlines how we collect, use, disclose, 
                and safeguard your information when you interact with our suite of AI-powered applications (&quot;Services&quot;), 
                including both free and paid subscription features.
              </p>
              <p className="border-l-4 border-neon-red pl-4 py-2 mt-6 bg-gray-300/50">
                <span className="text-neon-pink font-bold">WARNING:</span> By accessing our systems, you consent to these protocols. 
                Terminate connection now if non-compliant.
              </p>
            </div>
          </motion.section>

          {/* 2. Information Collection */}
          <motion.section
            initial={{ x: 50 }}
            whileInView={{ x: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-neon-aqua text-3xl mb-6 font-bold tracking-wider">
              [2.0] DATA HARVEST MATRIX
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {/* Personal Data */}
              <div className="bg-gray-300/80 p-6 border-l-4 border-neon-blue rounded-lg">
                <h3 className="text-neon-pink text-xl mb-4 font-bold flex items-center">
                  <span className="inline-block w-3 h-3 bg-neon-pink rounded-full mr-2"></span>
                  PERSONAL IDENTIFIERS
                </h3>
                <ul className="space-y-3 list-disc list-inside marker:text-neon-blue">
                  <li>Neural Signature (Name)</li>
                  <li>Quantum Mail Address</li>
                  <li>Bio-Comms Frequency (Phone)</li>
                  <li>Physical Coordinates</li>
                  <li>Payment Details</li>
                  <li>Access Credentials</li>
                </ul>
              </div>

              {/* Non-Personal */}
              <div className="bg-gray-300/80 p-6 border-l-4 border-neon-green rounded-lg">
                <h3 className="text-neon-green text-xl mb-4 font-bold flex items-center">
                  <span className="inline-block w-3 h-3 bg-neon-green rounded-full mr-2"></span>
                  SYSTEM TELEMETRY
                </h3>
                <ul className="space-y-3 list-disc list-inside marker:text-neon-green">
                  <li>Browser DNA</li>
                  <li>IP Coordinates</li>
                  <li>Neural Cookies</li>
                  <li>Interaction Patterns</li>
                  <li>Session Duration</li>
                </ul>
              </div>

              {/* AI Data */}
              <div className="bg-gray-300/80 p-6 border-l-4 border-neon-purple rounded-lg">
                <h3 className="text-neon-purple text-xl mb-4 font-bold flex items-center">
                  <span className="inline-block w-3 h-3 bg-neon-purple rounded-full mr-2"></span>
                  NEURAL NETWORK INPUTS
                </h3>
                <ul className="space-y-3 list-disc list-inside marker:text-neon-purple">
                  <li>User Query Data</li>
                  <li>Conversation History</li>
                  <li>Model Training Signals</li>
                  <li>Behavioral Data</li>
                </ul>
              </div>
            </div>
          </motion.section>

          {/* 3. Data Usage */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-16 bg-gray-300/80 p-8 border-l-4 border-neon-yellow rounded-lg"
          >
            <h2 className="text-neon-yellow text-3xl mb-6 font-bold tracking-wider">
              [3.0] DATA PROCESSING OBJECTIVES
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Service Optimization & Enhancements",
                "Neural Support Interfaces",
                "Personalized experience",
                "Corporate Compliance Directives",
                "Legal & Security compliance"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <span className="text-neon-cyan mr-3 mt-1">✔</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* 4. Data Sharing */}
          <motion.section
            initial={{ scale: 0.98 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-neon-red text-3xl mb-6 font-bold tracking-wider">
              [4.0] DATA TRANSMISSION PROTOCOLS
            </h2>
            
            <div className="space-y-6">
              <p className="text-neon-green border-l-4 border-neon-green pl-4 py-2 bg-gray-300/50">
                WE DO NOT TRADE OR SELL YOUR PERSONAL DATA
              </p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Service Nodes",
                    description: "Secure third-party processors (Stripe/PayPal networks)",
                    color: "border-neon-blue"
                  },
                  {
                    title: "Legal Channels",
                    description: "When required by Cyber Law mandates",
                    color: "border-neon-purple"
                  },
                  {
                    title: "Trusted Partners",
                    description: "With explicit user authorization",
                    color: "border-neon-aqua"
                  }
                ].map((item, index) => (
                  <div key={index} className={`border-l-4 ${item.color} pl-4 py-2 bg-gray-300/50 rounded`}>
                    <h3 className="font-bold mb-1">{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* 5. Data Security */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16 bg-gray-300/80 p-8 border-l-4 border-neon-electric rounded-lg"
          >
            <h2 className="text-neon-cyan text-3xl mb-6 font-bold tracking-wider">
              [5.0] QUANTUM ENCRYPTION STANDARDS
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "SSL/TLS Encryption", icon: "🔐", desc: "256-bit neural scrambling" },
                { title: "Bio-Access Controls", icon: "🧬", desc: "Multi-factor authentication" },
                { title: "Firewall Audits", icon: "🛡️", desc: "Monthly vulnerability scans" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  whileHover={{ y: -3 }}
                  className="text-center"
                >
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="text-neon-cyan text-xl mb-2">{item.title}</h3>
                  <p>{item.desc}</p>
                </motion.div>
              ))}
            </div>
            
            <p className="mt-8 text-center text-neon-yellow border-t border-neon-yellow/30 pt-6">
              WARNING: No system achieves 100% intrusion resistance
            </p>
          </motion.section>

          {/* 6. User Rights */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h2 className="text-neon-pink text-3xl mb-6 font-bold tracking-wider">
              [6.0] USER RIGHTS MANIFESTO
            </h2>
            <div className="space-y-4">
              <p>Under Digital Rights Act v5.3, you may:</p>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-disc list-inside marker:text-neon-pink">
                <li>Access your neural imprint</li>
                <li>Rectify corrupted data</li>
                <li>Request digital oblivion</li>
                <li>Opt-out of neuro-marketing</li>
                <li>Transfer consciousness data</li>
                <li>Revoke prior authorizations</li>
              </ul>
              <div className="mt-4 p-4 bg-gray-300/50 rounded border-l-4 border-neon-blue">
                <p>
                  Execute these rights via: <span className="text-neon-blue font-mono">privacy@aihavenlabs.com</span>
                </p>
              </div>
            </div>
          </motion.section>

          {/* 7. Cookie Protocols */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12"
          >
            <h2 className="text-neon-purple text-3xl mb-6 font-bold tracking-wider">
              [7.0] COOKIE PROTOCOLS
            </h2>
            <div className="space-y-4">
              <p>Neural cookies enable:</p>
              <ul className="list-disc list-inside marker:text-neon-purple space-y-2">
                <li>Identity verification sequences</li>
                <li>Analytics tracking (Google Quantum Analytics)</li>
                <li>Interface personalization matrices</li>
              </ul>
              <div className="mt-4 p-4 bg-gray-300/50 rounded border-l-4 border-neon-purple">
                <p className="font-bold">⚠️ WARNING:</p>
                <p>Disabling cookies may impair system functionality</p>
              </div>
            </div>
          </motion.section>

          {/* 8. External Node Warning */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-neon-red text-3xl mb-6 font-bold tracking-wider">
              [8.0] EXTERNAL NODE WARNING
            </h2>
            <div className="space-y-4">
              <p>Our neural network may link to external data nodes beyond our security perimeter.</p>
              <div className="p-4 bg-gray-300/50 rounded border-l-4 border-neon-red">
                <p className="font-mono text-sm">
                  <span className="text-neon-red font-bold">DISCLAIMER:</span> We assume no responsibility for third-party security protocols.
                </p>
              </div>
            </div>
          </motion.section>

          {/* 9. Minor Restrictions */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-neon-green text-3xl mb-6 font-bold tracking-wider">
              [9.0] MINOR RESTRICTIONS
            </h2>
            <div className="flex items-start gap-4 bg-gray-300/50 p-4 rounded border-l-4 border-neon-green">
              <div className="text-2xl">🧒</div>
              <p>Our systems reject neural patterns from unregistered users below consciousness level 13.</p>
            </div>
          </motion.section>

          {/* 10. Protocol Evolution */}
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-neon-cyan text-3xl mb-6 font-bold tracking-wider">
              [10.0] PROTOCOL EVOLUTION
            </h2>
            <div className="space-y-4">
              <p>This document may undergo cybernetic updates to adapt to new regulatory frameworks.</p>
              <div className="p-4 bg-gray-300/50 rounded border-l-4 border-neon-cyan">
                <p className="font-bold">CONTINUED USAGE CLAUSE:</p>
                <p>Persistent interface usage after updates constitutes automatic acceptance of new parameters.</p>
              </div>
            </div>
          </motion.section>

          {/* 11. Neural Communications */}
          <motion.section
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mt-20 text-center"
          >
            <h2 className="text-neon-blue text-4xl mb-8 font-bold tracking-wider">
              [11.0] NEURAL COMMUNICATIONS
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {[
                { 
                  title: "Quantum Transmission", 
                  detail: "privacy@aihavenlabs.com",
                  color: "border-neon-blue"
                },
                { 
                  title: "Holo-Address", 
                  detail: "Not yet available",
                  color: "border-neon-purple"
                },
                { 
                  title: "Bio-Comms", 
                  detail: "Not yet available",
                  color: "border-neon-yellow"
                }
              ].map((item, index) => (
                <div key={index} className={`border-t-4 ${item.color} pt-6`}>
                  <h3 className="text-xl mb-2">{item.title}</h3>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>

            <div className="border-t border-neon-yellow/30 pt-8">
              <h3 className="text-neon-yellow text-2xl mb-4">SYSTEM SUMMARY</h3>
              <div className="flex justify-center gap-8 flex-wrap">
                <p className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-neon-green rounded-full mr-2"></span>
                  We shield your data
                </p>
                <p className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-neon-red rounded-full mr-2"></span>
                  We never sell profiles
                </p>
                <p className="flex items-center">
                  <span className="inline-block w-2 h-2 bg-neon-blue rounded-full mr-2"></span>
                  You control access
                </p>
              </div>
            </div>
          </motion.section>

          {/* Final Message */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-20 text-center text-neon-cyan text-lg"
          >
            <p>Thank you for trusting</p>
            <p className="text-3xl font-bold mt-2">AI HAVEN LABS</p>
            <p className="text-xs mt-6 text-gray-500">
              Note: Consult Cyber Law specialists for GDPR/CCPA compliance verification
            </p>
          </motion.div>
        </motion.main>

        <CyberpunkFooter />
      </div>
    </Stairs>
  );
}