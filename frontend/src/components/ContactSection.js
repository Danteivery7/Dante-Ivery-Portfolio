import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { toast } from 'sonner';
import * as api from '../services/api';
import { useEdit } from '../context/EditContext';

const HiddenEditButton = () => {
  const { isAuthenticated, isEditMode, login, logout, setIsEditMode } = useEdit();
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await login(username, password);
    if (result.success) {
      setIsEditMode(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
      toast.success(result.message || 'Edit mode enabled');
    } else {
      toast.error(result.message || 'Invalid credentials');
    }
  };

  const handleToggle = () => {
    if (!isEditMode) {
      if (isAuthenticated) {
        setIsEditMode(true);
        toast.success('Edit mode enabled');
        return;
      }
      setShowLogin(true);
    } else {
      logout();
      toast.info('Edit mode disabled');
    }
  };

  return (
    <>
      <button
        onClick={handleToggle}
        className="mt-4 p-1 opacity-0 hover:opacity-100 transition-opacity"
        aria-label="Edit"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-[#151920]">
          <line x1="2" y1="2" x2="6" y2="6" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="2" x2="14" y2="6" stroke="currentColor" strokeWidth="1" />
          <line x1="2" y1="10" x2="6" y2="14" stroke="currentColor" strokeWidth="1" />
          <line x1="10" y1="10" x2="14" y2="14" stroke="currentColor" strokeWidth="1" />
        </svg>
      </button>

      {showLogin && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setShowLogin(false)}>
          <div className="bg-[#151920] p-6 rounded-lg max-w-sm w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-heading font-bold text-white mb-4">Admin Login</h3>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                  autoComplete="username"
                />
              </div>
              <div>
                <label className="block text-sm text-[#A1A1AA] mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-3 text-white outline-none focus:border-[#D4AF37]"
                  autoComplete="current-password"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#D4AF37] text-[#0B0F14] py-2.5 rounded-full font-semibold hover:bg-[#F5C542] transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

const ContactSection = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.submitContactForm(formData);
      toast.success(response.data.message || 'Message sent successfully!');
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Failed to send message. Please try again.';
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      label: 'Phone',
      value: '(941) 205-4590',
      link: 'tel:9412054590',
    },
    {
      icon: Mail,
      label: 'Email',
      value: 'dante.ivery@opencircuitsolutions.com',
      link: 'mailto:dante.ivery@opencircuitsolutions.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Online / Remote',
      link: null,
    },
    {
      icon: Clock,
      label: 'Business Hours',
      value: 'Monday – Friday 9:00 AM – 5:00 PM EST',
      link: null,
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="contact" data-testid="contact-section">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B0F14] to-[#151920]"></div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 tracking-tight">
            Let's Build Something Great
          </h2>
          <p className="text-lg text-[#A1A1AA] max-w-2xl mx-auto">
            Have a project in mind? Get in touch and let's discuss how I can help bring your vision to life.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="first_name" className="block text-sm text-[#A1A1AA] mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="John"
                    data-testid="first-name-input"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm text-[#A1A1AA] mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37] transition-colors"
                    placeholder="Doe"
                    data-testid="last-name-input"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm text-[#A1A1AA] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="john@example.com"
                  data-testid="email-input"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm text-[#A1A1AA] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="(123) 456-7890"
                  data-testid="phone-input"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm text-[#A1A1AA] mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37] transition-colors"
                  placeholder="Project Inquiry"
                  data-testid="subject-input"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm text-[#A1A1AA] mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="6"
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-lg p-4 text-white outline-none focus:border-[#D4AF37] transition-colors resize-none"
                  placeholder="Tell me about your project..."
                  data-testid="message-input"
                ></textarea>
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#D4AF37] text-[#0B0F14] py-4 rounded-full font-semibold hover:bg-[#F5C542] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                data-testid="submit-btn"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Form</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center"
          >
            <div className="bg-[#151920] border border-white/5 rounded-2xl p-8 w-full">
              <h3 className="text-2xl font-heading font-semibold text-white mb-8 text-center">
                Get In Touch
              </h3>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center space-x-4"
                    data-testid={`contact-info-${index}`}
                  >
                    <div className="bg-[#D4AF37]/10 p-3 rounded-lg flex-shrink-0">
                      <info.icon className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm text-[#A1A1AA] mb-1">{info.label}</div>
                      {info.link ? (
                        <a
                          href={info.link}
                          className="text-white hover:text-[#D4AF37] transition-colors font-medium"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div className="text-white font-medium">{info.value}</div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/10 text-center">
                <p className="text-sm text-[#A1A1AA]">
                  Saturday: 9:00 AM – 1:00 PM
                </p>
                <p className="text-sm text-[#A1A1AA] mt-1">
                  Sunday: By appointment or urgent business only
                </p>
                <HiddenEditButton />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
