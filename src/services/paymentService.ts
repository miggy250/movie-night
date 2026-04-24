export interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  popular?: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'crypto' | 'mobile';
  icon: string;
  description: string;
}

export interface DonationRequest {
  tier: DonationTier;
  paymentMethod: PaymentMethod;
  customerEmail?: string;
  customerName?: string;
  isAnonymous: boolean;
}

export interface PaymentResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  error?: string;
}

// Mock payment processing service
export class PaymentService {
  private static instance: PaymentService;

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService();
    }
    return PaymentService.instance;
  }

  async processDonation(request: DonationRequest): Promise<PaymentResponse> {
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Validate request
      if (!request.tier || !request.paymentMethod) {
        return {
          success: false,
          message: 'Invalid donation request',
          error: 'Missing required fields'
        };
      }

      // Simulate payment processing with different providers
      const paymentResult = await this.simulatePaymentProvider(request);

      if (paymentResult.success) {
        // Store donation record (in real app, this would go to a database)
        await this.recordDonation(request, paymentResult.transactionId);

        return {
          success: true,
          transactionId: paymentResult.transactionId,
          message: `Thank you for your ${request.tier.name} donation of $${request.tier.amount}!`
        };
      } else {
        return {
          success: false,
          message: 'Payment failed',
          error: paymentResult.error
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Payment processing error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async simulatePaymentProvider(request: DonationRequest): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulate different payment providers
    switch (request.paymentMethod.type) {
      case 'card':
        return this.simulateCardPayment(request);
      case 'paypal':
        return this.simulatePayPalPayment(request);
      case 'crypto':
        return this.simulateCryptoPayment(request);
      case 'mobile':
        return this.simulateMobilePayment(request);
      default:
        return { success: false, error: 'Unsupported payment method' };
    }
  }

  private async simulateCardPayment(request: DonationRequest): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulate credit card processing
    const cardNumber = '4242424242424242'; // Test card number
    const transactionId = `card_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      return { success: true, transactionId };
    } else {
      return { success: false, error: 'Card declined' };
    }
  }

  private async simulatePayPalPayment(request: DonationRequest): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulate PayPal processing
    const transactionId = `paypal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate 98% success rate
    const isSuccess = Math.random() > 0.02;
    
    if (isSuccess) {
      return { success: true, transactionId };
    } else {
      return { success: false, error: 'PayPal payment failed' };
    }
  }

  private async simulateCryptoPayment(request: DonationRequest): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulate cryptocurrency processing
    const transactionId = `crypto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate 90% success rate
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return { success: true, transactionId };
    } else {
      return { success: false, error: 'Cryptocurrency transaction failed' };
    }
  }

  private async simulateMobilePayment(request: DonationRequest): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simulate mobile payment (Apple Pay, Google Pay)
    const transactionId = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Simulate 97% success rate
    const isSuccess = Math.random() > 0.03;
    
    if (isSuccess) {
      return { success: true, transactionId };
    } else {
      return { success: false, error: 'Mobile payment failed' };
    }
  }

  private async recordDonation(request: DonationRequest, transactionId: string): Promise<void> {
    // In a real app, this would save to a database
    const donationRecord = {
      id: transactionId,
      tier: request.tier.id,
      amount: request.tier.amount,
      paymentMethod: request.paymentMethod.type,
      customerEmail: request.customerEmail,
      customerName: request.customerName,
      isAnonymous: request.isAnonymous,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Simulate database save
    console.log('Donation recorded:', donationRecord);
    
    // Store in localStorage for demo purposes
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    donations.push(donationRecord);
    localStorage.setItem('donations', JSON.stringify(donations));
  }

  async getDonationHistory(email?: string): Promise<any[]> {
    // In a real app, this would fetch from a database
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    
    if (email) {
      return donations.filter((d: any) => d.customerEmail === email);
    }
    
    return donations;
  }

  async getDonationStats(): Promise<{
    totalDonations: number;
    totalAmount: number;
    averageDonation: number;
    tierBreakdown: Record<string, number>;
  }> {
    const donations = JSON.parse(localStorage.getItem('donations') || '[]');
    
    const totalDonations = donations.length;
    const totalAmount = donations.reduce((sum: number, d: any) => sum + d.amount, 0);
    const averageDonation = totalDonations > 0 ? totalAmount / totalDonations : 0;
    
    const tierBreakdown: Record<string, number> = {};
    donations.forEach((d: any) => {
      tierBreakdown[d.tier] = (tierBreakdown[d.tier] || 0) + 1;
    });

    return {
      totalDonations,
      totalAmount,
      averageDonation,
      tierBreakdown
    };
  }
}

export const paymentService = PaymentService.getInstance();
