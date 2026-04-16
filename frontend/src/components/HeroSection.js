import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Code, Smartphone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import EditableText from './EditableText';
import EditableImage from './EditableImage';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden" data-testid="hero-section">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0F14] via-[#151920] to-[#0B0F14]"></div>
      
      {/* Animated Circuit Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 border border-[#D4AF37] rounded-lg rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 right-20 w-48 h-48 border border-[#D4AF37] rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 border border-[#D4AF37] rotate-12 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-32 md:py-0 w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="bg-[#D4AF37]/10 text-[#D4AF37] px-4 py-2 rounded-full text-sm font-medium border border-[#D4AF37]/20">
                Dante Ivery - CEO & Lead Developer
              </span>
            </motion.div>

            <EditableText
              contentId="hero_title"
              as="h1"
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight tracking-tight"
            >
              Building Digital Solutions That Matter
            </EditableText>

            <EditableText
              contentId="hero_subtitle"
              as="p"
              className="text-xl text-[#A1A1AA] leading-relaxed"
            >
              Transforming ideas into powerful apps and websites
            </EditableText>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <a
                href="#contact"
                className="group bg-[#D4AF37] text-[#0B0F14] px-8 py-4 rounded-full font-semibold hover:bg-[#F5C542] transition-all hover:scale-105 active:scale-95 flex items-center space-x-2"
                data-testid="hero-contact-btn"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                to="/work"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] px-8 py-4 rounded-full font-semibold hover:bg-[#D4AF37]/10 transition-all"
                data-testid="hero-work-btn"
              >
                View My Work
              </Link>
            </motion.div>

            {/* Tech Icons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center space-x-8 pt-8 border-t border-white/10"
            >
              <div className="flex items-center space-x-2 text-[#A1A1AA]">
                <Code className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm">Web Apps</span>
              </div>
              <div className="flex items-center space-x-2 text-[#A1A1AA]">
                <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm">Mobile Apps</span>
              </div>
              <div className="flex items-center space-x-2 text-[#A1A1AA]">
                <Globe className="w-5 h-5 text-[#D4AF37]" />
                <span className="text-sm">Websites</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#D4AF37]/20 blur-3xl rounded-full"></div>
              
              {/* Image Container */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-[#D4AF37]/30 shadow-2xl">
                <EditableImage
                  contentId="hero_image"
                  alt="Dante Ivery - CEO"
                  className="w-full h-auto object-cover"
                />
              </div>

              {/* Floating Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -bottom-6 -left-6 bg-[#151920] border border-white/10 rounded-xl p-4 backdrop-blur-lg"
              >
                <EditableText
                  contentId="hero_stat_projects_value"
                  as="div"
                  className="text-3xl font-bold text-[#D4AF37]"
                >
                  10+
                </EditableText>
                <EditableText
                  contentId="hero_stat_projects_label"
                  as="div"
                  className="text-sm text-[#A1A1AA]"
                >
                  Projects Delivered
                </EditableText>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
                className="absolute -top-6 -right-6 bg-[#151920] border border-white/10 rounded-xl p-4 backdrop-blur-lg"
              >
                <EditableText
                  contentId="hero_stat_satisfaction_value"
                  as="div"
                  className="text-3xl font-bold text-[#D4AF37]"
                >
                  100%
                </EditableText>
                <EditableText
                  contentId="hero_stat_satisfaction_label"
                  as="div"
                  className="text-sm text-[#A1A1AA]"
                >
                  Client Satisfaction
                </EditableText>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-6 h-10 border-2 border-[#D4AF37] rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
