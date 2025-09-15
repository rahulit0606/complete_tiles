// Domain configuration and utilities
export interface DomainConfig {
  domain: string;
  userType: 'customer' | 'seller' | 'admin';
  title: string;
  theme: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Domain configurations
export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  // Customer domain
  'customers': {
    domain: 'customers',
    userType: 'customer',
    title: 'Tile Showroom - Customer Portal',
    theme: {
      primary: '#2563eb', // Blue
      secondary: '#1e40af',
      accent: '#3b82f6'
    }
  },
  // Seller domain
  'seller': {
    domain: 'seller',
    userType: 'seller', 
    title: 'Tile Showroom - Seller Dashboard',
    theme: {
      primary: '#059669', // Green
      secondary: '#047857',
      accent: '#10b981'
    }
  },
  // Admin domain
  'admin': {
    domain: 'admin',
    userType: 'admin',
    title: 'Tile Showroom - Admin Panel',
    theme: {
      primary: '#7c3aed', // Purple
      secondary: '#6d28d9',
      accent: '#8b5cf6'
    }
  }
};

// Get current domain configuration
export const getCurrentDomainConfig = (): DomainConfig => {
  const hostname = window.location.hostname;
  
  // Extract subdomain
  const subdomain = hostname.split('.')[0];
  
  // For localhost development, check for port or subdomain patterns
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    const port = window.location.port;
    const path = window.location.pathname;
    
    // Check URL patterns for development
    if (path.startsWith('/seller') || port === '5174') {
      return DOMAIN_CONFIGS.seller;
    } else if (path.startsWith('/admin') || port === '5175') {
      return DOMAIN_CONFIGS.admin;
    } else {
      return DOMAIN_CONFIGS.customers;
    }
  }
  
  // Production domain mapping
  return DOMAIN_CONFIGS[subdomain] || DOMAIN_CONFIGS.customers;
};

// Check if user can access current domain
export const canAccessDomain = (userRole: string | null, domainConfig: DomainConfig): boolean => {
  if (!userRole) {
    // Guests can only access customer domain
    return domainConfig.userType === 'customer';
  }
  
  // Users can access their designated domain
  return userRole === domainConfig.userType;
};

// Redirect to appropriate domain
export const redirectToUserDomain = (userRole: string) => {
  const currentConfig = getCurrentDomainConfig();
  
  if (userRole !== currentConfig.userType) {
    const targetConfig = Object.values(DOMAIN_CONFIGS).find(config => config.userType === userRole);
    
    if (targetConfig) {
      // In development, use path-based routing
      if (window.location.hostname === 'localhost') {
        window.location.href = `${window.location.protocol}//${window.location.host}/${targetConfig.domain}`;
      } else {
        // In production, use subdomain routing
        const newHostname = window.location.hostname.replace(/^[^.]+/, targetConfig.domain);
        window.location.href = `${window.location.protocol}//${newHostname}${window.location.pathname}`;
      }
    }
  }
};

// Apply domain-specific theme
export const applyDomainTheme = (domainConfig: DomainConfig) => {
  const root = document.documentElement;
  root.style.setProperty('--primary-color', domainConfig.theme.primary);
  root.style.setProperty('--secondary-color', domainConfig.theme.secondary);
  root.style.setProperty('--accent-color', domainConfig.theme.accent);
  
  // Update page title
  document.title = domainConfig.title;
};