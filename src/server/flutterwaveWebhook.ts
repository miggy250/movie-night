import express from 'express';
import crypto from 'crypto';
import { flutterwaveService, FlutterwaveWebhookPayload } from '../services/flutterwaveService';

const router = express.Router();

// Flutterwave webhook endpoint
router.post('/flutterwave', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['verif-hash'] as string;
    const webhookSecret = process.env.VITE_FLUTTERWAVE_WEBHOOK_SECRET;

    if (!signature) {
      console.error('Missing Flutterwave webhook signature');
      return res.status(401).json({ error: 'Missing signature' });
    }

    if (!webhookSecret) {
      console.error('Flutterwave webhook secret not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Verify webhook signature
    const hash = crypto.createHmac('sha512', webhookSecret).update(JSON.stringify(req.body)).digest('hex');
    
    if (hash !== signature) {
      console.error('Invalid Flutterwave webhook signature');
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const payload: FlutterwaveWebhookPayload = req.body;
    console.log('Flutterwave webhook received:', payload);

    // Process the webhook payload
    const result = flutterwaveService.processWebhookPayload(payload);

    if (result.success) {
      // Handle successful payment
      await handleSuccessfulPayment(payload, result);
      
      // Store payment record
      await storePaymentRecord(payload, result);
      
      console.log('Payment processed successfully:', result.transactionId);
    } else {
      // Handle failed payment
      await handleFailedPayment(payload, result);
      console.error('Payment processing failed:', result.error);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ status: 'received' });

  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Helper function to handle successful payments
async function handleSuccessfulPayment(payload: FlutterwaveWebhookPayload, result: any) {
  // Here you can:
  // 1. Update user's subscription/donation status
  // 2. Send confirmation email
  // 3. Update analytics
  // 4. Trigger any post-payment actions
  
  console.log('Processing successful payment:', {
    transactionId: result.transactionId,
    amount: payload.data.amount,
    currency: payload.data.currency,
    customer: payload.data.customer,
    timestamp: payload.data.created_at
  });

  // Example: Send notification (implement your notification service)
  // await notificationService.sendPaymentConfirmation(payload.data);
  
  // Example: Update user record (implement your database service)
  // await userService.updateDonationStatus(payload.data.customer.email, {
  //   status: 'active',
  //   lastPayment: payload.data.created_at,
  //   amount: payload.data.amount
  // });
}

// Helper function to handle failed payments
async function handleFailedPayment(payload: FlutterwaveWebhookPayload, result: any) {
  // Here you can:
  // 1. Log the failure
  // 2. Notify user of failed payment
  // 3. Update analytics
  
  console.log('Processing failed payment:', {
    transactionId: payload.data.flw_ref,
    amount: payload.data.amount,
    status: payload.data.status,
    customer: payload.data.customer
  });

  // Example: Send failure notification
  // await notificationService.sendPaymentFailure(payload.data);
}

// Helper function to store payment records
async function storePaymentRecord(payload: FlutterwaveWebhookPayload, result: any) {
  // Here you would typically store in your database
  const paymentRecord = {
    id: payload.data.id,
    transactionId: result.transactionId,
    txRef: payload.data.tx_ref,
    flwRef: payload.data.flw_ref,
    amount: payload.data.amount,
    currency: payload.data.currency,
    status: payload.data.status,
    paymentType: payload.data.payment_type,
    customer: payload.data.customer,
    meta: payload.data.meta,
    createdAt: payload.data.created_at,
    processedAt: new Date().toISOString()
  };

  // Example: Save to database (implement your database service)
  // await databaseService.savePaymentRecord(paymentRecord);
  
  // For demo purposes, store in localStorage-like structure
  console.log('Payment record to store:', paymentRecord);
}

// Webhook verification endpoint (for testing)
router.get('/flutterwave/verify', (req, res) => {
  res.json({
    status: 'Flutterwave webhook endpoint is active',
    timestamp: new Date().toISOString(),
    configured: !!process.env.VITE_FLUTTERWAVE_WEBHOOK_SECRET
  });
});

export default router;
