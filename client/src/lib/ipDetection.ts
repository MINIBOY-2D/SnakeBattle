// IP detection utility with fallback to browser fingerprinting
export const getUserIP = async (): Promise<string> => {
  try {
    // Try multiple IP detection services for better reliability
    const services = [
      'https://api.ipify.org?format=json',
      'https://ipapi.co/json/',
      'https://httpbin.org/ip'
    ];
    
    for (const service of services) {
      try {
        const response = await fetch(service);
        const data = await response.json();
        
        // Different services return IP in different formats
        const ip = data.ip || data.origin || data.query;
        if (ip && typeof ip === 'string') {
          return ip;
        }
      } catch (error) {
        console.warn(`IP service ${service} failed:`, error);
        continue;
      }
    }
    
    // If all IP services fail, create browser fingerprint
    return createBrowserFingerprint();
  } catch (error) {
    console.error('Error getting IP:', error);
    return createBrowserFingerprint();
  }
};

// Create a unique browser fingerprint as fallback
const createBrowserFingerprint = (): string => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Browser fingerprint', 2, 2);
  }
  
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset(),
    ctx ? canvas.toDataURL() : 'no-canvas',
    navigator.hardwareConcurrency || 'unknown'
  ].join('|');
  
  // Create a simple hash
  let hash = 0;
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return `fingerprint_${Math.abs(hash).toString(36)}_${Date.now()}`;
};