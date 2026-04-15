import React from 'react';
import { Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative bg-[#0B0F14] border-t border-white/5 py-8" data-testid="footer">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="text-center md:text-left">
            <h3 className="text-white font-heading font-bold text-lg mb-1">
              Open Circuit Solutions
            </h3>
            <p className="text-[#A1A1AA] text-sm">Building Digital Excellence</p>
          </div>

          <div className="flex items-center space-x-2 text-[#A1A1AA] text-sm">
            <Mail className="w-4 h-4" />
            <a
              href="mailto:dante.ivery@opencircuitsolutions.com"
              className="hover:text-[#D4AF37] transition-colors"
            >
              dante.ivery@opencircuitsolutions.com
            </a>
          </div>

          <div className="text-[#A1A1AA] text-sm">
            <p>&copy; {new Date().getFullYear()} Open Circuit Solutions LLC</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
