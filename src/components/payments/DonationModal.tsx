import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Heart, CreditCard, Smartphone, Mail, Shield, Star } from 'lucide-react';
import RealPaymentForm from './RealPaymentForm';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  movieTitle?: string;
}


const suggestedAmounts = [5, 10, 15, 25, 50, 100];

const paymentMethods = [
  { id: 'card', name: 'Mastercard', icon: CreditCard, description: 'Credit, Debit & Prepaid' },
  { id: 'momopay', name: 'MomoPay', icon: Smartphone, description: 'Mobile money transfer' },
  { id: 'paypal', name: 'PayPal', icon: Mail, description: 'Fast and secure' },
  { id: 'crypto', name: 'Cryptocurrency', icon: Shield, description: 'Bitcoin, Ethereum' },
];

export default function DonationModal({ isOpen, onClose, movieTitle }: DonationModalProps) {
  const [customAmount, setCustomAmount] = useState<number>(15);
  const [selectedPayment, setSelectedPayment] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDonate = async () => {
    // Payment is now handled by RealPaymentForm
  };

  const handlePaymentSuccess = (transactionId: string) => {
    setIsProcessing(false);
    setShowSuccess(true);
    
    // Store transaction
    console.log('Payment successful:', transactionId);
    
    // Close modal after success
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
  };

  const handlePaymentError = (error: string) => {
    setIsProcessing(false);
    alert('Payment failed: ' + error);
  };

  const handlePaymentProcessing = (processing: boolean) => {
    setIsProcessing(processing);
  };

  const selectedPaymentData = paymentMethods.find(method => method.id === selectedPayment);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Support Movie Night</h2>
                    <p className="text-gray-400">
                      {movieTitle ? `Keep "${movieTitle}" and more movies free for everyone` : 'Help us keep movies free for everyone'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Success Message */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 bg-gray-900 rounded-2xl flex items-center justify-center z-10"
                >
                  <div className="text-center">
                    <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Star className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                    <p className="text-gray-400">Your donation helps keep Movie Night free</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="p-6">
              {/* Custom Amount */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Choose Your Donation Amount</h3>
                
                {/* Suggested Amounts */}
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                  {suggestedAmounts.map((amount) => (
                    <motion.button
                      key={amount}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCustomAmount(amount)}
                      className={`px-4 py-3 rounded-lg font-bold transition-all ${
                        customAmount === amount
                          ? 'bg-red-600 text-white border-red-600'
                          : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700'
                      } border-2`}
                    >
                      ${amount}
                    </motion.button>
                  ))}
                </div>
                
                {/* Custom Amount Input */}
                <div className="bg-gray-800 rounded-xl p-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Custom Amount
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl text-gray-400">$</span>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Math.max(1, parseInt(e.target.value) || 0))}
                      placeholder="Enter amount"
                      className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white text-2xl font-bold placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                      min="1"
                      step="1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum donation: $1. Thank you for your support!
                  </p>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon;
                    return (
                      <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPayment(method.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                          selectedPayment === method.id
                            ? 'border-red-600 bg-red-600/10'
                            : 'border-gray-700 hover:border-gray-600'
                        }`}
                      >
                        <div className="text-center">
                          <Icon className="w-8 h-8 text-red-500 mx-auto mb-2" />
                          <h4 className="font-semibold text-white mb-1">{method.name}</h4>
                          <p className="text-xs text-gray-400">{method.description}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-800 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-white mb-4">Donation Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-300">
                    <span>Donation Amount:</span>
                    <span className="text-white font-semibold">${customAmount}</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>Payment Method:</span>
                    <span className="text-white font-semibold">{selectedPaymentData?.name}</span>
                  </div>
                  <div className="border-t border-gray-700 pt-2 mt-2">
                    <div className="flex justify-between text-white font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="text-red-500">${customAmount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Form */}
              {(selectedPayment === 'card' || selectedPayment === 'momopay') ? (
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Payment Details - {selectedPaymentData?.name}
                  </h3>
                  <RealPaymentForm
                    paymentMethod={selectedPayment as 'card' | 'momopay'}
                    amount={customAmount}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                    onProcessing={handlePaymentProcessing}
                  />
                </div>
              ) : (
                <>
                  {/* Action Buttons for other payment methods */}
                  <div className="flex gap-4">
                    <button
                      onClick={onClose}
                      className="flex-1 px-6 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDonate}
                      disabled={isProcessing}
                      className="flex-1 px-6 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="w-4 h-4" />
                          Continue with {selectedPaymentData?.name}
                        </>
                      )}
                    </button>
                  </div>

                  {/* Security Note */}
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
                      <Shield className="w-3 h-3" />
                      Secure payment processing • 256-bit encryption • PCI compliant
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
