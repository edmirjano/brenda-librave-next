'use client';

import { motion } from 'framer-motion';
import {
  ArrowRight,
  Award,
  BookOpen,
  Clock,
  Coffee,
  Heart,
  Mail,
  MapPin,
  Monitor,
  Send,
  Star,
  Users,
  Zap,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { Link } from '@/navigation';

interface CareersPageClientProps {
  translations: any;
}

export function CareersPageClient({ translations }: CareersPageClientProps) {
  const benefits = [
    {
      title: translations('benefits.competitiveSalary.title'),
      description: translations('benefits.competitiveSalary.description'),
      icon: Award,
      color: 'green',
    },
    {
      title: translations('benefits.flexibleHours.title'),
      description: translations('benefits.flexibleHours.description'),
      icon: Clock,
      color: 'blue',
    },
    {
      title: translations('benefits.professionalDevelopment.title'),
      description: translations('benefits.professionalDevelopment.description'),
      icon: Zap,
      color: 'purple',
    },
    {
      title: translations('benefits.healthInsurance.title'),
      description: translations('benefits.healthInsurance.description'),
      icon: Heart,
      color: 'red',
    },
    {
      title: translations('benefits.extraVacation.title'),
      description: translations('benefits.extraVacation.description'),
      icon: Coffee,
      color: 'yellow',
    },
    {
      title: translations('benefits.freeBooks.title'),
      description: translations('benefits.freeBooks.description'),
      icon: BookOpen,
      color: 'indigo',
    },
  ];

  const positions = [
    {
      title: translations('positions.fullstack.title'),
      department: translations('positions.fullstack.department'),
      type: translations('positions.fullstack.type'),
      location: translations('positions.fullstack.location'),
      description: translations('positions.fullstack.description'),
      requirements: translations('positions.fullstack.requirements'),
      skills: translations('positions.fullstack.skills'),
      urgent: true,
    },
    {
      title: translations('positions.marketing.title'),
      department: translations('positions.marketing.department'),
      type: translations('positions.marketing.type'),
      location: translations('positions.marketing.location'),
      description: translations('positions.marketing.description'),
      requirements: translations('positions.marketing.requirements'),
      skills: translations('positions.marketing.skills'),
      urgent: false,
    },
    {
      title: translations('positions.customerService.title'),
      department: translations('positions.customerService.department'),
      type: translations('positions.customerService.type'),
      location: translations('positions.customerService.location'),
      description: translations('positions.customerService.description'),
      requirements: translations('positions.customerService.requirements'),
      skills: translations('positions.customerService.skills'),
      urgent: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <GlassCard 
              variant="crystal" 
              morphing={true} 
              glowEffect={true} 
              className="p-8 md:p-16 max-w-5xl mx-auto"
            >
              <motion.div
                className="w-24 h-24 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl mb-8"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <Users className="h-12 w-12 text-white" />
              </motion.div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold text-gray-900 mb-6">
                {translations('hero.title')}
              </h1>

              <p className="font-serif text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto">
                {translations('hero.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="#positions">
                  <LiquidButton 
                    variant="albanian" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    {translations('hero.cta')}
                  </LiquidButton>
                </Link>

                <Link href="/contact">
                  <LiquidButton 
                    variant="liquid" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {translations('hero.contact')}
                  </LiquidButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {translations('benefits.title')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {translations('benefits.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <GlassCard className="p-8 text-center h-full">
                    <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-${benefit.color}-500 to-${benefit.color}-600 rounded-2xl flex items-center justify-center`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Positions Section */}
      <section id="positions" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {translations('positions.title')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {translations('positions.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-8">
            {positions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                viewport={{ once: true }}
              >
                <GlassCard className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        {position.urgent && (
                          <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                            {translations('positions.urgent')}
                          </span>
                        )}
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                          {position.department}
                        </span>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{position.title}</h3>
                      
                      <div className="flex items-center gap-4 text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{position.location}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-6">{position.description}</p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">{translations('positions.requirements')}:</h4>
                        <ul className="space-y-2">
                          {position.requirements.map((req: string, reqIndex: number) => (
                            <li key={reqIndex} className="flex items-start gap-2">
                              <Star className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                              <span className="text-gray-700">{req}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">{translations('positions.skills')}:</h4>
                        <div className="flex flex-wrap gap-2">
                          {position.skills.map((skill: string, skillIndex: number) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:ml-8 lg:flex-shrink-0">
                      <LiquidButton
                        variant="albanian"
                        size="lg"
                        className="w-full lg:w-auto"
                      >
                        <Send className="w-5 h-5 mr-2" />
                        {translations('positions.apply')}
                      </LiquidButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <GlassCard 
              variant="crystal" 
              morphing={true} 
              glowEffect={true} 
              className="p-12 md:p-16 text-center bg-gradient-to-r from-red-500/10 to-red-600/10"
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {translations('cta.title')}
              </h2>
              <p className="font-serif text-xl text-gray-700 mb-10 max-w-3xl mx-auto">
                {translations('cta.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Link href="/contact">
                  <LiquidButton 
                    variant="albanian" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <Mail className="w-5 h-5 mr-2" />
                    {translations('cta.contact')}
                  </LiquidButton>
                </Link>

                <Link href="/about">
                  <LiquidButton 
                    variant="liquid" 
                    size="lg" 
                    className="min-w-[220px]"
                    morphing={true}
                    glowEffect={true}
                  >
                    <ArrowRight className="w-5 h-5 mr-2" />
                    {translations('cta.learnMore')}
                  </LiquidButton>
                </Link>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    </div>
  );
} 