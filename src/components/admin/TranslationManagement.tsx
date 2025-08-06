'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { motion } from 'framer-motion';
import { 
  Languages, 
  Plus, 
  Save, 
  Edit3, 
  Trash2, 
  Search,
  Filter,
  Globe,
  BookOpen,
  Tag,
  FolderOpen
} from 'lucide-react';
import { LiquidButton } from '@/components/ui/LiquidButton';
import { GlassCard } from '@/components/ui/GlassCard';
import type { Locale } from '@/lib/i18n/config';

interface Translation {
  id: string;
  namespace: string;
  key: string;
  language: string;
  value: string;
  context?: string;
  entityType: string;
  entityId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TranslationStats {
  totalTranslations: number;
  translationsByLanguage: Record<string, number>;
  translationsByEntity: Record<string, number>;
  missingTranslations: number;
}

export function TranslationManagement() {
  const t = useTranslations('admin');
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [stats, setStats] = useState<TranslationStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [editingTranslation, setEditingTranslation] = useState<Translation | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const entityTypes = ['Book', 'Category', 'Tag', 'BlogPost', 'User'];
  const supportedLanguages: Locale[] = ['sq', 'en'];

  useEffect(() => {
    loadTranslations();
    loadStats();
  }, [selectedEntity, selectedLanguage, searchTerm]);

  const loadTranslations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedEntity !== 'all') params.append('entityType', selectedEntity);
      if (selectedLanguage !== 'all') params.append('language', selectedLanguage);
      if (searchTerm) params.append('search', searchTerm);

      const response = await fetch(`/api/admin/translations?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data.translations);
      }
    } catch (error) {
      console.error('Error loading translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/translations/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleSaveTranslation = async (translation: Partial<Translation>) => {
    try {
      const method = translation.id ? 'PUT' : 'POST';
      const url = translation.id 
        ? `/api/admin/translations/${translation.id}`
        : '/api/admin/translations';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(translation)
      });

      if (response.ok) {
        await loadTranslations();
        await loadStats();
        setEditingTranslation(null);
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  const handleDeleteTranslation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this translation?')) return;

    try {
      const response = await fetch(`/api/admin/translations/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadTranslations();
        await loadStats();
      }
    } catch (error) {
      console.error('Error deleting translation:', error);
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'Book': return <BookOpen className="h-4 w-4" />;
      case 'Category': return <FolderOpen className="h-4 w-4" />;
      case 'Tag': return <Tag className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags = {
      'sq': '🇦🇱',
      'en': '🇬🇧',
      'it': '🇮🇹',
      'de': '🇩🇪',
      'fr': '🇫🇷'
    };
    return flags[language as keyof typeof flags] || '🌐';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Languages className="h-8 w-8 text-red-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t('translations')}
            </h1>
            <p className="text-gray-600">
              Manage translations for all content
            </p>
          </div>
        </div>
        <LiquidButton
          onClick={() => setShowAddForm(true)}
          variant="primary"
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Translation</span>
        </LiquidButton>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Translations</p>
                <p className="text-2xl font-bold">{stats.totalTranslations}</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Languages className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Languages</p>
                <p className="text-2xl font-bold">
                  {Object.keys(stats.translationsByLanguage).length}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Entity Types</p>
                <p className="text-2xl font-bold">
                  {Object.keys(stats.translationsByEntity).length}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center space-x-3">
              <Edit3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Missing</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.missingTranslations}
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Filters */}
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Translations
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by key, value, or entity..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entity Type
            </label>
            <select
              value={selectedEntity}
              onChange={(e) => setSelectedEntity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Entities</option>
              {entityTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Languages</option>
              {supportedLanguages.map(lang => (
                <option key={lang} value={lang}>
                  {getLanguageFlag(lang)} {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Translations Table */}
      <GlassCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Language
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="animate-pulse">Loading translations...</div>
                  </td>
                </tr>
              ) : translations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No translations found
                  </td>
                </tr>
              ) : (
                translations.map((translation) => (
                  <tr key={translation.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getEntityIcon(translation.entityType)}
                        <span className="text-sm font-medium text-gray-900">
                          {translation.entityType}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {translation.namespace}.{translation.key}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <span>{getLanguageFlag(translation.language)}</span>
                        <span>{translation.language.toUpperCase()}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {translation.value}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingTranslation(translation)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTranslation(translation.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Edit/Add Translation Modal would go here */}
      {/* This would be a separate component for the form */}
    </div>
  );
}