import CryptoJS from 'crypto-js';

export interface FlutterwavePaymentRequest {
  amount: number;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  currency?: string;
  txRef?: string;
  redirectUrl?: string;
}

export interface FlutterwavePaymentResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  message: string;
  error?: string;
}

export interface FlutterwaveWebhookPayload {
  event: string;
  data: {
    id: number;
    tx_ref: string;
    flw_ref: string;
    amount: number;
    currency: string;
    status: string;
    payment_type: string;
    created_at: string;
    customer: {
      email: string;
      name: string;
      phone_number: string;
    };
    meta?: Record<string, any>;
  };
}

export class FlutterwaveService {
  private static instance: FlutterwaveService;
  private readonly publicKey: string;
  private readonly secretKey: string;
  private readonly encryptionKey: string;
  private readonly isTestMode: boolean;

  constructor() {
    this.publicKey = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY || '';
    this.secretKey = import.meta.env.VITE_FLUTTERWAVE_SECRET_KEY || '';
    this.encryptionKey = import.meta.env.VITE_FLUTTERWAVE_ENCRYPTION_KEY || '';
    this.isTestMode = import.meta.env.VITE_FLUTTERWAVE_ENV === 'sandbox';
  }

  static getInstance(): FlutterwaveService {
    if (!FlutterwaveService.instance) {
      FlutterwaveService.instance = new FlutterwaveService();
    }
    return FlutterwaveService.instance;
  }

  validateCredentials(): boolean {
    return !!(this.publicKey && this.secretKey && this.encryptionKey);
  }

  generateTransactionReference(prefix: string = 'movie-night'): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${prefix}-${timestamp}-${random}`;
  }

  encryptData(data: any): string {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not configured');
    }
    
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.encryptionKey).toString();
  }

  decryptData(encryptedData: string): any {
    if (!this.encryptionKey) {
      throw new Error('Encryption key not configured');
    }
    
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.encryptionKey);
    const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
    
    if (!decryptedString) {
      throw new Error('Failed to decrypt data');
    }
    
    return JSON.parse(decryptedString);
  }

  createPaymentConfig(request: FlutterwavePaymentRequest): any {
    const txRef = request.txRef || this.generateTransactionReference();
    const baseUrl = window.location.origin;
    const redirectUrl = request.redirectUrl || `${baseUrl}/payment/success`;

    return {
      public_key: this.publicKey,
      tx_ref: txRef,
      amount: request.amount,
      currency: request.currency || 'XAF', // Default to Cameroon Franc
      payment_options: 'card, mobilemoney, ussd, barter, banktransfer',
      redirect_url: redirectUrl,
      customer: {
        email: request.email,
        phone_number: request.phone,
        name: `${request.firstName} ${request.lastName}`
      },
      customizations: {
        title: 'Movie Night Donation',
        description: `Support Movie Night with ${request.currency || 'XAF'} ${request.amount} donation`,
        logo: `${baseUrl}/logo.png`
      },
      meta: {
        source: 'movie-night-donation',
        amount: request.amount,
        currency: request.currency || 'XAF',
        timestamp: new Date().toISOString(),
        environment: this.isTestMode ? 'test' : 'production'
      }
    };
  }

  async verifyTransaction(transactionId: string): Promise<FlutterwavePaymentResponse> {
    if (!this.secretKey) {
      return {
        success: false,
        message: 'Flutterwave secret key not configured',
        error: 'Configuration error'
      };
    }

    try {
      const response = await fetch(
        `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();

      if (data.status === 'success' && data.data.status === 'successful') {
        return {
          success: true,
          transactionId: data.data.id.toString(),
          status: data.data.status,
          message: 'Payment verified successfully'
        };
      } else {
        return {
          success: false,
          message: 'Payment verification failed',
          error: data.message || 'Transaction not successful'
        };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Network error during verification',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  validateWebhookSignature(payload: string, signature: string): boolean {
    if (!this.secretKey) {
      return false;
    }

    const hash = CryptoJS.HmacSHA512(payload, this.secretKey).toString();
    return hash === signature;
  }

  processWebhookPayload(payload: FlutterwaveWebhookPayload): FlutterwavePaymentResponse {
    try {
      switch (payload.event) {
        case 'charge.completed':
          if (payload.data.status === 'successful') {
            return {
              success: true,
              transactionId: payload.data.flw_ref,
              status: payload.data.status,
              message: 'Payment completed successfully'
            };
          } else {
            return {
              success: false,
              message: 'Payment failed',
              error: `Transaction status: ${payload.data.status}`
            };
          }
        
        case 'payment.failed':
          return {
            success: false,
            message: 'Payment failed',
            error: 'Payment was not successful'
          };
        
        default:
          return {
            success: false,
            message: 'Unhandled webhook event',
            error: `Event: ${payload.event}`
          };
      }
    } catch (error) {
      return {
        success: false,
        message: 'Webhook processing error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getSupportedCountries(): Promise<any[]> {
    try {
      const response = await fetch(
        'https://api.flutterwave.com/v3/countries',
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      return data.status === 'success' ? data.data : [];
    } catch (error) {
      console.error('Failed to fetch supported countries:', error);
      return [];
    }
  }

  async getBanks(country: string = 'CM'): Promise<any[]> {
    try {
      const response = await fetch(
        `https://api.flutterwave.com/v3/banks/${country}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.secretKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const data = await response.json();
      return data.status === 'success' ? data.data : [];
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      return [];
    }
  }

  getPaymentMethods(): string[] {
    return [
      'card',
      'mobilemoney',
      'ussd',
      'barter',
      'banktransfer'
    ];
  }

  getCurrencySymbol(currency: string): string {
    const symbols: Record<string, string> = {
      'XAF': 'FCFA',
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'NGN': '₦',
      'GHS': '₵'
    };
    return symbols[currency] || currency;
  }
}

export const flutterwaveService = FlutterwaveService.getInstance();
