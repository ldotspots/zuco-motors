// Zuco Motors Database Simulation
// This module simulates a database using localStorage for persistence

const DB = {
  // Company margin rate for sales agent pricing
  COMPANY_MARGIN_RATE: 0.89,

  // Database schema version — bump to force re-seed
  DB_VERSION: '8',

  // Initialize database
  init() {
    if (localStorage.getItem('zuco_db_version') !== this.DB_VERSION) {
      this.seedDatabase();
      localStorage.setItem('zuco_initialized', 'true');
      localStorage.setItem('zuco_db_version', this.DB_VERSION);
    }
    // Ensure viewing bookings key exists (may be missing from older DB versions)
    if (!localStorage.getItem('zuco_viewing_bookings')) {
      localStorage.setItem('zuco_viewing_bookings', JSON.stringify([]));
    }
  },

  // Seed database with initial data
  seedDatabase() {
    localStorage.setItem('zuco_users', JSON.stringify(this.getInitialUsers()));
    localStorage.setItem('zuco_vehicles', JSON.stringify(this.getInitialVehicles()));
    localStorage.setItem('zuco_inquiries', JSON.stringify(this.getInitialInquiries()));
    localStorage.setItem('zuco_transactions', JSON.stringify(this.getInitialTransactions()));
    localStorage.setItem('zuco_agent_allocations', JSON.stringify(this.getInitialAllocations()));
    localStorage.setItem('zuco_test_drives', JSON.stringify(this.getInitialTestDrives()));
    localStorage.setItem('zuco_agent_sales', JSON.stringify([]));
    localStorage.setItem('zuco_viewing_bookings', JSON.stringify([]));
  },

  // Reset database to initial state
  reset() {
    localStorage.removeItem('zuco_initialized');
    localStorage.removeItem('zuco_db_version');
    this.init();
  },

  // ====================
  // USERS
  // ====================

  getInitialUsers() {
    return [
      // Buyers
      {
        id: "USR001",
        email: "john.buyer@email.com",
        password: "Demo123!", // In production, this would be hashed
        role: "buyer",
        firstName: "John",
        lastName: "Smith",
        phone: "555-123-4567",
        createdAt: "2024-01-15T10:30:00Z",
        lastLogin: "2024-02-01T14:22:00Z",
        profile: {
          address: "123 Main St, Austin, TX 78701",
          preferredContact: "email",
          savedSearches: [],
          favorites: [],
          notificationPrefs: { email: true, sms: false }
        }
      },
      {
        id: "USR002",
        email: "sarah.buyer@email.com",
        password: "Demo123!",
        role: "buyer",
        firstName: "Sarah",
        lastName: "Wilson",
        phone: "555-234-5678",
        createdAt: "2024-01-20T09:15:00Z",
        lastLogin: "2024-02-01T16:30:00Z",
        profile: {
          address: "456 Oak Ave, Dallas, TX 75201",
          preferredContact: "phone",
          savedSearches: [],
          favorites: ["VEH002", "VEH005"],
          notificationPrefs: { email: true, sms: true }
        }
      },
      {
        id: "USR003",
        email: "mike.customer@email.com",
        password: "Demo123!",
        role: "buyer",
        firstName: "Mike",
        lastName: "Johnson",
        phone: "555-345-6789",
        createdAt: "2024-01-25T14:45:00Z",
        lastLogin: "2024-01-31T11:20:00Z",
        profile: {
          address: "789 Pine Dr, Houston, TX 77001",
          preferredContact: "email",
          savedSearches: [],
          favorites: ["VEH001"],
          notificationPrefs: { email: true, sms: false }
        }
      },
      {
        id: "USR004",
        email: "emily.chen@email.com",
        password: "Demo123!",
        role: "buyer",
        firstName: "Emily",
        lastName: "Chen",
        phone: "555-456-7890",
        createdAt: "2023-12-10T08:00:00Z",
        lastLogin: "2024-02-01T10:15:00Z",
        profile: {
          address: "321 Elm St, San Antonio, TX 78201",
          preferredContact: "email",
          savedSearches: [{make: "Honda", model: "Civic"}],
          favorites: ["VEH010", "VEH015"],
          notificationPrefs: { email: true, sms: true }
        }
      },
      {
        id: "USR005",
        email: "david.brown@email.com",
        password: "Demo123!",
        role: "buyer",
        firstName: "David",
        lastName: "Brown",
        phone: "555-567-8901",
        createdAt: "2024-01-05T13:30:00Z",
        lastLogin: "2024-01-30T15:45:00Z",
        profile: {
          address: "654 Maple Rd, Fort Worth, TX 76101",
          preferredContact: "phone",
          savedSearches: [],
          favorites: [],
          notificationPrefs: { email: false, sms: true }
        }
      },
      // Additional buyers (20 more to reach 25 total)
      ...Array.from({length: 20}, (_, i) => ({
        id: `USR${String(i + 6).padStart(3, '0')}`,
        email: `buyer${i + 6}@email.com`,
        password: "Demo123!",
        role: "buyer",
        firstName: ["Alex", "Jordan", "Taylor", "Morgan", "Casey", "Riley", "Jamie", "Quinn", "Blake", "Drew", "Avery", "Skylar", "Reese", "Dakota", "Sage", "River", "Phoenix", "Rowan", "Parker", "Bailey"][i % 20],
        lastName: ["Anderson", "Taylor", "Martinez", "Garcia", "Rodriguez", "Lee", "Walker", "Hall", "Allen", "Young", "King", "Wright", "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Nelson", "Carter"][i % 20],
        phone: `555-${String(678 + i).padStart(3, '0')}-${String(9012 + i * 11).slice(-4)}`,
        createdAt: new Date(2023, 11 + (i % 2), 15 + i).toISOString(),
        lastLogin: new Date(2024, 0, 25 + (i % 5)).toISOString(),
        profile: {
          address: `${100 + i * 50} Street ${i + 1}, Texas ${78000 + i}`,
          preferredContact: i % 2 === 0 ? "email" : "phone",
          savedSearches: [],
          favorites: [],
          notificationPrefs: { email: true, sms: i % 2 === 0 }
        }
      })),

      // Dealers/Agents
      {
        id: "DLR001",
        email: "agent1@zucomotors.com",
        password: "Dealer123!",
        role: "dealer",
        firstName: "Alex",
        lastName: "Thompson",
        phone: "555-987-6543",
        employeeId: "ZM-001",
        commissionRate: 0.03,
        createdAt: "2023-01-01T08:00:00Z",
        lastLogin: "2024-02-01T09:15:00Z",
        profile: {
          department: "Sales",
          supervisor: "Robert Chen",
          salesTarget: 150000,
          ytdSales: 87500
        }
      },
      {
        id: "DLR002",
        email: "agent2@zucomotors.com",
        password: "Dealer123!",
        role: "dealer",
        firstName: "Jessica",
        lastName: "Martinez",
        phone: "555-876-5432",
        employeeId: "ZM-002",
        commissionRate: 0.03,
        createdAt: "2023-02-01T08:00:00Z",
        lastLogin: "2024-02-01T08:45:00Z",
        profile: {
          department: "Sales",
          supervisor: "Robert Chen",
          salesTarget: 150000,
          ytdSales: 92000
        }
      },
      {
        id: "DLR003",
        email: "manager@zucomotors.com",
        password: "Admin123!",
        role: "dealer",
        firstName: "Robert",
        lastName: "Chen",
        phone: "555-765-4321",
        employeeId: "ZM-MGR-001",
        commissionRate: 0.05,
        createdAt: "2022-01-01T08:00:00Z",
        lastLogin: "2024-02-01T07:30:00Z",
        profile: {
          department: "Sales",
          supervisor: "CEO",
          salesTarget: 500000,
          ytdSales: 320000
        }
      },
      // Additional dealers (7 more to reach 10 total)
      ...Array.from({length: 7}, (_, i) => ({
        id: `DLR${String(i + 4).padStart(3, '0')}`,
        email: `agent${i + 4}@zucomotors.com`,
        password: "Dealer123!",
        role: "dealer",
        firstName: ["Marcus", "Linda", "Kevin", "Patricia", "Daniel", "Rachel", "Steven"][i],
        lastName: ["Williams", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson"][i],
        phone: `555-${String(654 - i * 10).padStart(3, '0')}-4321`,
        employeeId: `ZM-${String(i + 4).padStart(3, '0')}`,
        commissionRate: 0.03,
        createdAt: new Date(2023, i, 1, 8, 0, 0).toISOString(),
        lastLogin: new Date(2024, 1, 1, 8 + i, 0, 0).toISOString(),
        profile: {
          department: "Sales",
          supervisor: "Robert Chen",
          salesTarget: 150000,
          ytdSales: 50000 + i * 10000
        }
      })),

      // Sales Agents (independent salespeople)
      ...Array.from({length: 20}, (_, i) => ({
        id: `AGT${String(i + 1).padStart(3, '0')}`,
        email: `sagent${i + 1}@zucomotors.com`,
        password: "Agent123!",
        role: "sales_agent",
        firstName: ["Marcus","Linda","Kevin","Patricia","Daniel","Rachel","Steven","Nicole","Brandon","Tiffany","Chris","Amanda","Derek","Heather","Tyler","Melissa","Jason","Brittany","Ryan","Stephanie"][i],
        lastName: ["Rivera","Nguyen","Patel","Kim","Brooks","Foster","Hayes","Price","Ross","Perry","Long","Butler","Barnes","Coleman","Reed","Murphy","Bailey","Torres","Gray","Watson"][i],
        phone: `555-${String(300 + i).padStart(3, '0')}-${String(1000 + i * 37).slice(-4)}`,
        createdAt: new Date(2024, i % 12, 1 + i).toISOString(),
        lastLogin: new Date(2026, 0, 20 + (i % 10)).toISOString(),
        profile: {
          region: ["North","South","East","West"][i % 4],
          specialization: ["Sedans","SUVs","Trucks","Luxury","Electric"][i % 5],
          bio: "",
          salesTarget: 100000,
          ytdSales: 0
        }
      }))
    ];
  },

  // ====================
  // VEHICLES
  // ====================

  getInitialVehicles() {
    const vehicleTemplates = [
      // Luxury Sedans
      {
        make: "BMW", model: "5 Series", trim: "M550i xDrive", year: 2024, bodyStyle: "Sedan",
        specs: { engine: "4.4L Twin-Turbo V8", transmission: "8-Speed Automatic", drivetrain: "AWD", fuelType: "Gasoline", mpgCity: 17, mpgHighway: 25, horsepower: 523, torque: 553, seating: 5 },
        exteriorColor: "Black Sapphire", interiorColor: "Cognac Leather", condition: "New", mileage: 8,
        pricing: { invoiceCost: 72000, msrp: 82000, minMarkup: 0.05, maxMarkup: 0.15, currentMarkup: 0.10, holdback: 2100, incentives: 1000 },
        features: ["Panoramic Sunroof", "Harman Kardon Audio", "Gesture Control", "Head-Up Display", "Adaptive M Suspension"],
        status: "Available"
      },
      {
        make: "Mercedes-Benz", model: "E-Class", trim: "E 450 4MATIC", year: 2024, bodyStyle: "Sedan",
        specs: { engine: "3.0L Inline-6 Turbo", transmission: "9-Speed Automatic", drivetrain: "AWD", fuelType: "Gasoline", mpgCity: 22, mpgHighway: 30, horsepower: 362, torque: 369, seating: 5 },
        exteriorColor: "Polar White", interiorColor: "Black Leather", condition: "New", mileage: 15,
        pricing: { invoiceCost: 65000, msrp: 75000, minMarkup: 0.06, maxMarkup: 0.14, currentMarkup: 0.09, holdback: 1950, incentives: 1200 },
        features: ["MBUX Infotainment", "Burmester Sound", "Air Balance", "Multibeam LED", "Active Parking Assist"],
        status: "Available"
      },
      {
        make: "Audi", model: "A6", trim: "Premium Plus", year: 2024, bodyStyle: "Sedan",
        specs: { engine: "2.0L Turbo I4", transmission: "7-Speed Dual-Clutch", drivetrain: "AWD", fuelType: "Gasoline", mpgCity: 24, mpgHighway: 32, horsepower: 261, torque: 273, seating: 5 },
        exteriorColor: "Mythos Black", interiorColor: "Okapi Brown Leather", condition: "New", mileage: 10,
        pricing: { invoiceCost: 58000, msrp: 68000, minMarkup: 0.05, maxMarkup: 0.13, currentMarkup: 0.08, holdback: 1750, incentives: 1500 },
        features: ["Virtual Cockpit Plus", "Bang & Olufsen Sound", "Matrix LED Headlights", "Adaptive Cruise"],
        status: "Available"
      },

      // Popular Sedans
      {
        make: "Toyota", model: "Camry", trim: "XSE V6", year: 2024, bodyStyle: "Sedan",
        specs: { engine: "3.5L V6", transmission: "8-Speed Automatic", drivetrain: "FWD", fuelType: "Gasoline", mpgCity: 22, mpgHighway: 33, horsepower: 301, torque: 267, seating: 5 },
        exteriorColor: "Celestial Silver", interiorColor: "Black Leather", condition: "New", mileage: 12,
        pricing: { invoiceCost: 32500, msrp: 38500, minMarkup: 0.05, maxMarkup: 0.15, currentMarkup: 0.10, holdback: 975, incentives: 1500 },
        features: ["Panoramic Sunroof", "JBL Audio", "Wireless Charging", "Blind Spot Monitor", "Adaptive Cruise"],
        status: "Available"
      },
      {
        make: "Honda", model: "Accord", trim: "Sport", year: 2024, bodyStyle: "Sedan",
        specs: { engine: "1.5L Turbo I4", transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", mpgCity: 30, mpgHighway: 38, horsepower: 192, torque: 192, seating: 5 },
        exteriorColor: "Platinum White", interiorColor: "Black Cloth", condition: "New", mileage: 8,
        pricing: { invoiceCost: 28000, msrp: 32500, minMarkup: 0.06, maxMarkup: 0.14, currentMarkup: 0.09, holdback: 850, incentives: 1000 },
        features: ["Apple CarPlay", "Honda Sensing", "Dual-Zone Climate", "LED Headlights"],
        status: "Available"
      },
      {
        make: "Nissan", model: "Altima", trim: "SV", year: 2024, bodyStyle: "Sedan",
        specs: { engine: "2.5L I4", transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", mpgCity: 28, mpgHighway: 39, horsepower: 188, torque: 180, seating: 5 },
        exteriorColor: "Gun Metallic", interiorColor: "Charcoal Cloth", condition: "New", mileage: 20,
        pricing: { invoiceCost: 24500, msrp: 28000, minMarkup: 0.07, maxMarkup: 0.15, currentMarkup: 0.11, holdback: 750, incentives: 1200 },
        features: ["ProPILOT Assist", "8-inch Touchscreen", "Remote Start", "Safety Shield 360"],
        status: "Available"
      },

      // SUVs
      {
        make: "Tesla", model: "Model Y", trim: "Long Range", year: 2024, bodyStyle: "SUV",
        specs: { engine: "Dual Motor Electric", transmission: "Single-Speed", drivetrain: "AWD", fuelType: "Electric", mpgCity: 0, mpgHighway: 0, horsepower: 384, torque: 376, seating: 5 },
        exteriorColor: "Midnight Silver", interiorColor: "Black Interior", condition: "New", mileage: 5,
        pricing: { invoiceCost: 48000, msrp: 55000, minMarkup: 0.04, maxMarkup: 0.10, currentMarkup: 0.06, holdback: 0, incentives: 7500 },
        features: ["Autopilot", "Full Self-Driving Capable", "Premium Audio", "Glass Roof"],
        status: "Available"
      },
      {
        make: "Jeep", model: "Grand Cherokee", trim: "Limited", year: 2024, bodyStyle: "SUV",
        specs: { engine: "3.6L V6", transmission: "8-Speed Automatic", drivetrain: "4WD", fuelType: "Gasoline", mpgCity: 19, mpgHighway: 26, horsepower: 293, torque: 260, seating: 5 },
        exteriorColor: "Diamond Black", interiorColor: "Black Leather", condition: "New", mileage: 18,
        pricing: { invoiceCost: 45000, msrp: 52000, minMarkup: 0.06, maxMarkup: 0.14, currentMarkup: 0.09, holdback: 1400, incentives: 2000 },
        features: ["Uconnect 5", "Alpine Audio", "Quadra-Lift Suspension", "Panoramic Sunroof"],
        status: "Available"
      },
      {
        make: "Ford", model: "Explorer", trim: "XLT", year: 2024, bodyStyle: "SUV",
        specs: { engine: "2.3L EcoBoost I4", transmission: "10-Speed Automatic", drivetrain: "RWD", fuelType: "Gasoline", mpgCity: 21, mpgHighway: 28, horsepower: 300, torque: 310, seating: 7 },
        exteriorColor: "Oxford White", interiorColor: "Ebony Cloth", condition: "New", mileage: 25,
        pricing: { invoiceCost: 38000, msrp: 44000, minMarkup: 0.05, maxMarkup: 0.13, currentMarkup: 0.08, holdback: 1150, incentives: 1500 },
        features: ["SYNC 4", "Co-Pilot360", "Hands-Free Liftgate", "Third Row Seating"],
        status: "Available"
      },
      {
        make: "Chevrolet", model: "Tahoe", trim: "LT", year: 2024, bodyStyle: "SUV",
        specs: { engine: "5.3L V8", transmission: "10-Speed Automatic", drivetrain: "4WD", fuelType: "Gasoline", mpgCity: 16, mpgHighway: 20, horsepower: 355, torque: 383, seating: 8 },
        exteriorColor: "Silver Ice", interiorColor: "Jet Black Leather", condition: "New", mileage: 30,
        pricing: { invoiceCost: 55000, msrp: 63000, minMarkup: 0.06, maxMarkup: 0.14, currentMarkup: 0.10, holdback: 1650, incentives: 2500 },
        features: ["Magnetic Ride Control", "Bose Audio", "Rear Entertainment", "Power Liftgate"],
        status: "Available"
      },

      // Trucks
      {
        make: "Ford", model: "F-150", trim: "Lariat", year: 2024, bodyStyle: "Truck",
        specs: { engine: "3.5L EcoBoost V6", transmission: "10-Speed Automatic", drivetrain: "4WD", fuelType: "Gasoline", mpgCity: 18, mpgHighway: 24, horsepower: 400, torque: 500, seating: 5 },
        exteriorColor: "Antimatter Blue", interiorColor: "Black Leather", condition: "New", mileage: 15,
        pricing: { invoiceCost: 52000, msrp: 60000, minMarkup: 0.07, maxMarkup: 0.15, currentMarkup: 0.11, holdback: 1600, incentives: 2000 },
        features: ["Pro Power Onboard", "360-Degree Camera", "B&O Sound", "Max Trailer Tow"],
        status: "Available"
      },
      {
        make: "Chevrolet", model: "Silverado 1500", trim: "LTZ", year: 2024, bodyStyle: "Truck",
        specs: { engine: "5.3L V8", transmission: "10-Speed Automatic", drivetrain: "4WD", fuelType: "Gasoline", mpgCity: 16, mpgHighway: 20, horsepower: 355, torque: 383, seating: 6 },
        exteriorColor: "Black", interiorColor: "Jet Black Leather", condition: "New", mileage: 12,
        pricing: { invoiceCost: 50000, msrp: 58000, minMarkup: 0.06, maxMarkup: 0.14, currentMarkup: 0.10, holdback: 1500, incentives: 1800 },
        features: ["Magnetic Ride", "Bose Audio", "Bed Liner", "Trailering Package"],
        status: "Available"
      },
      {
        make: "Ram", model: "1500", trim: "Big Horn", year: 2024, bodyStyle: "Truck",
        specs: { engine: "5.7L HEMI V8", transmission: "8-Speed Automatic", drivetrain: "4WD", fuelType: "Gasoline", mpgCity: 15, mpgHighway: 22, horsepower: 395, torque: 410, seating: 6 },
        exteriorColor: "Patriot Blue", interiorColor: "Black/Diesel Gray", condition: "New", mileage: 20,
        pricing: { invoiceCost: 48000, msrp: 56000, minMarkup: 0.07, maxMarkup: 0.15, currentMarkup: 0.11, holdback: 1450, incentives: 2200 },
        features: ["Uconnect 5", "Harman Kardon", "RamBox Storage", "Air Suspension"],
        status: "Available"
      },

      // Sports Cars
      {
        make: "Chevrolet", model: "Corvette", trim: "Stingray", year: 2024, bodyStyle: "Coupe",
        specs: { engine: "6.2L V8", transmission: "8-Speed Dual-Clutch", drivetrain: "RWD", fuelType: "Gasoline", mpgCity: 15, mpgHighway: 27, horsepower: 490, torque: 465, seating: 2 },
        exteriorColor: "Torch Red", interiorColor: "Adrenaline Red", condition: "New", mileage: 5,
        pricing: { invoiceCost: 65000, msrp: 75000, minMarkup: 0.08, maxMarkup: 0.18, currentMarkup: 0.13, holdback: 1950, incentives: 0 },
        features: ["Performance Exhaust", "Magnetic Ride", "Head-Up Display", "Performance Data Recorder"],
        status: "Available"
      },
      {
        make: "Porsche", model: "911", trim: "Carrera", year: 2024, bodyStyle: "Coupe",
        specs: { engine: "3.0L Twin-Turbo Flat-6", transmission: "8-Speed PDK", drivetrain: "RWD", fuelType: "Gasoline", mpgCity: 18, mpgHighway: 24, horsepower: 379, torque: 331, seating: 4 },
        exteriorColor: "GT Silver", interiorColor: "Black Leather", condition: "New", mileage: 3,
        pricing: { invoiceCost: 95000, msrp: 115000, minMarkup: 0.06, maxMarkup: 0.12, currentMarkup: 0.08, holdback: 2850, incentives: 0 },
        features: ["Sport Chrono", "Bose Surround", "Active Suspension", "Sport Exhaust"],
        status: "Available"
      },

      // Electric Vehicles
      {
        make: "Rivian", model: "R1T", trim: "Adventure", year: 2024, bodyStyle: "Truck",
        specs: { engine: "Quad Motor Electric", transmission: "Single-Speed", drivetrain: "AWD", fuelType: "Electric", mpgCity: 0, mpgHighway: 0, horsepower: 835, torque: 908, seating: 5 },
        exteriorColor: "Forest Green", interiorColor: "Black Mountain", condition: "New", mileage: 8,
        pricing: { invoiceCost: 72000, msrp: 82000, minMarkup: 0.05, maxMarkup: 0.10, currentMarkup: 0.07, holdback: 0, incentives: 7500 },
        features: ["Gear Tunnel", "Camp Kitchen", "Underbody Lighting", "Air Compressor"],
        status: "Available"
      },
      {
        make: "Lucid", model: "Air", trim: "Touring", year: 2024, bodyStyle: "Sedan",
        specs: { engine: "Dual Motor Electric", transmission: "Single-Speed", drivetrain: "AWD", fuelType: "Electric", mpgCity: 0, mpgHighway: 0, horsepower: 620, torque: 885, seating: 5 },
        exteriorColor: "Stellar White", interiorColor: "Mojave", condition: "New", mileage: 10,
        pricing: { invoiceCost: 85000, msrp: 98000, minMarkup: 0.04, maxMarkup: 0.09, currentMarkup: 0.06, holdback: 0, incentives: 7500 },
        features: ["Glass Canopy", "Surreal Sound", "DreamDrive Pro", "Massage Seats"],
        status: "Available"
      },

      // Certified Pre-Owned
      {
        make: "Lexus", model: "RX 350", trim: "Luxury", year: 2022, bodyStyle: "SUV",
        specs: { engine: "3.5L V6", transmission: "8-Speed Automatic", drivetrain: "AWD", fuelType: "Gasoline", mpgCity: 20, mpgHighway: 27, horsepower: 295, torque: 268, seating: 5 },
        exteriorColor: "Atomic Silver", interiorColor: "Black Leather", condition: "Certified Pre-Owned", mileage: 18500,
        pricing: { invoiceCost: 42000, msrp: 50000, minMarkup: 0.08, maxMarkup: 0.16, currentMarkup: 0.12, holdback: 1300, incentives: 0 },
        features: ["Mark Levinson Audio", "Panoramic View Monitor", "Head-Up Display"],
        status: "Available"
      },
      {
        make: "BMW", model: "X5", trim: "xDrive40i", year: 2022, bodyStyle: "SUV",
        specs: { engine: "3.0L Inline-6 Turbo", transmission: "8-Speed Automatic", drivetrain: "AWD", fuelType: "Gasoline", mpgCity: 21, mpgHighway: 26, horsepower: 335, torque: 330, seating: 5 },
        exteriorColor: "Alpine White", interiorColor: "Black Vernasca Leather", condition: "Certified Pre-Owned", mileage: 22000,
        pricing: { invoiceCost: 55000, msrp: 65000, minMarkup: 0.07, maxMarkup: 0.15, currentMarkup: 0.11, holdback: 1750, incentives: 0 },
        features: ["Panoramic Moonroof", "Harman Kardon", "Gesture Control", "Wireless Charging"],
        status: "Available"
      },

      // Used Vehicles
      {
        make: "Honda", model: "Civic", trim: "EX", year: 2020, bodyStyle: "Sedan",
        specs: { engine: "1.5L Turbo I4", transmission: "CVT", drivetrain: "FWD", fuelType: "Gasoline", mpgCity: 32, mpgHighway: 42, horsepower: 174, torque: 162, seating: 5 },
        exteriorColor: "Rallye Red", interiorColor: "Black Cloth", condition: "Used", mileage: 35000,
        pricing: { invoiceCost: 18000, msrp: 22000, minMarkup: 0.10, maxMarkup: 0.20, currentMarkup: 0.15, holdback: 0, incentives: 0 },
        features: ["Honda Sensing", "Sunroof", "Apple CarPlay"],
        status: "Available"
      },
      {
        make: "Toyota", model: "RAV4", trim: "XLE", year: 2021, bodyStyle: "SUV",
        specs: { engine: "2.5L I4", transmission: "8-Speed Automatic", drivetrain: "AWD", fuelType: "Gasoline", mpgCity: 27, mpgHighway: 35, horsepower: 203, torque: 184, seating: 5 },
        exteriorColor: "Blueprint", interiorColor: "Black Fabric", condition: "Used", mileage: 28000,
        pricing: { invoiceCost: 26000, msrp: 31000, minMarkup: 0.09, maxMarkup: 0.17, currentMarkup: 0.13, holdback: 0, incentives: 0 },
        features: ["Toyota Safety Sense", "Power Liftgate", "Moonroof"],
        status: "Available"
      }
    ];

    // Generate 50+ vehicles from templates with variations
    const vehicles = [];
    let vehicleCounter = 1;

    // Add base templates
    vehicleTemplates.forEach(template => {
      vehicles.push(this.createVehicle(template, vehicleCounter++));
    });

    // Generate additional vehicles to reach 50+
    const additionalMakes = [
      {make: "Mazda", model: "CX-5", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Subaru", model: "Outback", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Hyundai", model: "Sonata", year: 2024, bodyStyle: "Sedan", condition: "New"},
      {make: "Kia", model: "Telluride", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Volkswagen", model: "Jetta", year: 2024, bodyStyle: "Sedan", condition: "New"},
      {make: "Acura", model: "MDX", year: 2023, bodyStyle: "SUV", condition: "Certified Pre-Owned"},
      {make: "Infiniti", model: "Q50", year: 2023, bodyStyle: "Sedan", condition: "Certified Pre-Owned"},
      {make: "Genesis", model: "G70", year: 2024, bodyStyle: "Sedan", condition: "New"},
      {make: "Cadillac", model: "Escalade", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Lincoln", model: "Navigator", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Dodge", model: "Charger", year: 2023, bodyStyle: "Sedan", condition: "Used"},
      {make: "Chrysler", model: "Pacifica", year: 2024, bodyStyle: "Minivan", condition: "New"},
      {make: "GMC", model: "Sierra 1500", year: 2024, bodyStyle: "Truck", condition: "New"},
      {make: "Toyota", model: "Highlander", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Honda", model: "Pilot", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Nissan", model: "Rogue", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Mazda", model: "3", year: 2023, bodyStyle: "Sedan", condition: "Used"},
      {make: "Subaru", model: "Forester", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Volkswagen", model: "Tiguan", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Buick", model: "Enclave", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Volvo", model: "XC90", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Jaguar", model: "F-PACE", year: 2023, bodyStyle: "SUV", condition: "Certified Pre-Owned"},
      {make: "Land Rover", model: "Range Rover Sport", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Alfa Romeo", model: "Giulia", year: 2023, bodyStyle: "Sedan", condition: "Used"},
      {make: "Mini", model: "Cooper", year: 2024, bodyStyle: "Hatchback", condition: "New"},
      {make: "Fiat", model: "500X", year: 2023, bodyStyle: "SUV", condition: "Used"},
      {make: "Mitsubishi", model: "Outlander", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Chrysler", model: "300", year: 2023, bodyStyle: "Sedan", condition: "Used"},
      {make: "Dodge", model: "Durango", year: 2024, bodyStyle: "SUV", condition: "New"},
      {make: "Toyota", model: "Tundra", year: 2024, bodyStyle: "Truck", condition: "New"}
    ];

    additionalMakes.forEach(vehicle => {
      const basePrice = vehicle.condition === "New" ? 35000 : vehicle.condition === "Certified Pre-Owned" ? 30000 : 20000;
      vehicles.push(this.createVehicle({
        ...vehicle,
        trim: "Base",
        specs: { engine: "2.5L I4", transmission: "Automatic", drivetrain: "FWD", fuelType: "Gasoline", mpgCity: 25, mpgHighway: 32, horsepower: 200, torque: 180, seating: 5 },
        exteriorColor: ["White", "Black", "Silver", "Blue", "Red"][vehicleCounter % 5],
        interiorColor: "Black",
        mileage: vehicle.condition === "New" ? 10 : vehicle.condition === "Certified Pre-Owned" ? 20000 : 45000,
        pricing: { invoiceCost: basePrice, msrp: basePrice * 1.15, minMarkup: 0.05, maxMarkup: 0.15, currentMarkup: 0.10, holdback: basePrice * 0.03, incentives: vehicle.condition === "New" ? 1000 : 0 },
        features: ["Bluetooth", "Backup Camera", "Cruise Control"],
        status: "Available"
      }, vehicleCounter++));
    });

    return vehicles;
  },

  createVehicle(template, index) {
    const vehicleId = `VEH${String(index).padStart(3, '0')}`;
    const agentId = `DLR${String((index % 10) + 1).padStart(3, '0')}`;

    const netCost = template.pricing.invoiceCost - template.pricing.holdback - template.pricing.incentives;
    const salePrice = Math.round(template.pricing.invoiceCost * (1 + template.pricing.currentMarkup));

    return {
      id: vehicleId,
      vin: this.generateVIN(),
      year: template.year,
      make: template.make,
      model: template.model,
      trim: template.trim,
      bodyStyle: template.bodyStyle,
      specs: template.specs,
      exteriorColor: template.exteriorColor,
      interiorColor: template.interiorColor,
      condition: template.condition,
      mileage: template.mileage,
      accidents: 0,
      owners: template.condition === "New" ? 0 : template.condition === "Certified Pre-Owned" ? 1 : Math.floor(Math.random() * 2) + 1,
      pricing: {
        ...template.pricing,
        salePrice,
        netCost
      },
      features: template.features,
      images: [
        `/images/vehicles/${vehicleId.toLowerCase()}-front.jpg`,
        `/images/vehicles/${vehicleId.toLowerCase()}-side.jpg`,
        `/images/vehicles/${vehicleId.toLowerCase()}-rear.jpg`,
        `/images/vehicles/${vehicleId.toLowerCase()}-interior.jpg`
      ],
      status: template.status,
      location: `${["Main Lot", "North Lot", "South Lot"][index % 3]} - Row ${String.fromCharCode(65 + (index % 5))}`,
      addedDate: new Date(2024, 0, 1 + (index % 28)).toISOString().split('T')[0],
      lastUpdated: new Date(2024, 1, 1).toISOString().split('T')[0],
      assignedAgent: agentId,
      views: Math.floor(Math.random() * 200) + 20,
      inquiries: Math.floor(Math.random() * 15)
    };
  },

  generateVIN() {
    const chars = '0123456789ABCDEFGHJKLMNPRSTUVWXYZ';
    let vin = '';
    for (let i = 0; i < 17; i++) {
      vin += chars[Math.floor(Math.random() * chars.length)];
    }
    return vin;
  },

  // ====================
  // INQUIRIES
  // ====================

  getInitialInquiries() {
    const types = ["purchase", "trade-in", "financing", "test-drive"];
    // Weighted distribution: open 30%, contacted 25%, negotiating 20%, won 15%, lost 10%
    const statusWeights = [
      { status: "open", weight: 30 },
      { status: "contacted", weight: 25 },
      { status: "negotiating", weight: 20 },
      { status: "closed-won", weight: 15 },
      { status: "closed-lost", weight: 10 }
    ];
    function pickStatus(seed) {
      const r = ((seed * 7 + 13) * 31) % 100;
      let cumulative = 0;
      for (const sw of statusWeights) {
        cumulative += sw.weight;
        if (r < cumulative) return sw.status;
      }
      return "open";
    }
    const priorities = ["low", "medium", "high"];

    return Array.from({length: 100}, (_, i) => {
      const vehicleNum = (i % 50) + 1;
      const buyerNum = (i % 25) + 1;
      const agentNum = ((vehicleNum - 1) % 10) + 1;

      return {
        id: `INQ${String(i + 1).padStart(3, '0')}`,
        vehicleId: `VEH${String(vehicleNum).padStart(3, '0')}`,
        buyerId: `USR${String(buyerNum).padStart(3, '0')}`,
        agentId: `DLR${String(agentNum).padStart(3, '0')}`,
        type: types[i % types.length],
        status: pickStatus(i),
        priority: priorities[i % priorities.length],
        message: this.getInquiryMessage(i % 5),
        offer: i % 3 === 0 ? {
          proposedPrice: 30000 + (i * 500),
          hasTradeIn: i % 2 === 0,
          tradeInVehicle: i % 2 === 0 ? "2019 Honda Accord" : null,
          tradeInEstimate: i % 2 === 0 ? 15000 : 0,
          financingNeeded: true,
          downPayment: 5000 + (i * 100)
        } : null,
        communications: [
          {
            timestamp: new Date(2024, 0, 15 + (i % 15), 10, 30).toISOString(),
            from: "buyer",
            message: this.getInquiryMessage(i % 5),
            channel: "portal"
          }
        ],
        createdAt: new Date(2024, 0, 15 + (i % 15), 10, 30).toISOString(),
        updatedAt: new Date(2024, 0, 16 + (i % 15), 11, 45).toISOString()
      };
    });
  },

  getInquiryMessage(type) {
    const messages = [
      "Interested in this vehicle. Is the price negotiable?",
      "I'd like to schedule a test drive for this weekend.",
      "Can you provide more information about financing options?",
      "Is this vehicle still available? I'm very interested.",
      "What's your best price on this? I'm ready to buy today."
    ];
    return messages[type];
  },

  // ====================
  // TRANSACTIONS
  // ====================

  getInitialTransactions() {
    return Array.from({length: 15}, (_, i) => {
      const vehicleNum = i + 3;
      const buyerNum = i + 2;
      const agentNum = ((vehicleNum - 1) % 10) + 1;
      const salePrice = 35000 + (i * 3000);
      const grossProfit = 4000 + (i * 200);

      return {
        id: `TXN${String(i + 1).padStart(3, '0')}`,
        vehicleId: `VEH${String(vehicleNum).padStart(3, '0')}`,
        buyerId: `USR${String(buyerNum).padStart(3, '0')}`,
        agentId: `DLR${String(agentNum).padStart(3, '0')}`,
        pricing: {
          salePrice,
          tradeInValue: i % 3 === 0 ? 12000 : 0,
          netPrice: i % 3 === 0 ? salePrice - 12000 : salePrice,
          taxes: Math.round(salePrice * 0.0825),
          fees: {
            documentation: 499,
            registration: 325,
            titleTransfer: 75
          },
          totalDue: Math.round(salePrice * 1.0825) + 899
        },
        commission: {
          rate: 0.03,
          grossProfit,
          commissionAmount: Math.round(grossProfit * 0.03)
        },
        status: "completed",
        completedDate: new Date(2024, 0, 10 + i).toISOString().split('T')[0],
        createdAt: new Date(2024, 0, 5 + i, 14, 0).toISOString()
      };
    });
  },

  // ====================
  // CRUD Operations
  // ====================

  // Users
  getUsers() {
    return JSON.parse(localStorage.getItem('zuco_users') || '[]');
  },

  getUser(id) {
    return this.getUsers().find(u => u.id === id);
  },

  getUserByEmail(email) {
    return this.getUsers().find(u => u.email === email);
  },

  addUser(user) {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem('zuco_users', JSON.stringify(users));
    return user;
  },

  updateUser(id, updates) {
    const users = this.getUsers();
    const index = users.findIndex(u => u.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      localStorage.setItem('zuco_users', JSON.stringify(users));
      return users[index];
    }
    return null;
  },

  // Vehicles
  getVehicles() {
    return JSON.parse(localStorage.getItem('zuco_vehicles') || '[]');
  },

  getVehicle(id) {
    return this.getVehicles().find(v => v.id === id);
  },

  addVehicle(vehicle) {
    const vehicles = this.getVehicles();
    vehicles.push(vehicle);
    localStorage.setItem('zuco_vehicles', JSON.stringify(vehicles));
    return vehicle;
  },

  updateVehicle(id, updates) {
    const vehicles = this.getVehicles();
    const index = vehicles.findIndex(v => v.id === id);
    if (index !== -1) {
      vehicles[index] = { ...vehicles[index], ...updates };
      localStorage.setItem('zuco_vehicles', JSON.stringify(vehicles));
      return vehicles[index];
    }
    return null;
  },

  deleteVehicle(id) {
    const vehicles = this.getVehicles();
    const filtered = vehicles.filter(v => v.id !== id);
    localStorage.setItem('zuco_vehicles', JSON.stringify(filtered));
  },

  // Inquiries
  getInquiries() {
    return JSON.parse(localStorage.getItem('zuco_inquiries') || '[]');
  },

  getInquiry(id) {
    return this.getInquiries().find(i => i.id === id);
  },

  getInquiriesByBuyer(buyerId) {
    return this.getInquiries().filter(i => i.buyerId === buyerId);
  },

  getInquiriesByAgent(agentId) {
    return this.getInquiries().filter(i => i.agentId === agentId);
  },

  addInquiry(inquiry) {
    const inquiries = this.getInquiries();
    inquiries.push(inquiry);
    localStorage.setItem('zuco_inquiries', JSON.stringify(inquiries));
    return inquiry;
  },

  updateInquiry(id, updates) {
    const inquiries = this.getInquiries();
    const index = inquiries.findIndex(i => i.id === id);
    if (index !== -1) {
      inquiries[index] = { ...inquiries[index], ...updates };
      localStorage.setItem('zuco_inquiries', JSON.stringify(inquiries));
      return inquiries[index];
    }
    return null;
  },

  // Transactions
  getTransactions() {
    return JSON.parse(localStorage.getItem('zuco_transactions') || '[]');
  },

  getTransaction(id) {
    return this.getTransactions().find(t => t.id === id);
  },

  getTransactionsByAgent(agentId) {
    return this.getTransactions().filter(t => t.agentId === agentId);
  },

  addTransaction(transaction) {
    const transactions = this.getTransactions();
    transactions.push(transaction);
    localStorage.setItem('zuco_transactions', JSON.stringify(transactions));
    return transaction;
  },

  // ====================
  // AGENT ALLOCATIONS
  // ====================

  getInitialAllocations() {
    const allocations = [];
    for (let v = 1; v <= 15; v++) {
      const numAgents = Math.min(2 + (v % 3), 5);
      for (let a = 0; a < numAgents; a++) {
        const agentNum = ((v * 3 + a) % 20) + 1;
        const claimedDate = new Date(2026, 0, 10 + (v % 15), 9 + a, 0);
        allocations.push({
          id: `ALC${String(allocations.length + 1).padStart(3, '0')}`,
          vehicleId: `VEH${String(v).padStart(3, '0')}`,
          agentId: `AGT${String(agentNum).padStart(3, '0')}`,
          agentName: '',
          claimedDate: claimedDate.toISOString().split('T')[0],
          status: "active"
        });
      }
    }
    return allocations;
  },

  getAgentAllocations() {
    return JSON.parse(localStorage.getItem('zuco_agent_allocations') || '[]');
  },

  getAllocationsByVehicle(vehicleId) {
    return this.getAgentAllocations().filter(a => a.vehicleId === vehicleId);
  },

  getAllocationsByAgent(agentId) {
    return this.getAgentAllocations().filter(a => a.agentId === agentId);
  },

  addAllocation(allocation) {
    const allocations = this.getAgentAllocations();
    allocations.push(allocation);
    localStorage.setItem('zuco_agent_allocations', JSON.stringify(allocations));
    return allocation;
  },

  updateAllocation(id, updates) {
    const allocations = this.getAgentAllocations();
    const index = allocations.findIndex(a => a.id === id);
    if (index !== -1) {
      allocations[index] = { ...allocations[index], ...updates };
      localStorage.setItem('zuco_agent_allocations', JSON.stringify(allocations));
      return allocations[index];
    }
    return null;
  },

  // ====================
  // TEST DRIVES
  // ====================

  getInitialTestDrives() {
    return Array.from({length: 8}, (_, i) => ({
      id: `TD${String(i + 1).padStart(3, '0')}`,
      vehicleId: `VEH${String((i % 10) + 1).padStart(3, '0')}`,
      agentId: `AGT${String((i % 5) + 1).padStart(3, '0')}`,
      buyerName: ["John Smith","Sarah Wilson","Mike Johnson","Emily Chen","David Brown","Alex Taylor","Jordan Lee","Morgan Garcia"][i],
      buyerPhone: `555-${String(100 + i * 11).padStart(3, '0')}-${String(2000 + i * 47).slice(-4)}`,
      buyerEmail: `customer${i + 1}@email.com`,
      scheduledDate: new Date(2026, 1, 3 + i).toISOString().split('T')[0],
      scheduledTime: `${9 + (i % 8)}:${i % 2 === 0 ? '00' : '30'}`,
      endTime: `${9 + (i % 8)}:${i % 2 === 0 ? '30' : '00'}`,
      status: i < 3 ? "completed" : "scheduled",
      notes: "",
      createdAt: new Date(2026, 0, 25 + (i % 5)).toISOString()
    }));
  },

  getTestDrives() {
    return JSON.parse(localStorage.getItem('zuco_test_drives') || '[]');
  },

  getTestDrivesByAgent(agentId) {
    return this.getTestDrives().filter(td => td.agentId === agentId);
  },

  getTestDrivesByVehicle(vehicleId) {
    return this.getTestDrives().filter(td => td.vehicleId === vehicleId);
  },

  addTestDrive(testDrive) {
    const drives = this.getTestDrives();
    drives.push(testDrive);
    localStorage.setItem('zuco_test_drives', JSON.stringify(drives));
    return testDrive;
  },

  updateTestDrive(id, updates) {
    const drives = this.getTestDrives();
    const index = drives.findIndex(td => td.id === id);
    if (index !== -1) {
      drives[index] = { ...drives[index], ...updates };
      localStorage.setItem('zuco_test_drives', JSON.stringify(drives));
      return drives[index];
    }
    return null;
  },

  // ====================
  // AGENT SALES
  // ====================

  getAgentSales() {
    return JSON.parse(localStorage.getItem('zuco_agent_sales') || '[]');
  },

  getAgentSalesByAgent(agentId) {
    return this.getAgentSales().filter(s => s.agentId === agentId);
  },

  addAgentSale(sale) {
    const sales = this.getAgentSales();
    sales.push(sale);
    localStorage.setItem('zuco_agent_sales', JSON.stringify(sales));
    return sale;
  },

  updateAgentSale(saleId, updates) {
    const sales = this.getAgentSales();
    const idx = sales.findIndex(s => s.id === saleId);
    if (idx === -1) return null;
    sales[idx] = { ...sales[idx], ...updates };
    localStorage.setItem('zuco_agent_sales', JSON.stringify(sales));
    return sales[idx];
  },

  getAgentSale(saleId) {
    return this.getAgentSales().find(s => s.id === saleId) || null;
  },

  getAgentSalesByStatus(status) {
    return this.getAgentSales().filter(s => s.status === status);
  },

  // ====================
  // AGENT PRICING (hides real cost)
  // ====================

  // ====================
  // VIEWING BOOKINGS
  // ====================

  getViewingBookings() {
    return JSON.parse(localStorage.getItem('zuco_viewing_bookings') || '[]');
  },

  getViewingBooking(id) {
    return this.getViewingBookings().find(b => b.id === id) || null;
  },

  getViewingBookingsByVehicle(vehicleId) {
    return this.getViewingBookings().filter(b => b.vehicleId === vehicleId);
  },

  getViewingBookingsByAgent(agentId) {
    return this.getViewingBookings().filter(b => b.agentId === agentId);
  },

  addViewingBooking(booking) {
    const bookings = this.getViewingBookings();
    bookings.push(booking);
    localStorage.setItem('zuco_viewing_bookings', JSON.stringify(bookings));
    return booking;
  },

  updateViewingBooking(id, updates) {
    const bookings = this.getViewingBookings();
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    bookings[idx] = { ...bookings[idx], ...updates };
    localStorage.setItem('zuco_viewing_bookings', JSON.stringify(bookings));
    return bookings[idx];
  },

  // ====================
  // AGENT PRICING (hides real cost)
  // ====================

  getAgentVehiclePricing(vehicleId) {
    const vehicle = this.getVehicle(vehicleId);
    if (!vehicle) return null;
    const invoiceCost = vehicle.pricing.invoiceCost;
    const salePrice = vehicle.pricing.salePrice;
    // Company takes COMPANY_MARGIN_RATE of the gross spread (salePrice - invoiceCost)
    const grossSpread = salePrice - invoiceCost;
    const companyMargin = Math.round(grossSpread * this.COMPANY_MARGIN_RATE);
    const agentCostPrice = invoiceCost + companyMargin;
    const profitRoom = salePrice - agentCostPrice;
    return { agentCostPrice, salePrice, profitRoom };
  },

  // ====================
  // SELL YOUR CAR QUOTES
  // ====================

  getQuoteRequests() {
    return JSON.parse(localStorage.getItem('zuco_quote_requests') || '[]');
  },

  getQuoteRequest(id) {
    return this.getQuoteRequests().find(q => q.id === id) || null;
  },

  addQuoteRequest(quote) {
    const quotes = this.getQuoteRequests();
    quotes.push(quote);
    localStorage.setItem('zuco_quote_requests', JSON.stringify(quotes));
    return quote;
  },

  updateQuoteRequest(id, updates) {
    const quotes = this.getQuoteRequests();
    const idx = quotes.findIndex(q => q.id === id);
    if (idx === -1) return null;
    quotes[idx] = { ...quotes[idx], ...updates };
    localStorage.setItem('zuco_quote_requests', JSON.stringify(quotes));
    return quotes[idx];
  }
};

// Initialize database on load
DB.init();
