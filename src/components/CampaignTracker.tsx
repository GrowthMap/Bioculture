'use client';

import { useEffect } from 'react';
import { processCampaignParams } from '@/utils/campaign-tracking';

/**
 * Component that tracks campaign parameters from URL and stores them in localStorage
 * Runs on every page load/refresh to capture and store campaign data
 */
export default function CampaignTracker() {
  useEffect(() => {
    // Process campaign parameters on component mount (page load/refresh)
    const campaignData = processCampaignParams();
    
    if (campaignData) {
      console.log('Campaign data captured and stored:', campaignData);
    }
  }, []);

  // This component doesn't render anything visible
  return null;
}