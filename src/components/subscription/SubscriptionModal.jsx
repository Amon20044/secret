import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, 
  Check, 
  Crown, 
  Zap, 
  Users, 
  Cloud, 
  Cpu, 
  Brain,
  Star,
  Sparkles
} from 'lucide-react';
import GlassCard from '../ui/GlassCard';
import Button from '../ui/Button';
import { useRevenueCat } from '../../hooks/useRevenueCat';
import { useAppStore } from '../../store/useAppStore';

const SubscriptionModal = ({ isOpen, onClose }) => {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isLoading, setIsLoading] = useState(false);
  const { purchasePackage, offerings } = useRevenueCat();
  const { subscriptionTier } = useAppStore();

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      icon: <Sparkles className="w-6 h-6" />,
      features: [
        '3 models maximum',
        'Basic AI responses',
        'Standard hand tracking',
        'Community support',
        'WebGPU rendering'
      ],
      limitations: [
        'Limited model uploads',
        'Basic AI features',
        'No priority support'
      ],
      color: 'gray',
      current: subscriptionTier === 'free'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$9.99',
      period: 'per month',
      description: 'For serious engineers and students',
      icon: <Zap className="w-6 h-6" />,
      features: [
        'Unlimited models',
        'Advanced AI analysis',
        'Priority processing',
        'Email support',
        'Premium gestures',
        'Voice commands',
        'Export options',
        '100MB file limit'
      ],
      popular: true,
      color: 'electric-blue',
      current: subscriptionTier === 'pro'
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: '$49.99',
      period: 'per month',
      description: 'For teams and organizations',
      icon: <Crown className="w-6 h-6" />,
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Custom environments',
        'API access',
        'Dedicated support',
        'SSO integration',
        'Advanced analytics',
        'Custom integrations'
      ],
      color: 'purple-gradient',
      current: subscriptionTier === 'enterprise'
    }
  ];

  const handlePurchase = async (planId) => {
    if (planId === 'free' || planId === subscriptionTier) return;

    setIsLoading(true);
    try {
      const packageIdentifier = planId === 'pro' ? 'pro_monthly' : 'enterprise_monthly';
      await purchasePackage(packageIdentifier);
      onClose();
    } catch (error) {
      console.error('Purchase failed:', error);
      // Show error message
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl max-h-[90vh] overflow-y-auto"
      >
        <GlassCard className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
              <p className="text-gray-400">Unlock the full potential of Three21.go</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                whileHover={{ y: -5 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-electric-blue to-purple-gradient px-4 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                <GlassCard 
                  className={`p-6 h-full ${
                    selectedPlan === plan.id ? 'ring-2 ring-electric-blue' : ''
                  } ${plan.current ? 'border-green-400' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                  hover
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg bg-${plan.color}/20`}>
                      <div className={`text-${plan.color === 'gray' ? 'gray-400' : plan.color}`}>
                        {plan.icon}
                      </div>
                    </div>
                    {plan.current && (
                      <div className="px-2 py-1 bg-green-400/20 text-green-400 rounded-full text-xs">
                        Current
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-400 text-sm">/{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                    
                    {plan.limitations?.map((limitation, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-500">
                        <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <span>{limitation}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    variant={plan.current ? 'glass' : plan.popular ? 'primary' : 'glass'}
                    className="w-full"
                    disabled={plan.current || isLoading}
                    onClick={() => handlePurchase(plan.id)}
                  >
                    {plan.current ? 'Current Plan' : plan.id === 'free' ? 'Current Plan' : `Choose ${plan.name}`}
                  </Button>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-400">
            <p className="mb-2">🔒 Secure payment processing via RevenueCat</p>
            <p>Cancel anytime • 7-day free trial • No hidden fees</p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default SubscriptionModal;