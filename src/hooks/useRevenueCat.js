import { useState, useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

export const useRevenueCat = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [offerings, setOfferings] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const { setSubscriptionTier, setSubscriptionStatus } = useAppStore();

  useEffect(() => {
    const initializeRevenueCat = async () => {
      try {
        // Initialize RevenueCat (this would be the actual RevenueCat SDK in production)
        console.log('Initializing RevenueCat...');
        
        // Mock initialization
        const mockCustomerInfo = {
          entitlements: {
            active: {},
            all: {}
          },
          activeSubscriptions: [],
          allPurchaseDates: {},
          firstSeen: new Date().toISOString(),
          originalAppUserId: 'user_123',
          requestDate: new Date().toISOString()
        };

        const mockOfferings = {
          current: {
            identifier: 'default',
            serverDescription: 'Default offering',
            availablePackages: [
              {
                identifier: 'pro_monthly',
                packageType: 'MONTHLY',
                product: {
                  identifier: 'pro_monthly',
                  description: 'Pro subscription with unlimited models and advanced AI features',
                  title: 'Three21.go Pro Monthly',
                  price: 9.99,
                  priceString: '$9.99',
                  currencyCode: 'USD'
                }
              },
              {
                identifier: 'enterprise_monthly',
                packageType: 'MONTHLY',
                product: {
                  identifier: 'enterprise_monthly',
                  description: 'Enterprise subscription with team collaboration and API access',
                  title: 'Three21.go Enterprise Monthly',
                  price: 49.99,
                  priceString: '$49.99',
                  currencyCode: 'USD'
                }
              }
            ]
          }
        };

        setCustomerInfo(mockCustomerInfo);
        setOfferings(mockOfferings);
        setIsInitialized(true);

        // Update subscription status
        updateSubscriptionStatus(mockCustomerInfo);

      } catch (error) {
        console.error('Failed to initialize RevenueCat:', error);
      }
    };

    initializeRevenueCat();
  }, []);

  const updateSubscriptionStatus = (customerInfo) => {
    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    
    if (activeEntitlements.includes('enterprise')) {
      setSubscriptionTier('enterprise');
      setSubscriptionStatus('active');
    } else if (activeEntitlements.includes('pro')) {
      setSubscriptionTier('pro');
      setSubscriptionStatus('active');
    } else {
      setSubscriptionTier('free');
      setSubscriptionStatus('free');
    }
  };

  const purchasePackage = async (packageIdentifier) => {
    try {
      console.log(`Purchasing package: ${packageIdentifier}`);
      
      // Mock purchase flow
      const mockPurchaseResult = {
        customerInfo: {
          ...customerInfo,
          entitlements: {
            active: {
              [packageIdentifier.includes('pro') ? 'pro' : 'enterprise']: {
                identifier: packageIdentifier.includes('pro') ? 'pro' : 'enterprise',
                isActive: true,
                willRenew: true,
                periodType: 'NORMAL',
                latestPurchaseDate: new Date().toISOString(),
                expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
              }
            },
            all: customerInfo.entitlements.all
          }
        }
      };

      setCustomerInfo(mockPurchaseResult.customerInfo);
      updateSubscriptionStatus(mockPurchaseResult.customerInfo);

      return mockPurchaseResult;
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  };

  const restorePurchases = async () => {
    try {
      console.log('Restoring purchases...');
      // Mock restore logic
      return customerInfo;
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  };

  const getCustomerInfo = async () => {
    try {
      // Mock getting fresh customer info
      return customerInfo;
    } catch (error) {
      console.error('Failed to get customer info:', error);
      throw error;
    }
  };

  return {
    isInitialized,
    offerings,
    customerInfo,
    purchasePackage,
    restorePurchases,
    getCustomerInfo
  };
};