import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CreditCard, Smartphone, Shield, Eye, EyeOff, Check } from 'lucide-react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

interface FlutterwavePaymentProps {
  amount: number;
  email?: string;
  phone?: string;
  onSuccess: (transactionId: string) => void;
  onError: (error: string) => void;
  onProcessing: (isProcessing: boolean) => void;
}


export default function FlutterwavePayment({ 
  amount, 
  email = '', 
  phone = '',
  onSuccess, 
  onError, 
  onProcessing 
}: FlutterwavePaymentProps) {
  const [formData, setFormData] = useState({
    email: email || '',
    phone: phone || '',
    firstName: '',
    lastName: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // More lenient email validation
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Flexible phone validation - accept any format with country code
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.length < 5) {
      newErrors.phone = 'Phone number too short (include country code)';
    }

    // More lenient name validation
    if (!formData.firstName || formData.firstName.trim().length < 1) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName || formData.lastName.trim().length < 1) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    console.log('Form validation errors:', newErrors); // Debug log
    return Object.keys(newErrors).length === 0;
  };

  const config = {
    public_key: import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY,
    tx_ref: `movie-night-${Date.now()}`,
    amount: amount,
    currency: 'XAF', // Cameroon Franc
    payment_options: 'card, mobilemoney, ussd, barter, banktransfer',
    redirect_url: `${window.location.origin}/payment-success`,
    customer: {
      email: formData.email,
      phone_number: formData.phone,
      name: `${formData.firstName} ${formData.lastName}`
    },
    customizations: {
      title: 'Movie Night Donation',
      description: `Support Movie Night with ${amount} XAF donation`,
      logo: `${window.location.origin}/logo.png`
    },
    callback: (response: any) => {
      if (response.status === 'successful') {
        onSuccess(response.transaction_id);
      } else {
        onError('Payment failed. Please try again.');
      }
      setIsSubmitting(false);
      onProcessing(false);
      closePaymentModal();
    },
    onclose: () => {
      setIsSubmitting(false);
      onProcessing(false);
      onError('Payment cancelled by user');
    },
    meta: {
      source: 'movie-night-donation',
      amount: amount,
      timestamp: new Date().toISOString()
    }
  };

  const initializeFlutterwavePayment = useFlutterwave(config);

  const handlePaymentSubmit = () => {
    console.log('Payment button clicked'); // Debug log
    console.log('Form data:', formData); // Debug log
    
    if (!validateForm()) {
      console.log('Form validation failed'); // Debug log
      return;
    }

    console.log('Form validation passed, initiating payment'); // Debug log
    setIsSubmitting(true);
    onProcessing(true);
    
    initializeFlutterwavePayment({
      onClose: () => {
        setIsSubmitting(false);
        onProcessing(false);
        onError('Payment cancelled by user');
      },
      callback: (response: any) => {
        if (response.status === 'successful') {
          onSuccess(response.transaction_id);
        } else {
          onError('Payment failed. Please try again.');
        }
        setIsSubmitting(false);
        onProcessing(false);
        closePaymentModal();
      }
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Payment Information</h3>
        
        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your@email.com"
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                errors.email ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                errors.phone ? 'border-red-500' : 'border-gray-700'
              }`}
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
            )}
            <p className="text-gray-500 text-xs mt-1">
              Include your country code (e.g., +1, +44, +237)
            </p>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="John"
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                  errors.firstName ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Doe"
                className={`w-full px-4 py-3 bg-gray-900 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors ${
                  errors.lastName ? 'border-red-500' : 'border-gray-700'
                }`}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Methods Info */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Supported Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-gray-300">
            <CreditCard className="w-5 h-5 text-red-500" />
            <span className="text-sm">Credit/Debit Card</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Smartphone className="w-5 h-5 text-green-500" />
            <span className="text-sm">Mobile Money</span>
          </div>
          <div className="flex items-center gap-2 text-gray-300">
            <Shield className="w-5 h-5 text-blue-500" />
            <span className="text-sm">Bank Transfer</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          Secure payments powered by Flutterwave. All payment methods are encrypted and secure.
        </p>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handlePaymentSubmit}
        disabled={isSubmitting}
        className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Shield className="w-5 h-5" />
            Pay
          </>
        )}
      </motion.button>
    </div>
  );
}
