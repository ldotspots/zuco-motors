// Zuco Motors Utility Functions

const Utils = {
  // ====================
  // FORMATTING
  // ====================

  // Format currency
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  },

  // Format number with commas
  formatNumber(num) {
    return new Intl.NumberFormat('en-US').format(num);
  },

  // Format date
  formatDate(dateString, options = {}) {
    const date = new Date(dateString);
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    };
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(date);
  },

  // Format relative time (e.g., "2 days ago")
  formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  },

  // Format phone number
  formatPhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  },

  // ====================
  // PRICING CALCULATIONS
  // ====================

  // Calculate sale price from cost and markup
  calculateSalePrice(invoiceCost, markup) {
    return Math.round(invoiceCost * (1 + markup));
  },

  // Calculate net cost
  calculateNetCost(invoiceCost, holdback, incentives) {
    return invoiceCost - holdback - incentives;
  },

  // Calculate gross profit
  calculateGrossProfit(salePrice, netCost) {
    return salePrice - netCost;
  },

  // Calculate margin percentage
  calculateMarginPercent(grossProfit, salePrice) {
    return ((grossProfit / salePrice) * 100).toFixed(2);
  },

  // Calculate full vehicle pricing
  calculateVehiclePricing(vehicle) {
    const { invoiceCost, holdback, incentives, currentMarkup } = vehicle.pricing;
    const netCost = this.calculateNetCost(invoiceCost, holdback, incentives);
    const salePrice = this.calculateSalePrice(invoiceCost, currentMarkup);
    const grossProfit = this.calculateGrossProfit(salePrice, netCost);
    const marginPercent = this.calculateMarginPercent(grossProfit, salePrice);

    return {
      netCost,
      salePrice,
      grossProfit,
      marginPercent
    };
  },

  // Calculate monthly payment
  calculateMonthlyPayment(loanAmount, annualRate, months) {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return loanAmount / months;

    const payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(payment * 100) / 100;
  },

  // Calculate total interest
  calculateTotalInterest(monthlyPayment, months, loanAmount) {
    return (monthlyPayment * months) - loanAmount;
  },

  // ====================
  // FILTERS & SEARCH
  // ====================

  // Filter vehicles
  filterVehicles(vehicles, filters) {
    return vehicles.filter(vehicle => {
      // Make filter
      if (filters.make && filters.make !== 'all' && vehicle.make !== filters.make) {
        return false;
      }

      // Model filter
      if (filters.model && filters.model !== 'all' && vehicle.model !== filters.model) {
        return false;
      }

      // Year range
      if (filters.yearMin && vehicle.year < parseInt(filters.yearMin)) {
        return false;
      }
      if (filters.yearMax && vehicle.year > parseInt(filters.yearMax)) {
        return false;
      }

      // Price range
      if (filters.priceMin && vehicle.pricing.salePrice < parseInt(filters.priceMin)) {
        return false;
      }
      if (filters.priceMax && vehicle.pricing.salePrice > parseInt(filters.priceMax)) {
        return false;
      }

      // Mileage range
      if (filters.mileageMax && vehicle.mileage > parseInt(filters.mileageMax)) {
        return false;
      }

      // Body style
      if (filters.bodyStyle && filters.bodyStyle !== 'all' && vehicle.bodyStyle !== filters.bodyStyle) {
        return false;
      }

      // Fuel type
      if (filters.fuelType && filters.fuelType !== 'all' && vehicle.specs.fuelType !== filters.fuelType) {
        return false;
      }

      // Condition
      if (filters.condition && filters.condition !== 'all' && vehicle.condition !== filters.condition) {
        return false;
      }

      // Color
      if (filters.color && filters.color !== 'all' && vehicle.exteriorColor !== filters.color) {
        return false;
      }

      // Status
      if (filters.status && filters.status !== 'all' && vehicle.status !== filters.status) {
        return false;
      }

      // Search query
      if (filters.query) {
        const query = filters.query.toLowerCase();
        const searchString = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${vehicle.trim}`.toLowerCase();
        if (!searchString.includes(query)) {
          return false;
        }
      }

      return true;
    });
  },

  // Sort vehicles
  sortVehicles(vehicles, sortBy, sortOrder = 'asc') {
    const sorted = [...vehicles];

    sorted.sort((a, b) => {
      let aVal, bVal;

      switch (sortBy) {
        case 'price':
          aVal = a.pricing.salePrice;
          bVal = b.pricing.salePrice;
          break;
        case 'year':
          aVal = a.year;
          bVal = b.year;
          break;
        case 'mileage':
          aVal = a.mileage;
          bVal = b.mileage;
          break;
        case 'make':
          aVal = a.make;
          bVal = b.make;
          break;
        case 'added':
          aVal = new Date(a.addedDate);
          bVal = new Date(b.addedDate);
          break;
        case 'views':
          aVal = a.views || 0;
          bVal = b.views || 0;
          break;
        default:
          return 0;
      }

      if (typeof aVal === 'string') {
        return sortOrder === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    });

    return sorted;
  },

  // Get unique values for filters
  getUniqueValues(vehicles, key) {
    const values = new Set();
    vehicles.forEach(vehicle => {
      let value;
      if (key.includes('.')) {
        const parts = key.split('.');
        value = vehicle[parts[0]]?.[parts[1]];
      } else {
        value = vehicle[key];
      }
      if (value) values.add(value);
    });
    return Array.from(values).sort();
  },

  // ====================
  // DOM HELPERS
  // ====================

  // Create element with attributes
  createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);

    Object.keys(attributes).forEach(key => {
      if (key === 'className') {
        element.className = attributes[key];
      } else if (key === 'dataset') {
        Object.keys(attributes[key]).forEach(dataKey => {
          element.dataset[dataKey] = attributes[key][dataKey];
        });
      } else if (key.startsWith('on')) {
        element.addEventListener(key.substring(2).toLowerCase(), attributes[key]);
      } else {
        element.setAttribute(key, attributes[key]);
      }
    });

    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });

    return element;
  },

  // Show toast notification
  showToast(message, type = 'info', duration = 3000) {
    const toast = this.createElement('div', {
      className: `toast toast-${type}`,
      role: 'alert'
    }, [message]);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 300);
    }, duration);
  },

  // Show loading spinner
  showLoading(container) {
    const spinner = this.createElement('div', {
      className: 'loading-spinner'
    }, [
      this.createElement('div', { className: 'spinner' })
    ]);
    container.appendChild(spinner);
    return spinner;
  },

  // Hide loading spinner
  hideLoading(spinner) {
    if (spinner && spinner.parentNode) {
      spinner.remove();
    }
  },

  // ====================
  // URL & QUERY PARAMS
  // ====================

  // Get query parameters
  getQueryParams() {
    const params = {};
    const searchParams = new URLSearchParams(window.location.search);
    for (const [key, value] of searchParams) {
      params[key] = value;
    }
    return params;
  },

  // Set query parameters
  setQueryParams(params) {
    const url = new URL(window.location);
    Object.keys(params).forEach(key => {
      if (params[key] === null || params[key] === '' || params[key] === 'all') {
        url.searchParams.delete(key);
      } else {
        url.searchParams.set(key, params[key]);
      }
    });
    window.history.pushState({}, '', url);
  },

  // ====================
  // VALIDATION
  // ====================

  // Validate required fields
  validateRequired(fields) {
    const errors = {};
    Object.keys(fields).forEach(key => {
      if (!fields[key] || fields[key].toString().trim() === '') {
        errors[key] = `${key} is required`;
      }
    });
    return errors;
  },

  // Validate email
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  },

  // Validate phone
  validatePhone(phone) {
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10;
  },

  // Validate VIN
  validateVIN(vin) {
    return vin && vin.length === 17;
  },

  // ====================
  // LOCAL STORAGE
  // ====================

  // Save to local storage
  saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error saving to localStorage:', e);
      return false;
    }
  },

  // Get from local storage
  getFromStorage(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Error reading from localStorage:', e);
      return defaultValue;
    }
  },

  // Remove from local storage
  removeFromStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Error removing from localStorage:', e);
      return false;
    }
  },

  // ====================
  // FAVORITES (stored in localStorage for fast access)
  // ====================

  // Get favorites from localStorage
  getFavorites() {
    return this.getFromStorage('zuco_favorites', []);
  },

  // Toggle favorite
  toggleFavorite(vehicleId) {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(vehicleId);

    if (index > -1) {
      favorites.splice(index, 1);
      this.showToast('Removed from favorites', 'success');
    } else {
      favorites.push(vehicleId);
      this.showToast('Added to favorites', 'success');
    }

    this.saveToStorage('zuco_favorites', favorites);
    return index === -1; // Return true if added, false if removed
  },

  // Check if favorite
  isFavorite(vehicleId) {
    const favorites = this.getFavorites();
    return favorites.includes(vehicleId);
  },

  // ====================
  // COMPARISON
  // ====================

  // Get comparison list
  getComparisonList() {
    return this.getFromStorage('zuco_comparison', []);
  },

  // Add to comparison
  addToComparison(vehicleId) {
    const comparison = this.getComparisonList();

    if (comparison.includes(vehicleId)) {
      this.showToast('Already in comparison', 'warning');
      return false;
    }

    if (comparison.length >= 3) {
      this.showToast('Maximum 3 vehicles for comparison', 'warning');
      return false;
    }

    comparison.push(vehicleId);
    this.saveToStorage('zuco_comparison', comparison);
    this.showToast('Added to comparison', 'success');
    return true;
  },

  // Remove from comparison
  removeFromComparison(vehicleId) {
    const comparison = this.getComparisonList();
    const filtered = comparison.filter(id => id !== vehicleId);
    this.saveToStorage('zuco_comparison', filtered);
    this.showToast('Removed from comparison', 'success');
  },

  // Clear comparison
  clearComparison() {
    this.saveToStorage('zuco_comparison', []);
  },

  // ====================
  // ANALYTICS
  // ====================

  // Track vehicle view
  trackView(vehicleId) {
    const vehicle = DB.getVehicle(vehicleId);
    if (vehicle) {
      DB.updateVehicle(vehicleId, {
        views: (vehicle.views || 0) + 1
      });
    }
  },

  // Generate ID
  generateId(prefix = 'ID') {
    return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Truncate text
  truncate(text, length = 50) {
    if (text.length <= length) return text;
    return text.substring(0, length) + '...';
  },

  // Find next available test drive slot for a vehicle
  async findNextTestDriveSlot(vehicleId, date) {
    const testDrives = await DB.getTestDrivesByVehicle(vehicleId);
    const existing = testDrives
      .filter(td => td.date === date && td.status !== 'cancelled')
      .map(td => td.time);
    // Also block slots taken by viewings (a viewing at HH:00 blocks HH:00 and HH:30)
    const viewings = await DB.getViewingBookingsByVehicle(vehicleId);
    const viewingHours = viewings
      .filter(b => b.date === date && (b.status === 'pending' || b.status === 'approved'))
      .map(b => b.timeSlot);
    const slots = [];
    for (let h = 9; h < 18; h++) {
      const hourStr = `${String(h).padStart(2, '0')}:00`;
      const blocked = viewingHours.includes(hourStr);
      for (let m = 0; m < 60; m += 30) {
        const time = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        if (!existing.includes(time) && !blocked) slots.push(time);
      }
    }
    return slots;
  },

  // Find available viewing timeslots for a vehicle on a given date
  async findAvailableViewingSlots(vehicleId, date) {
    const viewings = await DB.getViewingBookingsByVehicle(vehicleId);
    const booked = viewings
      .filter(b => b.date === date && (b.status === 'pending' || b.status === 'approved'))
      .map(b => b.timeSlot);
    // Also block hours that have any test drive (HH:00 or HH:30)
    const testDrives = await DB.getTestDrivesByVehicle(vehicleId);
    const tdTimes = testDrives
      .filter(td => td.date === date && td.status !== 'cancelled')
      .map(td => td.time);
    const slots = [];
    for (let h = 9; h <= 16; h++) {
      const time = `${String(h).padStart(2, '0')}:00`;
      const halfHour = `${String(h).padStart(2, '0')}:30`;
      const blockedByTD = tdTimes.includes(time) || tdTimes.includes(halfHour);
      if (!booked.includes(time) && !blockedByTD) slots.push(time);
    }
    return slots;
  },

  // Sanitize HTML
  sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};
