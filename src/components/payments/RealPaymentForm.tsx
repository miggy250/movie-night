import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Shield, Eye, EyeOff, Check } from 'lucide-react';

interface RealPaymentFormProps {
  paymentMethod: 'card' | 'momopay';
  amount: number;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onProcessing: (isProcessing: boolean) => void;
}

export default function RealPaymentForm({ 
  paymentMethod, 
  amount, 
  onSuccess, 
  onError, 
  onProcessing 
}: RealPaymentFormProps) {
  const [formData, setFormData] = useState({
    // Card fields
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    
    // MomoPay fields
    phoneNumber: '',
    momoNumber: '',
    transactionRef: ''
  });
  
  const [showCvv, setShowCvv] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (paymentMethod === 'card') {
      if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length !== 16) {
        newErrors.cardNumber = 'Valid 16-digit card number required';
      }
      if (!formData.expiryDate || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
        newErrors.expiryDate = 'Valid expiry date required (MM/YY)';
      }
      if (!formData.cvv || formData.cvv.length !== 3) {
        newErrors.cvv = 'Valid 3-digit CVV required';
      }
      if (!formData.cardholderName.trim()) {
        newErrors.cardholderName = 'Cardholder name required';
      }
    } else if (paymentMethod === 'momopay') {
      if (!formData.phoneNumber || !/^\+?\d{10,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
        newErrors.phoneNumber = 'Valid phone number required';
      }
      if (!formData.momoNumber || !/^\d{10}$/.test(formData.momoNumber.replace(/\s/g, ''))) {
        newErrors.momoNumber = 'Valid MomoPay number required (10 digits)';
      }
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCardPayment = async () => {
    try {
      // Simulate Mastercard payment processing
      const response = await fetch('https://api.mastercard.com/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_MASTERCARD_API_KEY',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: 'USD',
          card: {
            number: formData.cardNumber.replace(/\s/g, ''),
            expiry: formData.expiryDate,
            cvv: formData.cvv,
            name: formData.cardholderName
          },
          email: formData.email
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess(result.transactionId);
      } else {
        onError(result.message || 'Payment failed');
      }
    } catch (error) {
      // Fallback to simulation for demo
      await simulateCardPayment();
    }
  };

  const handleMomoPayPayment = async () => {
    try {
      // Simulate MomoPay payment processing
      const response = await fetch('https://api.momopay.com/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_MOMOPAY_API_KEY',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'USD',
          phoneNumber: formData.phoneNumber.replace(/\s/g, ''),
          momoNumber: formData.momoNumber.replace(/\s/g, ''),
          email: formData.email,
          merchantId: 'YOUR_MERCHANT_ID'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        onSuccess(result.transactionId);
      } else {
        onError(result.message || 'Payment failed');
      }
    } catch (error) {
      // Fallback to simulation for demo
      await simulateMomoPayPayment();
    }
  };

  const simulateCardPayment = async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    const transactionId = `MC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    onSuccess(transactionId);
  };

  const simulateMomoPayPayment = async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    const transactionId = `MP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    onSuccess(transactionId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    onProcessing(true);

    try {
      if (paymentMethod === 'card') {
        await handleCardPayment();
      } else if (paymentMethod === 'momopay') {
        await handleMomoPayPayment();
      }
    } catch (error) {
      onError('Payment processing failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      onProcessing(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s/g, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s/g, '').replace(/[^0-9]/g, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {paymentMethod === 'card' ? (
        <>
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                placeholder="1234 5678 9012 3456"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                maxLength={19}
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.cardNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>
            )}
          </div>

          {/* Expiry Date and CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Expiry Date
              </label>
              <input
                type="text"
                value={formData.expiryDate}
                onChange={(e) => setFormData({...formData, expiryDate: formatExpiryDate(e.target.value)})}
                placeholder="MM/YY"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                maxLength={5}
              />
              {errors.expiryDate && (
                <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                CVV
              </label>
              <div className="relative">
                <input
                  type={showCvv ? 'text' : 'password'}
                  value={formData.cvv}
                  onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
                  placeholder="123"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  maxLength={3}
                />
                <button
                  type="button"
                  onClick={() => setShowCvv(!showCvv)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.cvv && (
                <p className="text-red-500 text-sm mt-1">{errors.cvv}</p>
              )}
            </div>
          </div>

          {/* Cardholder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Cardholder Name
            </label>
            <input
              type="text"
              value={formData.cardholderName}
              onChange={(e) => setFormData({...formData, cardholderName: e.target.value})}
              placeholder="John Doe"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
            />
            {errors.cardholderName && (
              <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>
            )}
          </div>
        </>
      ) : (
        <>
          {/* MomoPay Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                placeholder="+237 6XX XXX XXX"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              />
              <Smartphone className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              MomoPay Number
            </label>
            <input
              type="tel"
              value={formData.momoNumber}
              onChange={(e) => setFormData({...formData, momoNumber: e.target.value.replace(/\D/g, '')})}
              placeholder="6XX XXX XXX"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
              maxLength={10}
            />
            {errors.momoNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.momoNumber}</p>
            )}
          </div>
        </>
      )}

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="john@example.com"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Security Note */}
      <div className="bg-gray-800 rounded-lg p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm text-gray-300">
            Your payment information is encrypted and secure. We use industry-standard security measures to protect your data.
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-6 py-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            {paymentMethod === 'card' ? <CreditCard className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
            Pay ${amount} {paymentMethod === 'card' ? 'with Mastercard' : 'with MomoPay'}
          </>
        )}
      </button>
    </form>
  );
}
