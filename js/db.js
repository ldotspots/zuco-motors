// Zuco Motors Database - Supabase Integration
// Real-time data sync across all devices and portals

const DB = {
  // Company margin rate for sales agent pricing
  COMPANY_MARGIN_RATE: 0.89,

  // ====================
  // HELPER FUNCTIONS
  // ====================

  // Convert camelCase to snake_case for PostgreSQL
  toSnakeCase(obj) {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(item => this.toSnakeCase(item));
    if (typeof obj !== 'object') return obj;

    const converted = {};
    for (const key in obj) {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      converted[snakeKey] = this.toSnakeCase(obj[key]);
    }
    return converted;
  },

  // Convert snake_case to camelCase for JavaScript
  toCamelCase(obj) {
    if (obj === null || obj === undefined) return obj;
    if (Array.isArray(obj)) return obj.map(item => this.toCamelCase(item));
    if (typeof obj !== 'object') return obj;

    const converted = {};
    for (const key in obj) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      converted[camelKey] = this.toCamelCase(obj[key]);
    }
    return converted;
  },

  // Generate unique ID
  generateId(prefix = '') {
    return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
  },

  // ====================
  // USERS
  // ====================

  async getUsers() {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getUsers error:', error); return []; }
    return data.map(u => this.toCamelCase(u));
  },

  async getUser(id) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async getUserByEmail(email) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .ilike('email', email)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async addUser(user) {
    const { data, error } = await supabaseClient
      .from('users')
      .insert([this.toSnakeCase(user)])
      .select()
      .single();
    if (error) { console.error('addUser error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateUser(id, updates) {
    const { data, error } = await supabaseClient
      .from('users')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateUser error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // VEHICLES
  // ====================

  async getVehicles() {
    const { data, error } = await supabaseClient
      .from('vehicles')
      .select('*')
      .order('added_date', { ascending: false });
    if (error) { console.error('getVehicles error:', error); return []; }
    return data.map(v => this.toCamelCase(v));
  },

  async getVehicle(id) {
    const { data, error } = await supabaseClient
      .from('vehicles')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async addVehicle(vehicle) {
    const { data, error } = await supabaseClient
      .from('vehicles')
      .insert([this.toSnakeCase(vehicle)])
      .select()
      .single();
    if (error) { console.error('addVehicle error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateVehicle(id, updates) {
    const { data, error } = await supabaseClient
      .from('vehicles')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateVehicle error:', error); return null; }
    return this.toCamelCase(data);
  },

  async deleteVehicle(id) {
    const { error } = await supabaseClient
      .from('vehicles')
      .delete()
      .eq('id', id);
    if (error) console.error('deleteVehicle error:', error);
  },

  // ====================
  // INQUIRIES
  // ====================

  async getInquiries() {
    const { data, error } = await supabaseClient
      .from('inquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getInquiries error:', error); return []; }
    return data.map(i => this.toCamelCase(i));
  },

  async getInquiry(id) {
    const { data, error } = await supabaseClient
      .from('inquiries')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async getInquiriesByBuyer(buyerId) {
    const { data, error } = await supabaseClient
      .from('inquiries')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(i => this.toCamelCase(i));
  },

  async getInquiriesByAgent(agentId) {
    const { data, error } = await supabaseClient
      .from('inquiries')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(i => this.toCamelCase(i));
  },

  async addInquiry(inquiry) {
    const { data, error } = await supabaseClient
      .from('inquiries')
      .insert([this.toSnakeCase(inquiry)])
      .select()
      .single();
    if (error) { console.error('addInquiry error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateInquiry(id, updates) {
    const { data, error } = await supabaseClient
      .from('inquiries')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateInquiry error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // TRANSACTIONS
  // ====================

  async getTransactions() {
    const { data, error } = await supabaseClient
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getTransactions error:', error); return []; }
    return data.map(t => this.toCamelCase(t));
  },

  async getTransaction(id) {
    const { data, error } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async getTransactionsByAgent(agentId) {
    const { data, error } = await supabaseClient
      .from('transactions')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(t => this.toCamelCase(t));
  },

  async addTransaction(transaction) {
    const { data, error } = await supabaseClient
      .from('transactions')
      .insert([this.toSnakeCase(transaction)])
      .select()
      .single();
    if (error) { console.error('addTransaction error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // AGENT ALLOCATIONS
  // ====================

  async getAgentAllocations() {
    const { data, error } = await supabaseClient
      .from('agent_allocations')
      .select('*')
      .order('allocated_at', { ascending: false });
    if (error) { console.error('getAgentAllocations error:', error); return []; }
    return data.map(a => this.toCamelCase(a));
  },

  async getAllocationsByVehicle(vehicleId) {
    const { data, error } = await supabaseClient
      .from('agent_allocations')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('allocated_at', { ascending: false });
    if (error) return [];
    return data.map(a => this.toCamelCase(a));
  },

  async getAllocationsByAgent(agentId) {
    const { data, error } = await supabaseClient
      .from('agent_allocations')
      .select('*')
      .eq('agent_id', agentId)
      .order('allocated_at', { ascending: false });
    if (error) return [];
    return data.map(a => this.toCamelCase(a));
  },

  async addAllocation(allocation) {
    const { data, error } = await supabaseClient
      .from('agent_allocations')
      .insert([this.toSnakeCase(allocation)])
      .select()
      .single();
    if (error) { console.error('addAllocation error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateAllocation(id, updates) {
    const { data, error } = await supabaseClient
      .from('agent_allocations')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateAllocation error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // TEST DRIVES
  // ====================

  async getTestDrives() {
    const { data, error } = await supabaseClient
      .from('test_drives')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getTestDrives error:', error); return []; }
    return data.map(td => this.toCamelCase(td));
  },

  async getTestDrivesByAgent(agentId) {
    const { data, error } = await supabaseClient
      .from('test_drives')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(td => this.toCamelCase(td));
  },

  async getTestDrivesByVehicle(vehicleId) {
    const { data, error } = await supabaseClient
      .from('test_drives')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(td => this.toCamelCase(td));
  },

  async addTestDrive(testDrive) {
    const { data, error } = await supabaseClient
      .from('test_drives')
      .insert([this.toSnakeCase(testDrive)])
      .select()
      .single();
    if (error) { console.error('addTestDrive error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateTestDrive(id, updates) {
    const { data, error } = await supabaseClient
      .from('test_drives')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateTestDrive error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // AGENT SALES
  // ====================

  async getAgentSales() {
    const { data, error } = await supabaseClient
      .from('agent_sales')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getAgentSales error:', error); return []; }
    return data.map(s => this.toCamelCase(s));
  },

  async getAgentSale(saleId) {
    const { data, error } = await supabaseClient
      .from('agent_sales')
      .select('*')
      .eq('id', saleId)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async getAgentSalesByAgent(agentId) {
    const { data, error } = await supabaseClient
      .from('agent_sales')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(s => this.toCamelCase(s));
  },

  async getAgentSalesByStatus(status) {
    const { data, error } = await supabaseClient
      .from('agent_sales')
      .select('*')
      .eq('status', status)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(s => this.toCamelCase(s));
  },

  async addAgentSale(sale) {
    const { data, error } = await supabaseClient
      .from('agent_sales')
      .insert([this.toSnakeCase(sale)])
      .select()
      .single();
    if (error) { console.error('addAgentSale error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateAgentSale(saleId, updates) {
    const { data, error } = await supabaseClient
      .from('agent_sales')
      .update(this.toSnakeCase(updates))
      .eq('id', saleId)
      .select()
      .single();
    if (error) { console.error('updateAgentSale error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // VIEWING BOOKINGS
  // ====================

  async getViewingBookings() {
    const { data, error } = await supabaseClient
      .from('viewing_bookings')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getViewingBookings error:', error); return []; }
    return data.map(b => this.toCamelCase(b));
  },

  async getViewingBooking(id) {
    const { data, error } = await supabaseClient
      .from('viewing_bookings')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async getViewingBookingsByVehicle(vehicleId) {
    const { data, error } = await supabaseClient
      .from('viewing_bookings')
      .select('*')
      .eq('vehicle_id', vehicleId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(b => this.toCamelCase(b));
  },

  async getViewingBookingsByAgent(agentId) {
    const { data, error } = await supabaseClient
      .from('viewing_bookings')
      .select('*')
      .eq('agent_id', agentId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(b => this.toCamelCase(b));
  },

  async addViewingBooking(booking) {
    const { data, error } = await supabaseClient
      .from('viewing_bookings')
      .insert([this.toSnakeCase(booking)])
      .select()
      .single();
    if (error) { console.error('addViewingBooking error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateViewingBooking(id, updates) {
    const { data, error } = await supabaseClient
      .from('viewing_bookings')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateViewingBooking error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // QUOTE REQUESTS
  // ====================

  async getQuoteRequests() {
    const { data, error } = await supabaseClient
      .from('quote_requests')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getQuoteRequests error:', error); return []; }
    return data.map(q => this.toCamelCase(q));
  },

  async getQuoteRequest(id) {
    const { data, error } = await supabaseClient
      .from('quote_requests')
      .select('*')
      .eq('id', id)
      .single();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async addQuoteRequest(quote) {
    const { data, error } = await supabaseClient
      .from('quote_requests')
      .insert([this.toSnakeCase(quote)])
      .select()
      .single();
    if (error) { console.error('addQuoteRequest error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateQuoteRequest(id, updates) {
    const { data, error } = await supabaseClient
      .from('quote_requests')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateQuoteRequest error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // AGENT APPLICATIONS
  // ====================

  async getAgentApplications() {
    const { data, error } = await supabaseClient
      .from('agent_applications')
      .select('*')
      .order('applied_at', { ascending: false });
    if (error) { console.error('getAgentApplications error:', error); return []; }
    return data.map(a => this.toCamelCase(a));
  },

  async getAgentApplicationByUserId(userId) {
    const { data, error } = await supabaseClient
      .from('agent_applications')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    if (error) return null;
    return this.toCamelCase(data);
  },

  async addAgentApplication(app) {
    const { data, error } = await supabaseClient
      .from('agent_applications')
      .insert([this.toSnakeCase(app)])
      .select()
      .single();
    if (error) { console.error('addAgentApplication error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateAgentApplication(id, updates) {
    const { data, error } = await supabaseClient
      .from('agent_applications')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateAgentApplication error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // FINANCING APPLICATIONS
  // ====================

  async getFinancingApplications() {
    const { data, error } = await supabaseClient
      .from('financing_applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { console.error('getFinancingApplications error:', error); return []; }
    return data.map(a => this.toCamelCase(a));
  },

  async getFinancingApplicationsByUser(userId) {
    const { data, error } = await supabaseClient
      .from('financing_applications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) return [];
    return data.map(a => this.toCamelCase(a));
  },

  async addFinancingApplication(app) {
    const { data, error } = await supabaseClient
      .from('financing_applications')
      .insert([this.toSnakeCase(app)])
      .select()
      .single();
    if (error) { console.error('addFinancingApplication error:', error); return null; }
    return this.toCamelCase(data);
  },

  async updateFinancingApplication(id, updates) {
    const { data, error } = await supabaseClient
      .from('financing_applications')
      .update(this.toSnakeCase(updates))
      .eq('id', id)
      .select()
      .single();
    if (error) { console.error('updateFinancingApplication error:', error); return null; }
    return this.toCamelCase(data);
  },

  // ====================
  // AGENT PRICING (computed)
  // ====================

  async getAgentVehiclePricing(vehicleId) {
    const vehicle = await this.getVehicle(vehicleId);
    if (!vehicle) return null;
    const invoiceCost = vehicle.pricing.invoiceCost;
    const salePrice = vehicle.pricing.salePrice;
    const grossSpread = salePrice - invoiceCost;
    const companyMargin = Math.round(grossSpread * this.COMPANY_MARGIN_RATE);
    const agentCostPrice = invoiceCost + companyMargin;
    const profitRoom = salePrice - agentCostPrice;
    return { agentCostPrice, salePrice, profitRoom };
  },

  // ====================
  // REAL-TIME SUBSCRIPTIONS
  // ====================

  subscribeToVehicles(callback) {
    return supabaseClient
      .channel('vehicles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, callback)
      .subscribe();
  },

  subscribeToInquiries(callback) {
    return supabaseClient
      .channel('inquiries-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'inquiries' }, callback)
      .subscribe();
  },

  subscribeToQuoteRequests(callback) {
    return supabaseClient
      .channel('quote-requests-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'quote_requests' }, callback)
      .subscribe();
  },

  subscribeToAllocations(callback) {
    return supabaseClient
      .channel('allocations-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_allocations' }, callback)
      .subscribe();
  },

  subscribeToAgentSales(callback) {
    return supabaseClient
      .channel('agent-sales-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'agent_sales' }, callback)
      .subscribe();
  },

  subscribeToTestDrives(callback) {
    return supabaseClient
      .channel('test-drives-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'test_drives' }, callback)
      .subscribe();
  },

  subscribeToViewingBookings(callback) {
    return supabaseClient
      .channel('viewing-bookings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'viewing_bookings' }, callback)
      .subscribe();
  },

  // Unsubscribe from a channel
  unsubscribe(subscription) {
    if (subscription) {
      supabaseClient.removeChannel(subscription);
    }
  }
};
