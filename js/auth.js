// Zuco Motors Authentication System

const Auth = {
  // Session storage keys (per-portal so multiple logins can coexist)
  SESSION_KEYS: {
    buyer: 'zuco_session_buyer',
    dealer: 'zuco_session_dealer',
    sales_agent: 'zuco_session_agent'
  },
  REMEMBER_KEY: 'zuco_remember',

  // Get the session key for the current portal based on URL
  getSessionKey() {
    const path = window.location.pathname;
    if (path.includes('/sales-portal/')) return this.SESSION_KEYS.sales_agent;
    if (path.includes('/dealer-portal/')) return this.SESSION_KEYS.dealer;
    return this.SESSION_KEYS.buyer;
  },

  // Login function
  login(email, password, rememberMe = false) {
    const user = DB.getUserByEmail(email);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // In production, passwords would be hashed. For demo, compare directly
    if (user.password !== password) {
      return { success: false, error: 'Invalid password' };
    }

    // Update last login
    DB.updateUser(user.id, { lastLogin: new Date().toISOString() });

    // Create session
    const session = {
      userId: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      expiresAt: this.getExpiryTime(rememberMe),
      createdAt: new Date().toISOString()
    };

    // Store session under role-specific key
    const sessionKey = this.SESSION_KEYS[user.role] || this.getSessionKey();
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(sessionKey, JSON.stringify(session));

    if (rememberMe) {
      localStorage.setItem(this.REMEMBER_KEY, 'true');
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  },

  // Register new user
  register(userData) {
    // Check if email already exists
    const existing = DB.getUserByEmail(userData.email);
    if (existing) {
      return { success: false, error: 'Email already registered' };
    }

    // Create new user
    const newUser = {
      id: this.generateUserId(userData.role),
      email: userData.email,
      password: userData.password, // In production, would be hashed
      role: userData.role || 'buyer',
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone || '',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      profile: {
        address: userData.address || '',
        preferredContact: 'email',
        savedSearches: [],
        favorites: [],
        notificationPrefs: { email: true, sms: false }
      }
    };

    // Add dealer-specific fields if applicable
    if (userData.role === 'dealer') {
      newUser.employeeId = userData.employeeId;
      newUser.commissionRate = 0.03;
      newUser.profile = {
        department: 'Sales',
        supervisor: 'Robert Chen',
        salesTarget: 150000,
        ytdSales: 0
      };
    }

    DB.addUser(newUser);

    return { success: true, user: newUser };
  },

  // Logout function
  logout() {
    const key = this.getSessionKey();
    sessionStorage.removeItem(key);
    localStorage.removeItem(key);
    localStorage.removeItem(this.REMEMBER_KEY);
    window.location.href = '/';
  },

  // Check if user is authenticated
  isAuthenticated() {
    const session = this.getSession();

    if (!session) {
      return false;
    }

    // Check if session has expired
    if (new Date(session.expiresAt) < new Date()) {
      this.logout();
      return false;
    }

    return true;
  },

  // Get current session
  getSession() {
    const key = this.getSessionKey();
    // Check sessionStorage first
    let sessionData = sessionStorage.getItem(key);

    // If not in sessionStorage, check localStorage
    if (!sessionData) {
      sessionData = localStorage.getItem(key);
    }

    // Fallback: check all session keys (for root pages like index.html)
    if (!sessionData) {
      for (const k of Object.values(this.SESSION_KEYS)) {
        sessionData = sessionStorage.getItem(k) || localStorage.getItem(k);
        if (sessionData) break;
      }
    }

    if (!sessionData) {
      return null;
    }

    try {
      return JSON.parse(sessionData);
    } catch (e) {
      return null;
    }
  },

  // Get current user details
  getCurrentUser() {
    const session = this.getSession();
    if (!session) {
      return null;
    }

    const user = DB.getUser(session.userId);
    return user;
  },

  // Check if user has specific role
  hasRole(requiredRole) {
    const session = this.getSession();
    if (!session) {
      return false;
    }

    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(session.role);
    }

    return session.role === requiredRole;
  },

  // Require authentication (use on page load)
  requireAuth(requiredRole = null) {
    if (!this.isAuthenticated()) {
      // Store intended destination
      sessionStorage.setItem('zuco_redirect', window.location.pathname);
      window.location.href = this.getLoginPath();
      return false;
    }

    // Check role if specified
    if (requiredRole && !this.hasRole(requiredRole)) {
      window.location.href = this.getUnauthorizedPath();
      return false;
    }

    return true;
  },

  // Get login path based on current location
  getLoginPath() {
    const path = window.location.pathname;
    if (path.includes('/dealer-portal/')) {
      return '/dealer-portal/login.html';
    }
    if (path.includes('/sales-portal/')) {
      return '/sales-portal/login.html';
    }
    return '/buyer-portal/login.html';
  },

  // Get unauthorized path
  getUnauthorizedPath() {
    return '/';
  },

  // Redirect after login
  redirectAfterLogin() {
    const session = this.getSession();
    if (!session) {
      return;
    }

    // Check for stored redirect
    const redirect = sessionStorage.getItem('zuco_redirect');
    if (redirect) {
      sessionStorage.removeItem('zuco_redirect');
      window.location.href = redirect;
      return;
    }

    // Default redirects based on role
    if (session.role === 'dealer') {
      window.location.href = '/dealer-portal/index.html';
    } else if (session.role === 'sales_agent') {
      window.location.href = '/sales-portal/index.html';
    } else if (session.role === 'buyer') {
      window.location.href = '/buyer-portal/index.html';
    } else {
      window.location.href = '/';
    }
  },

  // Generate user ID
  generateUserId(role) {
    const prefix = role === 'dealer' ? 'DLR' : role === 'sales_agent' ? 'AGT' : 'USR';
    const users = DB.getUsers();
    const existingIds = users
      .filter(u => u.id.startsWith(prefix))
      .map(u => parseInt(u.id.substring(3)))
      .filter(n => !isNaN(n));

    const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;
    return `${prefix}${String(nextId).padStart(3, '0')}`;
  },

  // Get expiry time
  getExpiryTime(rememberMe) {
    const now = new Date();
    if (rememberMe) {
      // 30 days
      now.setDate(now.getDate() + 30);
    } else {
      // 8 hours
      now.setHours(now.getHours() + 8);
    }
    return now.toISOString();
  },

  // Update password
  updatePassword(currentPassword, newPassword) {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (user.password !== currentPassword) {
      return { success: false, error: 'Current password is incorrect' };
    }

    DB.updateUser(user.id, { password: newPassword });
    return { success: true };
  },

  // Update profile
  updateProfile(updates) {
    const user = this.getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated' };
    }

    const updatedUser = DB.updateUser(user.id, updates);

    // Update session if name changed
    if (updates.firstName || updates.lastName) {
      const session = this.getSession();
      if (session) {
        session.firstName = updates.firstName || session.firstName;
        session.lastName = updates.lastName || session.lastName;

        const storage = localStorage.getItem(this.REMEMBER_KEY) ? localStorage : sessionStorage;
        storage.setItem(this.getSessionKey(), JSON.stringify(session));
      }
    }

    return { success: true, user: updatedUser };
  },

  // Validate email format
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate password strength
  validatePassword(password) {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);

    return {
      valid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      checks: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
      }
    };
  }
};

// Check authentication on protected pages
document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;

  // Pages that require authentication
  const protectedPages = [
    '/buyer-portal/',
    '/dealer-portal/',
    '/sales-portal/'
  ];

  // Login pages
  const loginPages = [
    '/buyer-portal/login.html',
    '/dealer-portal/login.html',
    '/sales-portal/login.html'
  ];

  // Check if current page is protected
  const isProtected = protectedPages.some(p => path.includes(p));
  const isLoginPage = loginPages.some(p => path.includes(p));

  // Buyer portal pages that are publicly accessible (no login required)
  const buyerPublicPages = [
    '/buyer-portal/inventory.html',
    '/buyer-portal/vehicle-details.html',
    '/buyer-portal/financing.html',
    '/buyer-portal/compare.html'
  ];
  const isBuyerPublic = buyerPublicPages.some(p => path.includes(p));

  if (isProtected && !isLoginPage && !isBuyerPublic) {
    // Determine required role
    let requiredRole = null;
    if (path.includes('/dealer-portal/')) {
      requiredRole = 'dealer';
    } else if (path.includes('/sales-portal/')) {
      requiredRole = 'sales_agent';
    } else if (path.includes('/buyer-portal/')) {
      requiredRole = 'buyer';
    }

    Auth.requireAuth(requiredRole);
  }

  // If already logged in and on login page, redirect to dashboard
  if (isLoginPage && Auth.isAuthenticated()) {
    Auth.redirectAfterLogin();
  }
});
