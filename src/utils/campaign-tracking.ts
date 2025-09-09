export interface CampaignData {
  campaign_id?: string;
  site_source_name?: string;
  ad_id?: string;
  adset_id?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_event_source?: string; // Note: keeping the typo as requested
  source?: string;
}

const CAMPAIGN_STORAGE_KEY = 'campaign_data';

/**
 * Extract campaign parameters from URL search params
 */
export function extractCampaignParams(searchParams: URLSearchParams): CampaignData {
  const campaignData: CampaignData = {};
  
  const paramKeys: (keyof CampaignData)[] = [
    'campaign_id',
    'site_source_name', 
    'ad_id',
    'adset_id',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_event_source',
    'source'
  ];

  paramKeys.forEach(key => {
    const value = searchParams.get(key);
    if (value) {
      campaignData[key] = value;
    }
  });

  // Set default source if no source parameters are present
  if (!campaignData.source) {
    campaignData.source = 'paid';
  }

  return campaignData;
}

/**
 * Clear campaign data from localStorage and store new data
 */
export function storeCampaignData(campaignData: CampaignData): void {
  if (typeof window === 'undefined') return;
  
  // Clear existing data
  localStorage.removeItem(CAMPAIGN_STORAGE_KEY);
  
  // Store new data only if there are parameters
  if (Object.keys(campaignData).length > 0) {
    localStorage.setItem(CAMPAIGN_STORAGE_KEY, JSON.stringify(campaignData));
  }
}

/**
 * Get campaign data from localStorage
 */
export function getCampaignData(): CampaignData | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(CAMPAIGN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error('Error parsing campaign data from localStorage:', error);
    return null;
  }
}

/**
 * Process URL parameters and store them in localStorage
 * Should be called on every route/page load
 */
export function processCampaignParams(): CampaignData | null {
  if (typeof window === 'undefined') return null;
  
  const searchParams = new URLSearchParams(window.location.search);
  const campaignData = extractCampaignParams(searchParams);
  
  // Always clear and store (even if empty) on every refresh
  storeCampaignData(campaignData);
  
  return Object.keys(campaignData).length > 0 ? campaignData : null;
}