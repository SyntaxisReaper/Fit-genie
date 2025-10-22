import React, { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';

const Contact = () => {
  const { showSuccess, showError } = useNotification();
  
  // Form states
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    issueType: 'technical',
    priority: 'medium',
    description: '',
    deviceInfo: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('contact');

  // Contact categories
  const contactCategories = [
    { value: 'general', label: 'General Inquiry', icon: '💬' },
    { value: 'business', label: 'Business Partnership', icon: '🤝' },
    { value: 'press', label: 'Press & Media', icon: '📰' },
    { value: 'feedback', label: 'Feedback & Suggestions', icon: '💡' },
    { value: 'bug', label: 'Bug Report', icon: '🐛' }
  ];

  // Support issue types
  const supportIssueTypes = [
    { value: 'technical', label: 'Technical Issue', icon: '⚙️' },
    { value: 'account', label: 'Account Problem', icon: '👤' },
    { value: 'billing', label: 'Billing Question', icon: '💳' },
    { value: 'feature', label: 'Feature Request', icon: '✨' },
    { value: 'other', label: 'Other', icon: '❓' }
  ];

  // Team members
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Co-founder',
      email: 'sarah@stylinapp.com',
      image: 'https://via.placeholder.com/120x120/6366f1/ffffff?text=SJ',
      bio: 'Fashion tech visionary with 10+ years in AI and fashion industry.',
      social: { linkedin: '#', twitter: '#' }
    },
    {
      name: 'Alex Chen',
      role: 'CTO & Co-founder',
      email: 'alex@stylinapp.com',
      image: 'https://via.placeholder.com/120x120/8b5cf6/ffffff?text=AC',
      bio: 'AI researcher and full-stack developer specializing in computer vision.',
      social: { linkedin: '#', github: '#' }
    },
    {
      name: 'Maya Patel',
      role: 'Head of Design',
      email: 'maya@stylinapp.com',
      image: 'https://via.placeholder.com/120x120/ec4899/ffffff?text=MP',
      bio: 'UX/UI designer passionate about making technology accessible and beautiful.',
      social: { linkedin: '#', dribbble: '#' }
    },
    {
      name: 'David Rodriguez',
      role: 'Head of Customer Success',
      email: 'david@stylinapp.com',
      image: 'https://via.placeholder.com/120x120/10b981/ffffff?text=DR',
      bio: 'Customer experience expert dedicated to user satisfaction and support.',
      social: { linkedin: '#', twitter: '#' }
    }
  ];

  // Handle form submissions
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Contact form submitted:', contactForm);
      showSuccess('Message sent successfully! We\'ll get back to you within 24 hours.');
      
      // Reset form
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: '',
        category: 'general'
      });
    } catch (error) {
      showError('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSupportSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Support form submitted:', supportForm);
      showSuccess('Support ticket created! Ticket #' + Math.random().toString(36).substr(2, 9).toUpperCase());
      
      // Reset form
      setSupportForm({
        name: '',
        email: '',
        issueType: 'technical',
        priority: 'medium',
        description: '',
        deviceInfo: ''
      });
    } catch (error) {
      showError('Failed to create support ticket. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem-200px)] bg-gradient-to-br from-gray-900 via-purple-900 to-black py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center space-x-3">
            <span>📞</span>
            <span>Contact Us</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            We'd love to hear from you! Get in touch with our team for support, partnerships, or just to say hello.
          </p>
        </div>

        {/* Quick Contact Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-semibold text-white mb-2">Email Us</h3>
            <p className="text-gray-300 text-sm mb-3">General inquiries and support</p>
            <a href="mailto:hello@stylinapp.com" className="text-purple-400 hover:text-purple-300 transition-colors">
              hello@stylinapp.com
            </a>
          </div>
          
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-semibold text-white mb-2">Live Chat</h3>
            <p className="text-gray-300 text-sm mb-3">Available 9 AM - 6 PM EST</p>
            <button className="text-purple-400 hover:text-purple-300 transition-colors">
              Start Chat
            </button>
          </div>
          
          <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center">
            <div className="text-3xl mb-3">🏢</div>
            <h3 className="font-semibold text-white mb-2">Visit Us</h3>
            <p className="text-gray-300 text-sm">
              123 Fashion Tech Ave<br/>
              San Francisco, CA 94105
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center mb-8">
          <div className="bg-gray-800 rounded-lg p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'contact' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              📝 General Contact
            </button>
            <button
              onClick={() => setActiveTab('support')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'support' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              🛠️ Technical Support
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'team' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
            >
              👥 Meet the Team
            </button>
          </div>
        </div>

        {/* Contact Form Tab */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <form onSubmit={handleContactSubmit} className="space-y-6">
                
                {/* Category Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">What can we help you with?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {contactCategories.map((category) => (
                      <label
                        key={category.value}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          contactForm.category === category.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={contactForm.category === category.value}
                          onChange={(e) => setContactForm({ ...contactForm, category: e.target.value })}
                          className="hidden"
                        />
                        <span className="text-xl">{category.icon}</span>
                        <span className="text-white text-sm">{category.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name and Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-white font-medium mb-2">Subject *</label>
                  <input
                    type="text"
                    required
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Brief description of your message"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-white font-medium mb-2">Message *</label>
                  <textarea
                    required
                    rows={6}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>📧</span>
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Support Form Tab */}
        {activeTab === 'support' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8">
              <form onSubmit={handleSupportSubmit} className="space-y-6">
                
                {/* Issue Type */}
                <div>
                  <label className="block text-white font-medium mb-3">What type of issue are you experiencing?</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {supportIssueTypes.map((type) => (
                      <label
                        key={type.value}
                        className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          supportForm.issueType === type.value
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-gray-600 hover:border-gray-500 bg-gray-800/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="issueType"
                          value={type.value}
                          checked={supportForm.issueType === type.value}
                          onChange={(e) => setSupportForm({ ...supportForm, issueType: e.target.value })}
                          className="hidden"
                        />
                        <span className="text-xl">{type.icon}</span>
                        <span className="text-white text-sm">{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Name, Email, Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Name *</label>
                    <input
                      type="text"
                      required
                      value={supportForm.name}
                      onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Email *</label>
                    <input
                      type="email"
                      required
                      value={supportForm.email}
                      onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-white font-medium mb-2">Priority</label>
                    <select
                      value={supportForm.priority}
                      onChange={(e) => setSupportForm({ ...supportForm, priority: e.target.value })}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🟠 High</option>
                      <option value="urgent">🔴 Urgent</option>
                    </select>
                  </div>
                </div>

                {/* Issue Description */}
                <div>
                  <label className="block text-white font-medium mb-2">Describe the issue *</label>
                  <textarea
                    required
                    rows={5}
                    value={supportForm.description}
                    onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Please provide as much detail as possible about the issue you're experiencing..."
                  />
                </div>

                {/* Device Info */}
                <div>
                  <label className="block text-white font-medium mb-2">Device/Browser Information</label>
                  <textarea
                    rows={3}
                    value={supportForm.deviceInfo}
                    onChange={(e) => setSupportForm({ ...supportForm, deviceInfo: e.target.value })}
                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="e.g., Chrome on Windows 10, iPhone 13 Safari, etc."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-all hover:scale-105 flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Creating Ticket...</span>
                    </>
                  ) : (
                    <>
                      <span>🎫</span>
                      <span>Create Support Ticket</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                We're a passionate group of innovators, designers, and technologists working to revolutionize how people interact with fashion through AI.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member) => (
                <div key={member.name} className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 text-center hover:scale-105 transition-transform">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-purple-500/50"
                  />
                  <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                  <p className="text-purple-400 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-300 text-sm mb-4">{member.bio}</p>
                  
                  <div className="flex justify-center space-x-3 mb-4">
                    {Object.entries(member.social).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        className="text-gray-400 hover:text-white transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {platform === 'linkedin' && '💼'}
                        {platform === 'twitter' && '🐦'}
                        {platform === 'github' && '💻'}
                        {platform === 'dribbble' && '🎨'}
                      </a>
                    ))}
                  </div>
                  
                  <a
                    href={`mailto:${member.email}`}
                    className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm transition-all"
                  >
                    <span>📧</span>
                    <span>Contact</span>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Contact;