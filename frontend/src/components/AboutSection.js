import React from 'react';
import { motion } from 'framer-motion';
import { Code2, Palette, Zap, CircuitBoard } from 'lucide-react';
import EditableText from './EditableText';

const AboutSection = () => {
  const services = [
    {
      icon: Code2,
      title: 'Web Development',
      description: 'Custom web applications built with modern technologies for optimal performance.',
    },
    {
      icon: Palette,
      title: 'App Development',
      description: 'Native and cross-platform mobile applications that users love.',
    },
    {
      icon: Zap,
      title: 'UI/UX Design',
      description: 'Beautiful, intuitive interfaces that enhance user experience.',
    },
  ];

  return (
    <section className="relative py-24 md:py-32 overflow-hidden" id="about" data-testid="about-section">
      {/* Background */}
      <div className="absolute inset-0 bg-[#0B0F14]"></div>
      
      <div className="relative max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mb-16"
        >
          <div className="flex items-center space-x-3 mb-4">
            <CircuitBoard className="w-8 h-8 text-[#D4AF37]" />
            <span className="text-[#D4AF37] font-mono text-sm">WHO I AM</span>
          </div>
          
          <EditableText
            contentId="about_title"
            as="h2"
            className="text-4xl md:text-5xl font-heading font-bold text-white mb-6 leading-tight tracking-tight"
          >
            About Open Circuit Solutions
          </EditableText>

          <EditableText
            contentId="about_description"
            as="p"
            className="text-lg text-[#A1A1AA] leading-relaxed"
          >
            I'm Dante Ivery, CEO of Open Circuit Solutions. I specialize in building custom applications and websites that help businesses thrive in the digital world. From mobile apps to responsive websites, I deliver solutions that combine cutting-edge technology with intuitive design.
          </EditableText>
        </motion.div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative bg-[#151920] border border-white/5 rounded-2xl p-8 hover:border-[#D4AF37]/50 transition-all duration-300"
              data-testid={`service-card-${index}`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-[#D4AF37]/0 group-hover:bg-[#D4AF37]/5 rounded-2xl transition-all duration-300"></div>
              
              <div className="relative">
                <div className="bg-[#D4AF37]/10 w-14 h-14 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-7 h-7 text-[#D4AF37]" />
                </div>

                <h3 className="text-xl font-heading font-semibold text-white mb-3">
                  {service.title}
                </h3>

                <p className="text-[#A1A1AA] leading-relaxed">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center border-t-2 border-[#D4AF37] pt-6" data-testid="stat-0">
            <EditableText
              contentId="stat_projects_value"
              as="div"
              className="text-4xl font-heading font-bold text-[#D4AF37] mb-2"
            >
              10+
            </EditableText>
            <EditableText
              contentId="stat_projects_label"
              as="div"
              className="text-sm text-[#A1A1AA]"
            >
              Projects Completed
            </EditableText>
          </div>
          <div className="text-center border-t-2 border-[#D4AF37] pt-6" data-testid="stat-1">
            <EditableText
              contentId="stat_clients_value"
              as="div"
              className="text-4xl font-heading font-bold text-[#D4AF37] mb-2"
            >
              5+
            </EditableText>
            <EditableText
              contentId="stat_clients_label"
              as="div"
              className="text-sm text-[#A1A1AA]"
            >
              Happy Clients
            </EditableText>
          </div>
          <div className="text-center border-t-2 border-[#D4AF37] pt-6" data-testid="stat-2">
            <EditableText
              contentId="stat_experience_value"
              as="div"
              className="text-4xl font-heading font-bold text-[#D4AF37] mb-2"
            >
              3+
            </EditableText>
            <EditableText
              contentId="stat_experience_label"
              as="div"
              className="text-sm text-[#A1A1AA]"
            >
              Years Experience
            </EditableText>
          </div>
          <div className="text-center border-t-2 border-[#D4AF37] pt-6" data-testid="stat-3">
            <EditableText
              contentId="stat_support_value"
              as="div"
              className="text-4xl font-heading font-bold text-[#D4AF37] mb-2"
            >
              24/7
            </EditableText>
            <EditableText
              contentId="stat_support_label"
              as="div"
              className="text-sm text-[#A1A1AA]"
            >
              Support Available
            </EditableText>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
