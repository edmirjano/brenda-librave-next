'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, Send, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { z } from 'zod';

import { GlassCard } from '@/components/ui/GlassCard';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { GlassFormField } from '@/components/ui/form/GlassFormField';

const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email është i detyrueshëm')
    .email('Ju lutemi shkruani një email të vlefshëm')
    .toLowerCase()
    .transform((email) => email.trim()),
  name: z
    .string()
    .min(2, 'Emri duhet të jetë të paktën 2 karaktere')
    .max(100, 'Emri duhet të jetë më pak se 100 karaktere')
    .transform((name) => name.trim())
    .optional(),
  language: z.enum(['SQ', 'EN']).default('SQ'),
  interests: z.array(z.string()).default([]),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const interestOptions = [
  { id: 'albanian-literature', label: 'Literatura Shqiptare' },
  { id: 'international-books', label: 'Libra Ndërkombëtarë' },
  { id: 'new-releases', label: 'Libra të Rinj' },
  { id: 'special-offers', label: 'Oferta Speciale' },
  { id: 'author-events', label: 'Ngjarje me Autorë' },
  { id: 'book-reviews', label: 'Recensione Librash' },
];

export function NewsletterSignup() {
  const t = useTranslations('newsletter');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      language: 'SQ',
      interests: [],
    },
  });

  const selectedInterests = watch('interests') || [];

  const toggleInterest = (interestId: string) => {
    const current = selectedInterests;
    const updated = current.includes(interestId)
      ? current.filter(id => id !== interestId)
      : [...current, interestId];
    setValue('interests', updated);
  };

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Subscription failed');
      }

      setIsSubscribed(true);
      toast.success('U regjistruat me sukses në newsletter!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Gabim në regjistrim');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <GlassCard className="p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 400, damping: 25 }}
            className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mb-6"
          >
            <CheckCircle className="h-10 w-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Faleminderit!</h1>
          <p className="text-xl text-gray-700 mb-6">
            U regjistruat me sukses në newsletter-in tonë
          </p>
          <p className="text-gray-600 mb-8">
            Do të merrni email-in e parë së shpejti me lajme të reja dhe oferta speciale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <LiquidButton
              variant="albanian"
              size="lg"
              onClick={() => window.location.href = '/books'}
            >
              Eksploroni librat
            </LiquidButton>
            <LiquidButton
              variant="primary"
              size="lg"
              onClick={() => window.location.href = '/blog'}
            >
              Lexoni blogun
            </LiquidButton>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <GlassCard className="p-8 md:p-12">
        {/* Header */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="mb-6">
            <motion.div
              className="w-20 h-20 mx-auto bg-gradient-to-r from-red-500 to-red-600 rounded-3xl flex items-center justify-center shadow-2xl"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Mail className="h-10 w-10 text-white" />
            </motion.div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Benefits */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Çfarë do të merrni:
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Star,
                title: 'Libra të Rinj',
                description: 'Jini të parët që mësoni për librat e rinj në katalog',
              },
              {
                icon: CheckCircle,
                title: 'Oferta Ekskluzive',
                description: 'Zbritje speciale vetëm për abonentët e newsletter-it',
              },
              {
                icon: Mail,
                title: 'Rekomandime Personale',
                description: 'Sugjerime librash bazuar në preferencat tuaja',
              },
              {
                icon: Send,
                title: 'Ngjarje Kulturore',
                description: 'Informacione për prezantime librash dhe ngjarje letrare',
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
                className="flex items-start space-x-4 p-4 bg-white/30 rounded-xl"
              >
                <benefit.icon className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                  <p className="text-gray-700 text-sm">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Signup Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassFormField
              label={t('email')}
              type="email"
              placeholder={t('emailPlaceholder')}
              icon={<Mail className="h-5 w-5" />}
              error={errors.email?.message}
              {...register('email')}
            />

            <GlassFormField
              label={t('name')}
              type="text"
              placeholder={t('namePlaceholder')}
              icon={<Star className="h-5 w-5" />}
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          {/* Language Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              {t('language')}
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'SQ', label: t('languages.sq'), flag: '🇦🇱' },
                { value: 'EN', label: t('languages.en'), flag: '🇬🇧' },
              ].map((lang) => (
                <label
                  key={lang.value}
                  className="flex items-center p-4 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors"
                >
                  <input
                    type="radio"
                    value={lang.value}
                    {...register('language')}
                    className="h-4 w-4 text-red-600 border-gray-300 focus:ring-red-500"
                  />
                  <span className="ml-3 text-2xl">{lang.flag}</span>
                  <span className="ml-2 font-medium text-gray-900">{lang.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interests */}
          <div>
            <label className="block text-sm font-medium text-gray-800 mb-3">
              Interesat tuaja (zgjidhni disa)
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {interestOptions.map((interest) => (
                <motion.label
                  key={interest.id}
                  className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all duration-200 ${
                    selectedInterests.includes(interest.id)
                      ? 'border-red-500 bg-red-50/50'
                      : 'border-gray-300 hover:bg-gray-50/50'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="checkbox"
                    checked={selectedInterests.includes(interest.id)}
                    onChange={() => toggleInterest(interest.id)}
                    className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-3 text-gray-900">{interest.label}</span>
                </motion.label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="text-center"
          >
            <LiquidButton
              type="submit"
              variant="albanian"
              size="lg"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full md:w-auto min-w-[250px]"
            >
              <Send className="w-5 h-5 mr-2" />
              {isSubmitting ? 'Duke u regjistruar...' : t('subscribe')}
            </LiquidButton>

            <p className="text-sm text-gray-600 mt-4">
              Duke u regjistruar, ju pranoni të merrni email-e nga Brënda Librave.
              Mund të çregjistroheni në çdo kohë.
            </p>
          </motion.div>
        </motion.form>
      </GlassCard>
    </motion.div>
  );
}