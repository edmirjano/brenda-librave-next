// import brain from 'brain.js'; // Temporarily disabled

import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

import type { BookListItem } from '@/types/book';

export interface UserProfile {
  userId: string;
  preferences: {
    categories: string[];
    authors: string[];
    languages: string[];
    priceRange: { min: number; max: number };
    formats: ('physical' | 'digital')[];
  };
  readingHistory: {
    completedBooks: number;
    averageRating: number;
    readingSpeed: number; // pages per day
    preferredLength: 'short' | 'medium' | 'long';
  };
  behavior: {
    sessionDuration: number;
    pagesPerSession: number;
    conversionRate: number;
    lastActive: Date;
  };
}

export interface BookRecommendation {
  book: BookListItem;
  score: number;
  reasons: string[];
  confidence: number;
}

export interface RecommendationOptions {
  limit?: number;
  includeExplanations?: boolean;
  diversityFactor?: number;
  freshnessFactor?: number;
  excludeReadBooks?: boolean;
}

/**
 * AI-powered recommendation engine using Brain.js
 */
export class RecommendationEngine {
  private contentModel: brain.NeuralNetwork;
  private collaborativeModel: brain.NeuralNetwork;
  private isInitialized: boolean = false;

  constructor() {
    this.contentModel = new brain.NeuralNetwork({
      hiddenLayers: [10, 8, 6],
      activation: 'sigmoid',
      learningRate: 0.3,
    });

    this.collaborativeModel = new brain.NeuralNetwork({
      hiddenLayers: [15, 10, 8],
      activation: 'relu',
      learningRate: 0.2,
    });
  }

  /**
   * Initialize the recommendation engine
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load pre-trained models from localStorage if available
      const savedContentModel = localStorage.getItem('contentModel');
      const savedCollaborativeModel = localStorage.getItem('collaborativeModel');

      if (savedContentModel) {
        this.contentModel.fromJSON(JSON.parse(savedContentModel));
      } else {
        await this.trainContentModel();
      }

      if (savedCollaborativeModel) {
        this.collaborativeModel.fromJSON(JSON.parse(savedCollaborativeModel));
      } else {
        await this.trainCollaborativeModel();
      }

      this.isInitialized = true;
      logInfo('Recommendation engine initialized');
    } catch (error) {
      logError('Error initializing recommendation engine', error);
      throw error;
    }
  }

  /**
   * Generate personalized book recommendations
   */
  async generateRecommendations(
    userId: string,
    options: RecommendationOptions = {}
  ): Promise<BookRecommendation[]> {
    const {
      limit = 10,
      includeExplanations = true,
      diversityFactor = 0.3,
      freshnessFactor = 0.2,
      excludeReadBooks = true,
    } = options;

    try {
      await this.initialize();

      // Get user profile and reading history
      const userProfile = await this.getUserProfile(userId);
      const readingHistory = excludeReadBooks ? await this.getReadingHistory(userId) : [];
      const allBooks = await this.getAllActiveBooks();

      // Filter out already read books
      const candidateBooks = excludeReadBooks
        ? allBooks.filter(book => !readingHistory.some(h => h.bookId === book.id))
        : allBooks;

      // Generate recommendations from different models
      const contentRecs = await this.getContentBasedRecommendations(userProfile, candidateBooks);
      const collaborativeRecs = await this.getCollaborativeRecommendations(userId, candidateBooks);
      const trendingRecs = await this.getTrendingRecommendations(userProfile, candidateBooks);

      // Combine recommendations with weighted scoring
      const combinedRecs = this.combineRecommendations([
        { recommendations: contentRecs, weight: 0.4 },
        { recommendations: collaborativeRecs, weight: 0.4 },
        { recommendations: trendingRecs, weight: 0.2 },
      ]);

      // Apply diversity and freshness factors
      const diversifiedRecs = this.applyDiversification(
        combinedRecs,
        diversityFactor,
        freshnessFactor
      );

      // Add explanations if requested
      if (includeExplanations) {
        diversifiedRecs.forEach(rec => {
          rec.reasons = this.generateExplanations(rec, userProfile);
        });
      }

      logInfo('Recommendations generated', {
        userId,
        recommendationCount: diversifiedRecs.length,
        limit,
      });

      return diversifiedRecs.slice(0, limit);
    } catch (error) {
      logError('Error generating recommendations', error, { userId, options });
      return [];
    }
  }

  /**
   * Content-based recommendations
   */
  private async getContentBasedRecommendations(
    userProfile: UserProfile,
    books: BookListItem[]
  ): Promise<BookRecommendation[]> {
    const recommendations: BookRecommendation[] = [];

    for (const book of books) {
      const features = this.encodeBookFeatures(book, userProfile);
      const prediction = this.contentModel.run(features);
      
      recommendations.push({
        book,
        score: Array.isArray(prediction) ? prediction[0] : prediction,
        reasons: [],
        confidence: 0.8,
      });
    }

    return recommendations.sort((a, b) => b.score - a.score);
  }

  /**
   * Collaborative filtering recommendations
   */
  private async getCollaborativeRecommendations(
    userId: string,
    books: BookListItem[]
  ): Promise<BookRecommendation[]> {
    try {
      // Find similar users
      const similarUsers = await this.findSimilarUsers(userId);
      
      if (similarUsers.length === 0) {
        return [];
      }

      // Get books liked by similar users
      const recommendations = new Map<string, { score: number; count: number }>();

      for (const similarUserId of similarUsers) {
        const userBooks = await this.getUserLikedBooks(similarUserId);
        
        userBooks.forEach(bookId => {
          const current = recommendations.get(bookId) || { score: 0, count: 0 };
          recommendations.set(bookId, {
            score: current.score + 1,
            count: current.count + 1,
          });
        });
      }

      // Convert to recommendation format
      const collaborativeRecs: BookRecommendation[] = [];
      
      for (const [bookId, data] of recommendations.entries()) {
        const book = books.find(b => b.id === bookId);
        if (book) {
          collaborativeRecs.push({
            book,
            score: data.score / similarUsers.length,
            reasons: [`Liked by ${data.count} similar users`],
            confidence: Math.min(data.count / 5, 1), // Higher confidence with more similar users
          });
        }
      }

      return collaborativeRecs.sort((a, b) => b.score - a.score);
    } catch (error) {
      logError('Error in collaborative recommendations', error);
      return [];
    }
  }

  /**
   * Trending recommendations based on recent popularity
   */
  private async getTrendingRecommendations(
    userProfile: UserProfile,
    books: BookListItem[]
  ): Promise<BookRecommendation[]> {
    try {
      // Get trending books from the last 30 days
      const trendingBooks = await prisma.book.findMany({
        where: {
          active: true,
          createdAt: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
          },
        },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          featured: 'desc',
        },
        take: 20,
      });

      return trendingBooks.map(book => ({
        book,
        score: book.featured ? 0.9 : 0.7,
        reasons: ['Currently trending'],
        confidence: 0.6,
      }));
    } catch (error) {
      logError('Error getting trending recommendations', error);
      return [];
    }
  }

  /**
   * Encode book features for neural network input
   */
  private encodeBookFeatures(book: BookListItem, userProfile?: UserProfile): number[] {
    const features: number[] = [];

    // Category preference (0-1)
    if (userProfile) {
      features.push(
        userProfile.preferences.categories.includes(book.category.name) ? 1 : 0
      );
    } else {
      features.push(0.5); // Neutral if no profile
    }

    // Language preference (0-1)
    if (userProfile) {
      features.push(
        userProfile.preferences.languages.includes(book.language) ? 1 : 0
      );
    } else {
      features.push(book.language === 'SQ' ? 1 : 0.5); // Prefer Albanian by default
    }

    // Price range fit (0-1)
    if (userProfile && book.priceALL) {
      const priceInRange = 
        book.priceALL >= userProfile.preferences.priceRange.min &&
        book.priceALL <= userProfile.preferences.priceRange.max;
      features.push(priceInRange ? 1 : 0.3);
    } else {
      features.push(0.5);
    }

    // Featured status (0-1)
    features.push(book.featured ? 1 : 0);

    // Has digital version (0-1)
    features.push(book.hasDigital ? 1 : 0);

    // Inventory availability (0-1)
    features.push(book.inventory > 0 ? 1 : 0);

    // Recency (0-1) - newer books get higher scores
    const daysSinceCreated = (Date.now() - new Date(book.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    features.push(Math.max(0, 1 - daysSinceCreated / 365)); // Decay over a year

    // Tag relevance (0-1)
    const tagRelevance = book.tags.length > 0 ? 0.8 : 0.2;
    features.push(tagRelevance);

    return features;
  }

  /**
   * Combine multiple recommendation sources
   */
  private combineRecommendations(
    sources: Array<{ recommendations: BookRecommendation[]; weight: number }>
  ): BookRecommendation[] {
    const combinedMap = new Map<string, BookRecommendation>();

    sources.forEach(({ recommendations, weight }) => {
      recommendations.forEach(rec => {
        const existing = combinedMap.get(rec.book.id);
        
        if (existing) {
          existing.score = existing.score + (rec.score * weight);
          existing.reasons.push(...rec.reasons);
          existing.confidence = Math.max(existing.confidence, rec.confidence);
        } else {
          combinedMap.set(rec.book.id, {
            ...rec,
            score: rec.score * weight,
          });
        }
      });
    });

    return Array.from(combinedMap.values()).sort((a, b) => b.score - a.score);
  }

  /**
   * Apply diversification to avoid too similar recommendations
   */
  private applyDiversification(
    recommendations: BookRecommendation[],
    diversityFactor: number,
    freshnessFactor: number
  ): BookRecommendation[] {
    const diversified: BookRecommendation[] = [];
    const usedCategories = new Set<string>();
    const usedAuthors = new Set<string>();

    for (const rec of recommendations) {
      let diversityPenalty = 0;

      // Penalize if category already used
      if (usedCategories.has(rec.book.category.name)) {
        diversityPenalty += diversityFactor * 0.3;
      }

      // Penalize if author already used
      if (usedAuthors.has(rec.book.author)) {
        diversityPenalty += diversityFactor * 0.2;
      }

      // Boost newer books
      const daysSinceCreated = (Date.now() - new Date(rec.book.createdAt).getTime()) / (1000 * 60 * 60 * 24);
      const freshnessBoost = freshnessFactor * Math.max(0, 1 - daysSinceCreated / 90); // Boost for books less than 90 days old

      rec.score = rec.score - diversityPenalty + freshnessBoost;

      diversified.push(rec);
      usedCategories.add(rec.book.category.name);
      usedAuthors.add(rec.book.author);
    }

    return diversified.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate explanations for recommendations
   */
  private generateExplanations(rec: BookRecommendation, userProfile: UserProfile): string[] {
    const explanations: string[] = [];

    // Category match
    if (userProfile.preferences.categories.includes(rec.book.category.name)) {
      explanations.push(`Ju pëlqen kategoria "${rec.book.category.name}"`);
    }

    // Author match
    if (userProfile.preferences.authors.includes(rec.book.author)) {
      explanations.push(`Keni lexuar libra të ${rec.book.author} më parë`);
    }

    // Language preference
    if (userProfile.preferences.languages.includes(rec.book.language)) {
      explanations.push(`Në gjuhën tuaj të preferuar`);
    }

    // Featured book
    if (rec.book.featured) {
      explanations.push('Libër i veçantë i zgjedhur nga ne');
    }

    // Price range
    if (rec.book.priceALL && 
        rec.book.priceALL >= userProfile.preferences.priceRange.min &&
        rec.book.priceALL <= userProfile.preferences.priceRange.max) {
      explanations.push('Në gamën tuaj të çmimeve');
    }

    // Default explanation if no specific reasons
    if (explanations.length === 0) {
      explanations.push('Bazuar në preferencat tuaja të leximit');
    }

    return explanations;
  }

  /**
   * Train content-based model
   */
  private async trainContentModel(): Promise<void> {
    try {
      // Get training data from user interactions
      const trainingData = await this.getContentTrainingData();
      
      if (trainingData.length > 0) {
        await this.contentModel.trainAsync(trainingData, {
          iterations: 1000,
          errorThresh: 0.005,
        });

        // Save trained model
        localStorage.setItem('contentModel', JSON.stringify(this.contentModel.toJSON()));
        logInfo('Content model trained', { trainingDataSize: trainingData.length });
      }
    } catch (error) {
      logError('Error training content model', error);
    }
  }

  /**
   * Train collaborative filtering model
   */
  private async trainCollaborativeModel(): Promise<void> {
    try {
      // Get training data from user similarities
      const trainingData = await this.getCollaborativeTrainingData();
      
      if (trainingData.length > 0) {
        await this.collaborativeModel.trainAsync(trainingData, {
          iterations: 1500,
          errorThresh: 0.01,
        });

        // Save trained model
        localStorage.setItem('collaborativeModel', JSON.stringify(this.collaborativeModel.toJSON()));
        logInfo('Collaborative model trained', { trainingDataSize: trainingData.length });
      }
    } catch (error) {
      logError('Error training collaborative model', error);
    }
  }

  /**
   * Get user profile for recommendations
   */
  private async getUserProfile(userId: string): Promise<UserProfile> {
    try {
      // Check localStorage first
      const cachedProfile = localStorage.getItem(`userProfile_${userId}`);
      if (cachedProfile) {
        return JSON.parse(cachedProfile);
      }

      // Generate profile from user data
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  book: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
          readingHistory: {
            include: {
              book: {
                include: {
                  category: true,
                },
              },
            },
          },
        },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const profile: UserProfile = {
        userId,
        preferences: {
          categories: this.extractCategoryPreferences(user.orders),
          authors: this.extractAuthorPreferences(user.orders),
          languages: this.extractLanguagePreferences(user.orders),
          priceRange: this.extractPriceRange(user.orders),
          formats: this.extractFormatPreferences(user.orders),
        },
        readingHistory: {
          completedBooks: user.readingHistory.filter(h => h.completed).length,
          averageRating: this.calculateAverageRating(user.readingHistory),
          readingSpeed: this.calculateReadingSpeed(user.readingHistory),
          preferredLength: this.determinePreferredLength(user.readingHistory),
        },
        behavior: {
          sessionDuration: 0, // Would be tracked via analytics
          pagesPerSession: 0, // Would be tracked via analytics
          conversionRate: user.orders.length > 0 ? 1 : 0,
          lastActive: user.updatedAt,
        },
      };

      // Cache profile for 1 hour
      localStorage.setItem(`userProfile_${userId}`, JSON.stringify(profile));
      
      return profile;
    } catch (error) {
      logError('Error getting user profile', error, { userId });
      
      // Return default profile
      return {
        userId,
        preferences: {
          categories: [],
          authors: [],
          languages: ['SQ'],
          priceRange: { min: 0, max: 10000 },
          formats: ['physical', 'digital'],
        },
        readingHistory: {
          completedBooks: 0,
          averageRating: 0,
          readingSpeed: 0,
          preferredLength: 'medium',
        },
        behavior: {
          sessionDuration: 0,
          pagesPerSession: 0,
          conversionRate: 0,
          lastActive: new Date(),
        },
      };
    }
  }

  /**
   * Get all active books for recommendations
   */
  private async getAllActiveBooks(): Promise<BookListItem[]> {
    try {
      return await prisma.book.findMany({
        where: { active: true },
        include: {
          category: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    } catch (error) {
      logError('Error getting active books', error);
      return [];
    }
  }

  /**
   * Find users with similar reading preferences
   */
  private async findSimilarUsers(userId: string): Promise<string[]> {
    try {
      // Get user's reading history
      const userHistory = await prisma.readingHistory.findMany({
        where: { userId },
        select: { bookId: true, rating: true },
      });

      if (userHistory.length === 0) {
        return [];
      }

      const userBookIds = new Set(userHistory.map(h => h.bookId));

      // Find users who have read similar books
      const similarUsers = await prisma.readingHistory.findMany({
        where: {
          bookId: { in: Array.from(userBookIds) },
          userId: { not: userId },
        },
        select: { userId: true, bookId: true },
      });

      // Calculate similarity scores
      const userSimilarities = new Map<string, number>();
      
      similarUsers.forEach(history => {
        const current = userSimilarities.get(history.userId) || 0;
        userSimilarities.set(history.userId, current + 1);
      });

      // Return top 10 most similar users
      return Array.from(userSimilarities.entries())
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([userId]) => userId);
    } catch (error) {
      logError('Error finding similar users', error);
      return [];
    }
  }

  /**
   * Get books liked by a user (from reading history and orders)
   */
  private async getUserLikedBooks(userId: string): Promise<string[]> {
    try {
      const [readingHistory, orders] = await Promise.all([
        prisma.readingHistory.findMany({
          where: { 
            userId,
            OR: [
              { completed: true },
              { rating: { gte: 4 } },
            ],
          },
          select: { bookId: true },
        }),
        prisma.order.findMany({
          where: { userId },
          include: {
            items: {
              select: { bookId: true },
            },
          },
        }),
      ]);

      const likedBooks = new Set<string>();
      
      // Add books from reading history
      readingHistory.forEach(h => likedBooks.add(h.bookId));
      
      // Add books from orders (purchased = liked)
      orders.forEach(order => {
        order.items.forEach(item => likedBooks.add(item.bookId));
      });

      return Array.from(likedBooks);
    } catch (error) {
      logError('Error getting user liked books', error);
      return [];
    }
  }

  /**
   * Get reading history for a user
   */
  private async getReadingHistory(userId: string): Promise<Array<{ bookId: string }>> {
    try {
      return await prisma.readingHistory.findMany({
        where: { userId },
        select: { bookId: true },
      });
    } catch (error) {
      logError('Error getting reading history', error);
      return [];
    }
  }

  /**
   * Extract category preferences from user orders
   */
  private extractCategoryPreferences(orders: any[]): string[] {
    const categoryCount = new Map<string, number>();
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const category = item.book.category.name;
        categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
      });
    });

    return Array.from(categoryCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category]) => category);
  }

  /**
   * Extract author preferences from user orders
   */
  private extractAuthorPreferences(orders: any[]): string[] {
    const authorCount = new Map<string, number>();
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const author = item.book.author;
        authorCount.set(author, (authorCount.get(author) || 0) + 1);
      });
    });

    return Array.from(authorCount.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([author]) => author);
  }

  /**
   * Extract language preferences from user orders
   */
  private extractLanguagePreferences(orders: any[]): string[] {
    const languageCount = new Map<string, number>();
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        const language = item.book.language;
        languageCount.set(language, (languageCount.get(language) || 0) + 1);
      });
    });

    const preferences = Array.from(languageCount.entries())
      .sort(([,a], [,b]) => b - a)
      .map(([language]) => language);

    return preferences.length > 0 ? preferences : ['SQ']; // Default to Albanian
  }

  /**
   * Extract price range from user orders
   */
  private extractPriceRange(orders: any[]): { min: number; max: number } {
    if (orders.length === 0) {
      return { min: 0, max: 10000 };
    }

    const prices: number[] = [];
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        prices.push(item.price);
      });
    });

    prices.sort((a, b) => a - b);
    
    return {
      min: prices[Math.floor(prices.length * 0.1)] || 0, // 10th percentile
      max: prices[Math.floor(prices.length * 0.9)] || 10000, // 90th percentile
    };
  }

  /**
   * Extract format preferences from user orders
   */
  private extractFormatPreferences(orders: any[]): ('physical' | 'digital')[] {
    const formatCount = { physical: 0, digital: 0 };
    
    orders.forEach(order => {
      order.items.forEach((item: any) => {
        if (item.isDigital) {
          formatCount.digital++;
        } else {
          formatCount.physical++;
        }
      });
    });

    const preferences: ('physical' | 'digital')[] = [];
    if (formatCount.physical > 0) preferences.push('physical');
    if (formatCount.digital > 0) preferences.push('digital');
    
    return preferences.length > 0 ? preferences : ['physical', 'digital'];
  }

  /**
   * Calculate average rating from reading history
   */
  private calculateAverageRating(readingHistory: any[]): number {
    const ratingsWithValues = readingHistory.filter(h => h.rating);
    if (ratingsWithValues.length === 0) return 0;
    
    const sum = ratingsWithValues.reduce((acc, h) => acc + h.rating, 0);
    return sum / ratingsWithValues.length;
  }

  /**
   * Calculate reading speed from reading history
   */
  private calculateReadingSpeed(readingHistory: any[]): number {
    // Simplified calculation - would need more detailed tracking in real implementation
    const completedBooks = readingHistory.filter(h => h.completed);
    return completedBooks.length; // Books per time period
  }

  /**
   * Determine preferred book length
   */
  private determinePreferredLength(readingHistory: any[]): 'short' | 'medium' | 'long' {
    // Simplified - would analyze actual page counts in real implementation
    return 'medium';
  }

  /**
   * Get training data for content-based model
   */
  private async getContentTrainingData(): Promise<Array<{ input: number[]; output: number[] }>> {
    // This would be implemented with actual user interaction data
    // For now, return empty array to avoid training on insufficient data
    return [];
  }

  /**
   * Get training data for collaborative model
   */
  private async getCollaborativeTrainingData(): Promise<Array<{ input: number[]; output: number[] }>> {
    // This would be implemented with user similarity data
    // For now, return empty array to avoid training on insufficient data
    return [];
  }
}

// Export singleton instance
export const recommendationEngine = new RecommendationEngine();