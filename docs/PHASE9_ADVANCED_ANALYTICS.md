# Phase 9: Advanced Analytics & Business Intelligence

Complete implementation of advanced analytics, business intelligence, and data-driven decision making for Brënda Librave.

## 📊 Analytics Architecture Overview

### Core Philosophy
- **Real-time Insights**: Live data processing and visualization
- **Actionable Intelligence**: Data that drives business decisions
- **User Privacy**: GDPR-compliant analytics with user consent
- **Performance Optimized**: Efficient data collection and processing

### Technology Stack
- **Google Analytics 4**: Enhanced e-commerce tracking
- **Custom Analytics**: Business-specific metrics
- **Real-time Dashboards**: Live data visualization
- **Predictive Analytics**: Forecasting and trend analysis

## 🎯 Advanced Analytics Implementation

### Enhanced E-commerce Tracking
```typescript
// lib/analytics/enhanced-ecommerce.ts
export class EnhancedEcommerce {
  private gtag: any;

  constructor() {
    this.gtag = (window as any).gtag;
  }

  // Track detailed product views
  trackProductView(book: Book, listName?: string) {
    this.gtag('event', 'view_item', {
      currency: 'ALL',
      value: book.priceALL,
      items: [{
        item_id: book.id,
        item_name: book.title,
        item_category: book.category.name,
        item_category2: book.language,
        item_brand: book.author,
        price: book.priceALL,
        quantity: 1,
        item_list_name: listName || 'Product Catalog',
        item_list_id: book.categoryId,
      }],
      custom_parameters: {
        book_format: book.hasDigital ? 'hybrid' : 'physical',
        book_language: book.language,
        featured_status: book.featured,
        inventory_level: this.getInventoryLevel(book.inventory),
      }
    });
  }

  // Track search behavior with enhanced data
  trackSearch(query: string, results: SearchResult) {
    this.gtag('event', 'search', {
      search_term: query,
      custom_parameters: {
        search_results_count: results.totalCount,
        search_category: results.primaryCategory,
        search_language: results.detectedLanguage,
        search_intent: results.intent,
        search_filters_used: results.filtersApplied,
        search_duration: results.searchDuration,
      }
    });
  }

  // Track advanced purchase events
  trackPurchase(order: Order) {
    const items = order.items.map(item => ({
      item_id: item.book.id,
      item_name: item.book.title,
      item_category: item.book.category.name,
      item_brand: item.book.author,
      price: item.price,
      quantity: item.quantity,
      item_variant: item.isDigital ? 'digital' : 'physical',
    }));

    this.gtag('event', 'purchase', {
      transaction_id: order.orderNumber,
      value: order.totalAmount,
      currency: order.currency,
      shipping: order.shippingCost,
      items,
      custom_parameters: {
        payment_method: order.paymentMethod,
        customer_type: this.getCustomerType(order.userId),
        order_source: this.getOrderSource(),
        shipping_country: order.shippingCountry,
        has_digital_items: order.items.some(i => i.isDigital),
        has_physical_items: order.items.some(i => !i.isDigital),
      }
    });
  }

  // Track reading engagement
  trackReadingEngagement(engagement: ReadingEngagement) {
    this.gtag('event', 'reading_engagement', {
      custom_parameters: {
        book_id: engagement.bookId,
        reading_progress: engagement.progress,
        session_duration: engagement.sessionDuration,
        pages_read: engagement.pagesRead,
        reading_speed: engagement.readingSpeed,
        engagement_score: engagement.engagementScore,
      }
    });
  }
}
```

### Business Intelligence Dashboard
```typescript
// components/analytics/BusinessDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Users,
  BookOpen,
  ShoppingCart,
  Target,
  Zap,
} from 'lucide-react';

import { GlassCard } from '@/components/ui/GlassCard';
import { PriceDisplay } from '@/components/ui/PriceDisplay';

interface BusinessMetrics {
  revenue: {
    total: number;
    growth: number;
    forecast: number;
    byCategory: CategoryRevenue[];
  };
  customers: {
    total: number;
    new: number;
    retention: number;
    lifetime_value: number;
  };
  inventory: {
    total_books: number;
    low_stock: number;
    bestsellers: Book[];
    slow_movers: Book[];
  };
  performance: {
    conversion_rate: number;
    avg_order_value: number;
    cart_abandonment: number;
    page_load_speed: number;
  };
}

export function BusinessDashboard() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/analytics/business-metrics?range=${timeRange}`);
        const data = await response.json();
        
        if (data.success) {
          setMetrics(data.data);
        }
      } catch (error) {
        console.error('Error fetching business metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [timeRange]);

  if (isLoading || !metrics) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-700">Duke ngarkuar analizat...</span>
      </div>
    );
  }

  const kpiCards = [
    {
      title: 'Të Ardhurat Totale',
      value: metrics.revenue.total,
      growth: metrics.revenue.growth,
      icon: DollarSign,
      color: 'green',
      isPrice: true,
    },
    {
      title: 'Klientë Aktivë',
      value: metrics.customers.total,
      growth: ((metrics.customers.new / metrics.customers.total) * 100),
      icon: Users,
      color: 'blue',
    },
    {
      title: 'Shkalla e Konvertimit',
      value: metrics.performance.conversion_rate,
      growth: 5.2,
      icon: Target,
      color: 'purple',
      isPercentage: true,
    },
    {
      title: 'Vlera Mesatare e Porosisë',
      value: metrics.performance.avg_order_value,
      growth: 8.1,
      icon: ShoppingCart,
      color: 'orange',
      isPrice: true,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header with Time Range Selector */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Business Intelligence</h1>
          <p className="text-gray-600 mt-1">Analizë e thellë e performancës së biznesit</p>
        </div>

        <div className="flex space-x-2">
          {[
            { value: '7d', label: '7 ditë' },
            { value: '30d', label: '30 ditë' },
            { value: '90d', label: '3 muaj' },
            { value: '1y', label: '1 vit' },
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                timeRange === range.value
                  ? 'bg-red-500 text-white'
                  : 'bg-white/50 text-gray-700 hover:bg-white/70'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r from-${kpi.color}-500 to-${kpi.color}-600 rounded-xl flex items-center justify-center`}>
                  <kpi.icon className="h-6 w-6 text-white" />
                </div>
                <div className={`flex items-center space-x-1 ${kpi.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendingUp className={`h-4 w-4 ${kpi.growth < 0 ? 'rotate-180' : ''}`} />
                  <span className="text-sm font-medium">{kpi.growth >= 0 ? '+' : ''}{kpi.growth.toFixed(1)}%</span>
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                <div className="text-2xl font-bold text-gray-900">
                  {kpi.isPrice ? (
                    <PriceDisplay priceALL={kpi.value} size="lg" />
                  ) : kpi.isPercentage ? (
                    `${kpi.value.toFixed(1)}%`
                  ) : (
                    kpi.value.toLocaleString()
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Revenue Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Të Ardhurat sipas Kategorive</h2>
          <div className="space-y-4">
            {metrics.revenue.byCategory.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 bg-white/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.bookCount} libra</p>
                  </div>
                </div>
                <div className="text-right">
                  <PriceDisplay priceALL={category.revenue} size="sm" />
                  <div className="text-xs text-gray-500">
                    {((category.revenue / metrics.revenue.total) * 100).toFixed(1)}%
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performanca e Faqes</h2>
          <div className="space-y-6">
            {[
              {
                label: 'Shkalla e Konvertimit',
                value: `${metrics.performance.conversion_rate.toFixed(2)}%`,
                target: '3.5%',
                progress: (metrics.performance.conversion_rate / 3.5) * 100,
              },
              {
                label: 'Braktisja e Shportës',
                value: `${metrics.performance.cart_abandonment.toFixed(1)}%`,
                target: '65%',
                progress: 100 - (metrics.performance.cart_abandonment / 65) * 100,
              },
              {
                label: 'Shpejtësia e Ngarkimit',
                value: `${metrics.performance.page_load_speed.toFixed(1)}s`,
                target: '2.0s',
                progress: (2.0 / metrics.performance.page_load_speed) * 100,
              },
            ].map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex justify-between">
                  <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                  <span className="text-sm text-gray-900">{metric.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metric.progress >= 80 ? 'bg-green-500' : 
                      metric.progress >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${Math.min(metric.progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Target: {metric.target}</span>
                  <span>{metric.progress.toFixed(0)}% of target</span>
                </div>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Inventory Intelligence */}
      <GlassCard className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Inteligjenca e Inventarit</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bestsellers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bestsellers</h3>
            <div className="space-y-3">
              {metrics.inventory.bestsellers.slice(0, 5).map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <PriceDisplay priceALL={book.priceALL || 0} size="sm" />
                    <div className="text-xs text-green-600">
                      {book.salesCount} shitur
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Slow Movers */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Libra me Shitje të Ulëta</h3>
            <div className="space-y-3">
              {metrics.inventory.slow_movers.slice(0, 5).map((book, index) => (
                <motion.div
                  key={book.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-yellow-50/50 rounded-lg"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{book.title}</h4>
                    <p className="text-sm text-gray-600">{book.author}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-yellow-600">
                      Stok: {book.inventory}
                    </div>
                    <div className="text-xs text-gray-500">
                      {book.daysSinceLastSale} ditë pa shitje
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
```

### Customer Analytics
```typescript
// lib/analytics/customer-analytics.ts
export class CustomerAnalytics {
  // Customer Lifetime Value calculation
  async calculateCLV(userId: string): Promise<CustomerLifetimeValue> {
    const orders = await this.getCustomerOrders(userId);
    const registrationDate = await this.getRegistrationDate(userId);
    
    const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const orderCount = orders.length;
    const daysSinceRegistration = this.daysBetween(registrationDate, new Date());
    
    const avgOrderValue = totalSpent / orderCount;
    const purchaseFrequency = orderCount / (daysSinceRegistration / 30); // per month
    const customerLifespan = this.predictCustomerLifespan(orders);
    
    return {
      totalSpent,
      avgOrderValue,
      purchaseFrequency,
      predictedLifespan: customerLifespan,
      clv: avgOrderValue * purchaseFrequency * customerLifespan,
      segment: this.determineCustomerSegment(totalSpent, orderCount, daysSinceRegistration),
    };
  }

  // RFM Analysis (Recency, Frequency, Monetary)
  async performRFMAnalysis(): Promise<RFMAnalysis> {
    const customers = await this.getAllCustomers();
    const rfmScores = await Promise.all(
      customers.map(async (customer) => {
        const orders = await this.getCustomerOrders(customer.id);
        
        const recency = this.calculateRecency(orders);
        const frequency = orders.length;
        const monetary = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        return {
          customerId: customer.id,
          recency: this.scoreRecency(recency),
          frequency: this.scoreFrequency(frequency),
          monetary: this.scoreMonetary(monetary),
          segment: this.determineRFMSegment(recency, frequency, monetary),
        };
      })
    );

    return {
      segments: this.groupBySegment(rfmScores),
      insights: this.generateRFMInsights(rfmScores),
      recommendations: this.generateSegmentRecommendations(rfmScores),
    };
  }

  // Cohort Analysis
  async performCohortAnalysis(months: number = 12): Promise<CohortAnalysis> {
    const cohorts = await this.generateCohorts(months);
    
    return {
      cohorts: cohorts.map(cohort => ({
        month: cohort.month,
        newCustomers: cohort.newCustomers,
        retentionRates: cohort.retentionRates,
        revenuePerCustomer: cohort.revenuePerCustomer,
      })),
      insights: this.generateCohortInsights(cohorts),
    };
  }
}
```

### Predictive Analytics
```typescript
// lib/analytics/predictive-analytics.ts
export class PredictiveAnalytics {
  private forecastModel: brain.NeuralNetwork;

  constructor() {
    this.forecastModel = new brain.NeuralNetwork({
      hiddenLayers: [50, 30, 20],
      activation: 'relu',
    });
  }

  // Sales forecasting
  async forecastSales(
    timeframe: 'weekly' | 'monthly' | 'quarterly',
    periods: number = 12
  ): Promise<SalesForecast> {
    const historicalData = await this.getHistoricalSales(timeframe, periods * 2);
    
    // Prepare training data
    const trainingData = this.prepareForecastingData(historicalData);
    
    // Train model
    await this.forecastModel.trainAsync(trainingData, {
      iterations: 2000,
      errorThresh: 0.01,
    });

    // Generate predictions
    const predictions = [];
    for (let i = 0; i < periods; i++) {
      const input = this.prepareInputForPrediction(historicalData, i);
      const prediction = this.forecastModel.run(input);
      predictions.push({
        period: this.getNextPeriod(timeframe, i),
        predictedSales: prediction.sales * this.getScalingFactor(),
        confidence: prediction.confidence,
        factors: this.identifyInfluencingFactors(input),
      });
    }

    return {
      predictions,
      accuracy: await this.calculateModelAccuracy(),
      insights: this.generateForecastInsights(predictions),
    };
  }

  // Inventory optimization
  async optimizeInventory(): Promise<InventoryOptimization> {
    const books = await this.getAllBooks();
    const salesData = await this.getSalesData();
    const seasonalTrends = await this.getSeasonalTrends();

    const optimizations = books.map(book => {
      const salesVelocity = this.calculateSalesVelocity(book.id, salesData);
      const seasonalFactor = this.getSeasonalFactor(book, seasonalTrends);
      const demandForecast = this.forecastDemand(book, salesVelocity, seasonalFactor);
      
      return {
        bookId: book.id,
        currentStock: book.inventory,
        recommendedStock: demandForecast.recommendedStock,
        reorderPoint: demandForecast.reorderPoint,
        maxStock: demandForecast.maxStock,
        urgency: this.calculateUrgency(book.inventory, demandForecast.reorderPoint),
        reasoning: demandForecast.reasoning,
      };
    });

    return {
      optimizations: optimizations.sort((a, b) => b.urgency - a.urgency),
      totalValue: this.calculateOptimizationValue(optimizations),
      insights: this.generateInventoryInsights(optimizations),
    };
  }

  // Price optimization
  async optimizePricing(bookId: string): Promise<PriceOptimization> {
    const book = await this.getBook(bookId);
    const competitorPrices = await this.getCompetitorPrices(book);
    const demandElasticity = await this.calculateDemandElasticity(bookId);
    const customerSegments = await this.getCustomerSegments();

    const priceTests = [];
    for (let priceMultiplier = 0.8; priceMultiplier <= 1.3; priceMultiplier += 0.1) {
      const testPrice = book.priceALL * priceMultiplier;
      const predictedDemand = this.predictDemandAtPrice(testPrice, demandElasticity);
      const predictedRevenue = testPrice * predictedDemand;
      
      priceTests.push({
        price: testPrice,
        predictedDemand,
        predictedRevenue,
        competitivePosition: this.assessCompetitivePosition(testPrice, competitorPrices),
      });
    }

    const optimalPrice = priceTests.reduce((best, current) => 
      current.predictedRevenue > best.predictedRevenue ? current : best
    );

    return {
      currentPrice: book.priceALL,
      optimalPrice: optimalPrice.price,
      expectedRevenueLift: ((optimalPrice.predictedRevenue / (book.priceALL * this.getCurrentDemand(bookId))) - 1) * 100,
      priceTests,
      recommendations: this.generatePricingRecommendations(priceTests, customerSegments),
    };
  }
}
```

## 📈 Real-time Analytics Dashboard

### Live Metrics Component
```typescript
// components/analytics/LiveMetrics.tsx
'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Eye, ShoppingCart, Users } from 'lucide-react';

interface LiveMetrics {
  activeUsers: number;
  currentSessions: number;
  realtimeOrders: number;
  pageViews: number;
  conversionRate: number;
  topPages: Array<{ page: string; views: number }>;
  recentOrders: Array<{ id: string; amount: number; time: string }>;
}

export function LiveMetrics() {
  const [metrics, setMetrics] = useState<LiveMetrics | null>(null);

  useEffect(() => {
    const fetchLiveMetrics = async () => {
      try {
        const response = await fetch('/api/analytics/live-metrics');
        const data = await response.json();
        
        if (data.success) {
          setMetrics(data.data);
        }
      } catch (error) {
        console.error('Error fetching live metrics:', error);
      }
    };

    // Initial fetch
    fetchLiveMetrics();

    // Update every 30 seconds
    const interval = setInterval(fetchLiveMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
        <span className="ml-3 text-gray-700">Duke ngarkuar të dhënat live...</span>
      </div>
    );
  }

  const liveStats = [
    {
      label: 'Përdorues Aktivë',
      value: metrics.activeUsers,
      icon: Users,
      color: 'green',
      pulse: true,
    },
    {
      label: 'Sesione Aktuale',
      value: metrics.currentSessions,
      icon: Activity,
      color: 'blue',
      pulse: true,
    },
    {
      label: 'Porosi Sot',
      value: metrics.realtimeOrders,
      icon: ShoppingCart,
      color: 'purple',
    },
    {
      label: 'Shikime Faqe',
      value: metrics.pageViews,
      icon: Eye,
      color: 'orange',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {liveStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
        >
          <div className={`p-4 rounded-xl bg-gradient-to-r from-${stat.color}-50 to-${stat.color}-100 border border-${stat.color}-200`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
              </div>
              <div className={`w-10 h-10 bg-gradient-to-r from-${stat.color}-500 to-${stat.color}-600 rounded-lg flex items-center justify-center ${stat.pulse ? 'animate-pulse' : ''}`}>
                <stat.icon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

## 🎯 Advanced Segmentation

### Customer Segmentation Engine
```typescript
// lib/analytics/segmentation.ts
export class CustomerSegmentation {
  // Advanced customer segmentation
  async segmentCustomers(): Promise<CustomerSegments> {
    const customers = await this.getAllCustomersWithData();
    
    const segments = {
      champions: [],
      loyalCustomers: [],
      potentialLoyalists: [],
      newCustomers: [],
      promisers: [],
      needsAttention: [],
      aboutToSleep: [],
      atRisk: [],
      cannotLoseThem: [],
      hibernating: [],
      lost: [],
    };

    customers.forEach(customer => {
      const rfm = this.calculateRFM(customer);
      const segment = this.determineSegment(rfm);
      segments[segment].push({
        ...customer,
        rfmScore: rfm,
        recommendations: this.generateSegmentRecommendations(segment, customer),
      });
    });

    return segments;
  }

  // Behavioral segmentation
  async behavioralSegmentation(): Promise<BehavioralSegments> {
    const users = await this.getUsersWithBehavior();
    
    return {
      browsers: users.filter(u => u.sessionCount > 10 && u.purchaseCount === 0),
      researchers: users.filter(u => u.avgSessionDuration > 300 && u.pagesPerSession > 5),
      impulse_buyers: users.filter(u => u.avgTimeToPurchase < 3600), // 1 hour
      loyal_readers: users.filter(u => u.readingCompletionRate > 0.8),
      bargain_hunters: users.filter(u => u.avgDiscountUsage > 0.3),
      premium_customers: users.filter(u => u.avgOrderValue > 5000), // 5000 ALL
    };
  }

  // Geographic segmentation
  async geographicSegmentation(): Promise<GeographicSegments> {
    const orders = await this.getOrdersWithLocation();
    
    const segments = {
      domestic: {
        tirana: [],
        durres: [],
        vlora: [],
        shkodra: [],
        other_cities: [],
      },
      diaspora: {
        italy: [],
        germany: [],
        usa: [],
        uk: [],
        other_countries: [],
      },
    };

    orders.forEach(order => {
      const location = this.categorizeLocation(order.shippingCountry, order.shippingCity);
      this.addToSegment(segments, location, order);
    });

    return segments;
  }
}
```

## 📊 Advanced Reporting System

### Automated Report Generation
```typescript
// lib/analytics/report-generator.ts
export class ReportGenerator {
  // Generate comprehensive business reports
  async generateBusinessReport(
    period: 'weekly' | 'monthly' | 'quarterly',
    format: 'pdf' | 'excel' | 'json' = 'json'
  ): Promise<BusinessReport> {
    const [
      salesData,
      customerData,
      inventoryData,
      marketingData,
      operationalData,
    ] = await Promise.all([
      this.getSalesAnalytics(period),
      this.getCustomerAnalytics(period),
      this.getInventoryAnalytics(period),
      this.getMarketingAnalytics(period),
      this.getOperationalAnalytics(period),
    ]);

    const report = {
      period,
      generatedAt: new Date(),
      executiveSummary: this.generateExecutiveSummary(salesData, customerData),
      salesAnalysis: salesData,
      customerAnalysis: customerData,
      inventoryAnalysis: inventoryData,
      marketingAnalysis: marketingData,
      operationalAnalysis: operationalData,
      recommendations: this.generateBusinessRecommendations(salesData, customerData, inventoryData),
      kpis: this.calculateKPIs(salesData, customerData, operationalData),
    };

    if (format === 'pdf') {
      return this.generatePDFReport(report);
    } else if (format === 'excel') {
      return this.generateExcelReport(report);
    }

    return report;
  }

  // Marketing attribution analysis
  async analyzeMarketingAttribution(): Promise<AttributionAnalysis> {
    const conversions = await this.getConversions();
    
    const attributionModels = {
      firstTouch: this.calculateFirstTouchAttribution(conversions),
      lastTouch: this.calculateLastTouchAttribution(conversions),
      linear: this.calculateLinearAttribution(conversions),
      timeDecay: this.calculateTimeDecayAttribution(conversions),
      positionBased: this.calculatePositionBasedAttribution(conversions),
    };

    return {
      models: attributionModels,
      channelPerformance: this.analyzeChannelPerformance(attributionModels),
      recommendations: this.generateAttributionRecommendations(attributionModels),
      budgetOptimization: this.optimizeMarketingBudget(attributionModels),
    };
  }
}
```

## 🔍 Advanced Search Analytics

### Search Intelligence
```typescript
// lib/analytics/search-analytics.ts
export class SearchAnalytics {
  // Analyze search behavior patterns
  async analyzeSearchBehavior(): Promise<SearchBehaviorAnalysis> {
    const searches = await this.getAllSearches();
    
    return {
      topQueries: this.getTopQueries(searches),
      zeroResultQueries: this.getZeroResultQueries(searches),
      searchToConversion: this.calculateSearchConversion(searches),
      queryIntentAnalysis: this.analyzeQueryIntents(searches),
      searchAbandonmentPoints: this.identifyAbandonmentPoints(searches),
      seasonalSearchTrends: this.analyzeSeasonalTrends(searches),
      recommendations: this.generateSearchOptimizations(searches),
    };
  }

  // Search performance optimization
  async optimizeSearchPerformance(): Promise<SearchOptimization> {
    const searchData = await this.getSearchPerformanceData();
    
    return {
      queryOptimizations: this.identifySlowQueries(searchData),
      indexOptimizations: this.recommendIndexOptimizations(searchData),
      autocompleteImprovements: this.improveAutocomplete(searchData),
      filterOptimizations: this.optimizeFilters(searchData),
      uiRecommendations: this.recommendUIImprovements(searchData),
    };
  }
}
```

## 🎯 Implementation Roadmap

### Phase 9A: Core Analytics (Weeks 1-2)
- Enhanced Google Analytics 4 integration
- Custom event tracking system
- Real-time metrics dashboard
- Basic business intelligence reports

### Phase 9B: Customer Intelligence (Weeks 3-4)
- Customer segmentation engine
- RFM analysis implementation
- Cohort analysis system
- Customer lifetime value calculation

### Phase 9C: Predictive Analytics (Weeks 5-6)
- Sales forecasting models
- Inventory optimization algorithms
- Price optimization engine
- Demand prediction system

### Phase 9D: Advanced Reporting (Weeks 7-8)
- Automated report generation
- Marketing attribution analysis
- Search behavior analytics
- Performance optimization recommendations

## 📈 Success Metrics

### Analytics KPIs
- **Data Accuracy**: >95% data quality score
- **Report Generation**: <5 minutes for complex reports
- **Prediction Accuracy**: >85% for sales forecasts
- **User Adoption**: >80% of admin users actively using analytics

### Business Impact
- **Revenue Optimization**: +15% through price optimization
- **Inventory Efficiency**: -20% carrying costs
- **Customer Retention**: +25% through targeted campaigns
- **Operational Efficiency**: +30% through data-driven decisions

## 🔧 Technical Implementation

### Analytics API Endpoints
```typescript
// API structure for analytics
/api/analytics/
├── business-metrics     # Core business KPIs
├── customer-analytics   # Customer behavior and segmentation
├── sales-forecast      # Predictive sales analytics
├── inventory-optimization # Inventory recommendations
├── price-optimization  # Dynamic pricing suggestions
├── marketing-attribution # Marketing channel analysis
├── search-analytics    # Search behavior analysis
├── live-metrics       # Real-time dashboard data
└── reports            # Automated report generation
```

### Database Analytics Schema
```sql
-- Analytics tables for advanced reporting
CREATE TABLE analytics_events (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB,
  page_url TEXT,
  referrer TEXT,
  user_agent TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE customer_segments (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id),
  segment_type TEXT NOT NULL,
  segment_value TEXT NOT NULL,
  confidence_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales_forecasts (
  id TEXT PRIMARY KEY,
  forecast_type TEXT NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  predicted_value DECIMAL(10,2),
  confidence_interval JSONB,
  actual_value DECIMAL(10,2),
  accuracy_score DECIMAL(3,2),
  created_at TIMESTAMP DEFAULT NOW()
);
```

This Phase 9 implementation provides comprehensive business intelligence capabilities that enable data-driven decision making and business optimization.