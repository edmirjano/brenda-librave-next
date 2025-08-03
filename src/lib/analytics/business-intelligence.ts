import { prisma } from '@/lib/db/prisma';
import { logError, logInfo } from '@/lib/logging/logger';

export interface BusinessMetrics {
  revenue: {
    total: number;
    growth: number;
    forecast: number;
    byCategory: CategoryRevenue[];
    byMonth: MonthlyRevenue[];
  };
  customers: {
    total: number;
    new: number;
    retention: number;
    lifetime_value: number;
    churn_rate: number;
  };
  inventory: {
    total_books: number;
    low_stock: number;
    bestsellers: BookPerformance[];
    slow_movers: BookPerformance[];
    turnover_rate: number;
  };
  performance: {
    conversion_rate: number;
    avg_order_value: number;
    cart_abandonment: number;
    page_load_speed: number;
    bounce_rate: number;
  };
}

export interface CategoryRevenue {
  id: string;
  name: string;
  revenue: number;
  bookCount: number;
  growth: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
  growth: number;
}

export interface BookPerformance {
  id: string;
  title: string;
  author: string;
  priceALL: number;
  inventory: number;
  salesCount: number;
  revenue: number;
  daysSinceLastSale?: number;
}

export interface CustomerSegment {
  segment: string;
  count: number;
  revenue: number;
  avgOrderValue: number;
  characteristics: string[];
}

export interface SalesForecast {
  period: string;
  predictedRevenue: number;
  confidence: number;
  factors: string[];
}

/**
 * Business Intelligence service for advanced analytics
 */
export class BusinessIntelligence {
  /**
   * Get comprehensive business metrics
   */
  static async getBusinessMetrics(timeRange: '7d' | '30d' | '90d' | '1y' = '30d'): Promise<BusinessMetrics> {
    try {
      const endDate = new Date();
      const startDate = this.getStartDate(endDate, timeRange);
      const previousStartDate = this.getPreviousStartDate(startDate, timeRange);

      const [
        currentRevenue,
        previousRevenue,
        categoryRevenue,
        customerMetrics,
        inventoryMetrics,
        performanceMetrics,
      ] = await Promise.all([
        this.getRevenueForPeriod(startDate, endDate),
        this.getRevenueForPeriod(previousStartDate, startDate),
        this.getCategoryRevenue(startDate, endDate),
        this.getCustomerMetrics(startDate, endDate),
        this.getInventoryMetrics(),
        this.getPerformanceMetrics(startDate, endDate),
      ]);

      const revenueGrowth = previousRevenue > 0 
        ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
        : 0;

      const monthlyRevenue = await this.getMonthlyRevenue(startDate, endDate);

      logInfo('Business metrics calculated', {
        timeRange,
        currentRevenue,
        revenueGrowth,
      });

      return {
        revenue: {
          total: currentRevenue,
          growth: revenueGrowth,
          forecast: await this.forecastRevenue(timeRange),
          byCategory: categoryRevenue,
          byMonth: monthlyRevenue,
        },
        customers: customerMetrics,
        inventory: inventoryMetrics,
        performance: performanceMetrics,
      };
    } catch (error) {
      logError('Error calculating business metrics', error);
      throw new Error('Failed to calculate business metrics');
    }
  }

  /**
   * Get customer segmentation analysis
   */
  static async getCustomerSegmentation(): Promise<CustomerSegment[]> {
    try {
      const customers = await prisma.user.findMany({
        include: {
          orders: {
            where: {
              status: 'PAID',
            },
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
      });

      const segments = new Map<string, {
        customers: any[];
        totalRevenue: number;
        totalOrders: number;
      }>();

      customers.forEach(customer => {
        const totalSpent = customer.orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const orderCount = customer.orders.length;
        const daysSinceRegistration = this.daysBetween(customer.createdAt, new Date());

        const segment = this.determineCustomerSegment(totalSpent, orderCount, daysSinceRegistration);
        
        if (!segments.has(segment)) {
          segments.set(segment, { customers: [], totalRevenue: 0, totalOrders: 0 });
        }

        const segmentData = segments.get(segment)!;
        segmentData.customers.push(customer);
        segmentData.totalRevenue += totalSpent;
        segmentData.totalOrders += orderCount;
      });

      return Array.from(segments.entries()).map(([segment, data]) => ({
        segment,
        count: data.customers.length,
        revenue: data.totalRevenue,
        avgOrderValue: data.totalRevenue / Math.max(data.totalOrders, 1),
        characteristics: this.getSegmentCharacteristics(segment),
      }));
    } catch (error) {
      logError('Error getting customer segmentation', error);
      return [];
    }
  }

  /**
   * Generate sales forecast
   */
  static async generateSalesForecast(periods: number = 6): Promise<SalesForecast[]> {
    try {
      // Get historical sales data
      const historicalData = await this.getHistoricalSalesData(periods * 2);
      
      if (historicalData.length < 3) {
        throw new Error('Insufficient historical data for forecasting');
      }

      // Simple linear regression for forecasting
      const forecasts: SalesForecast[] = [];
      
      for (let i = 1; i <= periods; i++) {
        const trend = this.calculateTrend(historicalData);
        const seasonality = this.calculateSeasonality(historicalData, i);
        const baseRevenue = historicalData[historicalData.length - 1].revenue;
        
        const predictedRevenue = baseRevenue * (1 + trend) * seasonality;
        
        forecasts.push({
          period: this.getNextPeriodLabel(i),
          predictedRevenue,
          confidence: Math.max(0.6, 1 - (i * 0.1)), // Confidence decreases with distance
          factors: this.identifyForecastFactors(trend, seasonality),
        });
      }

      logInfo('Sales forecast generated', {
        periods,
        forecastCount: forecasts.length,
      });

      return forecasts;
    } catch (error) {
      logError('Error generating sales forecast', error);
      return [];
    }
  }

  /**
   * Analyze inventory performance
   */
  static async analyzeInventoryPerformance(): Promise<{
    bestsellers: BookPerformance[];
    slowMovers: BookPerformance[];
    stockAlerts: BookPerformance[];
    turnoverAnalysis: any;
  }> {
    try {
      const books = await prisma.book.findMany({
        where: { active: true },
        include: {
          orderItems: {
            where: {
              order: {
                status: 'PAID',
                createdAt: {
                  gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // Last 90 days
                },
              },
            },
            include: {
              order: true,
            },
          },
        },
      });

      const bookPerformance: BookPerformance[] = books.map(book => {
        const salesCount = book.orderItems.reduce((sum, item) => sum + item.quantity, 0);
        const revenue = book.orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const lastSale = book.orderItems.length > 0 
          ? Math.max(...book.orderItems.map(item => new Date(item.order.createdAt).getTime()))
          : 0;
        const daysSinceLastSale = lastSale > 0 
          ? Math.floor((Date.now() - lastSale) / (1000 * 60 * 60 * 24))
          : 999;

        return {
          id: book.id,
          title: book.title,
          author: book.author,
          priceALL: book.priceALL || 0,
          inventory: book.inventory,
          salesCount,
          revenue,
          daysSinceLastSale,
        };
      });

      const bestsellers = bookPerformance
        .filter(book => book.salesCount > 0)
        .sort((a, b) => b.salesCount - a.salesCount)
        .slice(0, 10);

      const slowMovers = bookPerformance
        .filter(book => book.inventory > 5 && book.daysSinceLastSale > 30)
        .sort((a, b) => b.daysSinceLastSale - a.daysSinceLastSale)
        .slice(0, 10);

      const stockAlerts = bookPerformance
        .filter(book => book.inventory < 5 && book.salesCount > 0)
        .sort((a, b) => a.inventory - b.inventory);

      logInfo('Inventory performance analyzed', {
        totalBooks: books.length,
        bestsellersCount: bestsellers.length,
        slowMoversCount: slowMovers.length,
        stockAlertsCount: stockAlerts.length,
      });

      return {
        bestsellers,
        slowMovers,
        stockAlerts,
        turnoverAnalysis: this.calculateTurnoverAnalysis(bookPerformance),
      };
    } catch (error) {
      logError('Error analyzing inventory performance', error);
      throw new Error('Failed to analyze inventory performance');
    }
  }

  /**
   * Get revenue for a specific period
   */
  private static async getRevenueForPeriod(startDate: Date, endDate: Date): Promise<number> {
    const result = await prisma.order.aggregate({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        totalAmount: true,
      },
    });

    return result._sum.totalAmount || 0;
  }

  /**
   * Get revenue by category
   */
  private static async getCategoryRevenue(startDate: Date, endDate: Date): Promise<CategoryRevenue[]> {
    const categoryData = await prisma.orderItem.groupBy({
      by: ['bookId'],
      where: {
        order: {
          status: 'PAID',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      },
      _sum: {
        price: true,
        quantity: true,
      },
    });

    // Get book categories
    const bookIds = categoryData.map(item => item.bookId);
    const books = await prisma.book.findMany({
      where: { id: { in: bookIds } },
      include: { category: true },
    });

    const categoryRevenue = new Map<string, { name: string; revenue: number; bookCount: number }>();

    categoryData.forEach(item => {
      const book = books.find(b => b.id === item.bookId);
      if (book) {
        const categoryId = book.categoryId;
        const categoryName = book.category.name;
        const revenue = (item._sum.price || 0) * (item._sum.quantity || 0);

        if (!categoryRevenue.has(categoryId)) {
          categoryRevenue.set(categoryId, { name: categoryName, revenue: 0, bookCount: 0 });
        }

        const category = categoryRevenue.get(categoryId)!;
        category.revenue += revenue;
        category.bookCount += 1;
      }
    });

    return Array.from(categoryRevenue.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      revenue: data.revenue,
      bookCount: data.bookCount,
      growth: 0, // Would calculate from previous period
    }));
  }

  /**
   * Get customer metrics
   */
  private static async getCustomerMetrics(startDate: Date, endDate: Date): Promise<{
    total: number;
    new: number;
    retention: number;
    lifetime_value: number;
    churn_rate: number;
  }> {
    const [totalCustomers, newCustomers, orders] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      }),
      prisma.order.findMany({
        where: {
          status: 'PAID',
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        include: {
          user: true,
        },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const uniqueCustomers = new Set(orders.map(order => order.userId)).size;
    const avgLifetimeValue = uniqueCustomers > 0 ? totalRevenue / uniqueCustomers : 0;

    return {
      total: totalCustomers,
      new: newCustomers,
      retention: uniqueCustomers > 0 ? (uniqueCustomers / totalCustomers) * 100 : 0,
      lifetime_value: avgLifetimeValue,
      churn_rate: 0, // Would calculate based on inactive users
    };
  }

  /**
   * Get inventory metrics
   */
  private static async getInventoryMetrics(): Promise<{
    total_books: number;
    low_stock: number;
    bestsellers: BookPerformance[];
    slow_movers: BookPerformance[];
    turnover_rate: number;
  }> {
    const [totalBooks, lowStockBooks] = await Promise.all([
      prisma.book.count({ where: { active: true } }),
      prisma.book.count({ where: { active: true, inventory: { lt: 5 } } }),
    ]);

    const inventoryAnalysis = await this.analyzeInventoryPerformance();

    return {
      total_books: totalBooks,
      low_stock: lowStockBooks,
      bestsellers: inventoryAnalysis.bestsellers,
      slow_movers: inventoryAnalysis.slowMovers,
      turnover_rate: 0, // Would calculate from sales velocity
    };
  }

  /**
   * Get performance metrics
   */
  private static async getPerformanceMetrics(startDate: Date, endDate: Date): Promise<{
    conversion_rate: number;
    avg_order_value: number;
    cart_abandonment: number;
    page_load_speed: number;
    bounce_rate: number;
  }> {
    const orders = await prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    const avgOrderValue = orders.length > 0 ? totalRevenue / orders.length : 0;

    // These would be calculated from actual analytics data
    return {
      conversion_rate: 2.5, // Would get from GA4
      avg_order_value: avgOrderValue,
      cart_abandonment: 68.5, // Would get from analytics
      page_load_speed: 1.8, // Would get from performance monitoring
      bounce_rate: 45.2, // Would get from GA4
    };
  }

  /**
   * Get monthly revenue breakdown
   */
  private static async getMonthlyRevenue(startDate: Date, endDate: Date): Promise<MonthlyRevenue[]> {
    const orders = await prisma.order.findMany({
      where: {
        status: 'PAID',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const monthlyData = new Map<string, { revenue: number; orders: number }>();

    orders.forEach(order => {
      const month = order.createdAt.toISOString().slice(0, 7); // YYYY-MM
      
      if (!monthlyData.has(month)) {
        monthlyData.set(month, { revenue: 0, orders: 0 });
      }

      const data = monthlyData.get(month)!;
      data.revenue += order.totalAmount;
      data.orders += 1;
    });

    return Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue,
      orders: data.orders,
      growth: 0, // Would calculate from previous month
    }));
  }

  /**
   * Calculate customer lifetime value
   */
  static async calculateCustomerLTV(userId: string): Promise<number> {
    try {
      const orders = await prisma.order.findMany({
        where: {
          userId,
          status: 'PAID',
        },
      });

      if (orders.length === 0) return 0;

      const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
      const avgOrderValue = totalSpent / orders.length;
      
      // Simple LTV calculation - would be more sophisticated in production
      const estimatedLifespan = 24; // months
      const purchaseFrequency = orders.length / 12; // per month (assuming 1 year of data)
      
      return avgOrderValue * purchaseFrequency * estimatedLifespan;
    } catch (error) {
      logError('Error calculating customer LTV', error);
      return 0;
    }
  }

  /**
   * Analyze customer churn risk
   */
  static async analyzeChurnRisk(): Promise<Array<{
    userId: string;
    userName: string;
    churnRisk: 'low' | 'medium' | 'high';
    lastOrderDate: Date;
    totalSpent: number;
    recommendations: string[];
  }>> {
    try {
      const customers = await prisma.user.findMany({
        include: {
          orders: {
            where: { status: 'PAID' },
            orderBy: { createdAt: 'desc' },
            take: 1,
          },
          _count: {
            select: {
              orders: true,
            },
          },
        },
      });

      return customers
        .filter(customer => customer._count.orders > 0)
        .map(customer => {
          const lastOrder = customer.orders[0];
          const daysSinceLastOrder = this.daysBetween(lastOrder.createdAt, new Date());
          
          let churnRisk: 'low' | 'medium' | 'high' = 'low';
          if (daysSinceLastOrder > 180) churnRisk = 'high';
          else if (daysSinceLastOrder > 90) churnRisk = 'medium';

          return {
            userId: customer.id,
            userName: customer.name,
            churnRisk,
            lastOrderDate: lastOrder.createdAt,
            totalSpent: lastOrder.totalAmount,
            recommendations: this.generateChurnPreventionRecommendations(churnRisk, daysSinceLastOrder),
          };
        })
        .filter(customer => customer.churnRisk !== 'low')
        .sort((a, b) => {
          const riskOrder = { high: 3, medium: 2, low: 1 };
          return riskOrder[b.churnRisk] - riskOrder[a.churnRisk];
        });
    } catch (error) {
      logError('Error analyzing churn risk', error);
      return [];
    }
  }

  /**
   * Helper methods
   */
  private static getStartDate(endDate: Date, timeRange: string): Date {
    const date = new Date(endDate);
    switch (timeRange) {
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case '90d':
        date.setDate(date.getDate() - 90);
        break;
      case '1y':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
  }

  private static getPreviousStartDate(startDate: Date, timeRange: string): Date {
    const date = new Date(startDate);
    switch (timeRange) {
      case '7d':
        date.setDate(date.getDate() - 7);
        break;
      case '30d':
        date.setDate(date.getDate() - 30);
        break;
      case '90d':
        date.setDate(date.getDate() - 90);
        break;
      case '1y':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    return date;
  }

  private static daysBetween(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  private static determineCustomerSegment(
    totalSpent: number,
    orderCount: number,
    daysSinceRegistration: number
  ): string {
    if (totalSpent > 10000 && orderCount > 5) return 'VIP';
    if (totalSpent > 5000 && orderCount > 3) return 'Loyal';
    if (orderCount > 1 && daysSinceRegistration < 30) return 'Promising';
    if (orderCount === 1 && daysSinceRegistration < 7) return 'New';
    if (orderCount === 0 && daysSinceRegistration > 30) return 'Inactive';
    return 'Regular';
  }

  private static getSegmentCharacteristics(segment: string): string[] {
    const characteristics: Record<string, string[]> = {
      VIP: ['High spending', 'Frequent purchases', 'Long-term customers'],
      Loyal: ['Regular purchases', 'Good spending', 'Engaged users'],
      Promising: ['Recent activity', 'Multiple purchases', 'Growth potential'],
      New: ['Recent registration', 'First purchase', 'Onboarding needed'],
      Regular: ['Occasional purchases', 'Average spending', 'Standard engagement'],
      Inactive: ['No recent activity', 'Re-engagement needed', 'Churn risk'],
    };

    return characteristics[segment] || ['Standard customer'];
  }

  private static async forecastRevenue(timeRange: string): Promise<number> {
    // Simplified forecast - would use more sophisticated models in production
    const currentRevenue = await this.getRevenueForPeriod(
      this.getStartDate(new Date(), timeRange),
      new Date()
    );
    
    // Simple 10% growth assumption
    return currentRevenue * 1.1;
  }

  private static async getHistoricalSalesData(periods: number): Promise<Array<{
    period: string;
    revenue: number;
    orders: number;
  }>> {
    // This would get actual historical data
    // For now, return mock data
    return [];
  }

  private static calculateTrend(historicalData: any[]): number {
    // Simple trend calculation
    if (historicalData.length < 2) return 0;
    
    const recent = historicalData.slice(-3);
    const older = historicalData.slice(-6, -3);
    
    const recentAvg = recent.reduce((sum, d) => sum + d.revenue, 0) / recent.length;
    const olderAvg = older.reduce((sum, d) => sum + d.revenue, 0) / older.length;
    
    return olderAvg > 0 ? (recentAvg - olderAvg) / olderAvg : 0;
  }

  private static calculateSeasonality(historicalData: any[], periodOffset: number): number {
    // Simple seasonality calculation
    return 1 + (Math.sin(periodOffset * Math.PI / 6) * 0.1); // 10% seasonal variation
  }

  private static identifyForecastFactors(trend: number, seasonality: number): string[] {
    const factors = [];
    
    if (trend > 0.1) factors.push('Strong growth trend');
    else if (trend < -0.1) factors.push('Declining trend');
    else factors.push('Stable trend');
    
    if (seasonality > 1.05) factors.push('Seasonal peak expected');
    else if (seasonality < 0.95) factors.push('Seasonal low expected');
    
    return factors;
  }

  private static getNextPeriodLabel(offset: number): string {
    const date = new Date();
    date.setMonth(date.getMonth() + offset);
    return date.toISOString().slice(0, 7); // YYYY-MM
  }

  private static generateChurnPreventionRecommendations(
    churnRisk: 'low' | 'medium' | 'high',
    daysSinceLastOrder: number
  ): string[] {
    const recommendations = [];
    
    if (churnRisk === 'high') {
      recommendations.push('Send personalized discount offer');
      recommendations.push('Recommend books based on previous purchases');
      recommendations.push('Invite to exclusive events');
    } else if (churnRisk === 'medium') {
      recommendations.push('Send newsletter with new releases');
      recommendations.push('Offer free shipping on next order');
    }
    
    return recommendations;
  }

  private static calculateTurnoverAnalysis(bookPerformance: BookPerformance[]): any {
    // Calculate inventory turnover metrics
    const totalInventoryValue = bookPerformance.reduce(
      (sum, book) => sum + (book.priceALL * book.inventory), 
      0
    );
    
    const totalSalesValue = bookPerformance.reduce(
      (sum, book) => sum + book.revenue, 
      0
    );

    return {
      totalInventoryValue,
      totalSalesValue,
      turnoverRatio: totalInventoryValue > 0 ? totalSalesValue / totalInventoryValue : 0,
      fastMovers: bookPerformance.filter(book => book.salesCount > 10).length,
      slowMovers: bookPerformance.filter(book => book.daysSinceLastSale > 60).length,
    };
  }
}