import bcrypt from 'bcryptjs';

const initialCategories = [
  { id: 1, name: 'Laptops', description: 'Portable computers for work and gaming' },
  { id: 2, name: 'Desktops', description: 'Desktop computers and towers' },
  { id: 3, name: 'Monitors', description: 'Computer monitors and displays' },
  { id: 4, name: 'Keyboards', description: 'Mechanical and membrane keyboards' },
  { id: 5, name: 'Mice', description: 'Gaming and productivity mice' },
  { id: 6, name: 'Headsets', description: 'Audio headsets and headphones' },
  { id: 7, name: 'Graphics Cards', description: 'GPU cards for gaming and workstations' },
  { id: 8, name: 'Processors', description: 'CPU processors from Intel and AMD' },
  { id: 9, name: 'Storage', description: 'SSDs, HDDs, and external drives' },
  { id: 10, name: 'Accessories', description: 'PC accessories and peripherals' }
];

const initialProducts = [
  {
    id: 1,
    name: 'Gaming Laptop Pro X1 (Core i9 / RTX 4080)',
    description: 'High-performance gaming laptop with NVIDIA RTX 4080 12GB, Intel Core i9-13980HX, 32GB DDR5 RAM, 1TB NVMe SSD, 240Hz QHD Display, Per-Key RGB mechanical keyboard.',
    price: 185000,
    stock: 15,
    category_id: 1,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    created_at: new Date('2026-01-10T10:00:00Z')
  },
  {
    id: 2,
    name: 'UltraBook Slim 14 (Core i7 / 16GB RAM)',
    description: 'Ultra-thin premium business laptop with Intel Core i7 13th Gen, 16GB LPDDR5 RAM, 512GB NVMe SSD, 2.8K OLED display, 14-hour battery life.',
    price: 95000,
    stock: 25,
    category_id: 1,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    created_at: new Date('2026-01-11T11:00:00Z')
  },
  {
    id: 3,
    name: 'Desktop Tower Beast RTX 4090 Gaming Rig',
    description: 'Custom-built liquid-cooled gaming powerhouse with NVIDIA GeForce RTX 4090 24GB, Intel Core i9-14900K, 64GB DDR5 RGB RAM, 2TB Gen4 SSD, 1000W Gold PSU.',
    price: 295000,
    stock: 8,
    category_id: 2,
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    created_at: new Date('2026-01-12T12:00:00Z')
  },
  {
    id: 4,
    name: 'Office Desktop Pro Slim Workstation',
    description: 'Reliable business desktop with Intel Core i5 13th Gen, 16GB RAM, 512GB SSD, whisper-quiet cooling, dual 4K HDMI support, compact chassis.',
    price: 46000,
    stock: 30,
    category_id: 2,
    image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-13T13:00:00Z')
  },
  {
    id: 5,
    name: '4K UltraWide Curved Monitor 34" (144Hz)',
    description: '34-inch curved ultrawide IPS panel, 3440x1440 resolution, 144Hz refresh rate, 1ms response time, HDR400, USB-C 90W power delivery hub.',
    price: 65000,
    stock: 20,
    category_id: 3,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    created_at: new Date('2026-01-14T14:00:00Z')
  },
  {
    id: 6,
    name: 'Gaming Monitor 27" 240Hz Fast IPS',
    description: '27-inch Fast IPS esports gaming monitor, Full HD 1080p, 240Hz refresh, G-Sync & FreeSync Premium compatible, 0.5ms ultra-low response time.',
    price: 38000,
    stock: 18,
    category_id: 3,
    image: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-15T15:00:00Z')
  },
  {
    id: 7,
    name: 'Mechanical Keyboard RGB Custom (Hot-Swap)',
    description: 'Hot-swappable linear mechanical red switches, sound dampening silicone foam, aircraft-grade aluminum top plate, per-key dynamic RGB lighting.',
    price: 8500,
    stock: 50,
    category_id: 4,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    created_at: new Date('2026-01-16T16:00:00Z')
  },
  {
    id: 8,
    name: 'Wireless Keyboard Compact 75% Layout',
    description: 'Tri-mode connectivity (2.4GHz Wireless / Bluetooth 5.1 / Type-C wired), long-lasting 4000mAh battery, PBT double-shot keycaps.',
    price: 4800,
    stock: 40,
    category_id: 4,
    image: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-17T17:00:00Z')
  },
  {
    id: 9,
    name: 'Gaming Mouse Pro Ultralight (60g PAW3395)',
    description: '60g ultra-lightweight honeycomb ergonomic chassis, PixArt PAW3395 26,000 DPI optical sensor, optical micro switches, PTFE pure glide skates.',
    price: 4500,
    stock: 60,
    category_id: 5,
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    created_at: new Date('2026-01-18T18:00:00Z')
  },
  {
    id: 10,
    name: 'Wireless Ergonomic Optical Mouse',
    description: 'Designed to eliminate wrist strain with natural 57-degree vertical handshake posture, silent click switches, rechargeable battery.',
    price: 3200,
    stock: 45,
    category_id: 5,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-19T19:00:00Z')
  },
  {
    id: 11,
    name: 'Gaming Headset 7.1 Surround Sound',
    description: '53mm neodymium audio drivers, detachable AI noise-cancelling microphone, memory foam breathable ear cushions, multi-platform USB/3.5mm.',
    price: 6800,
    stock: 35,
    category_id: 6,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-20T20:00:00Z')
  },
  {
    id: 12,
    name: 'GeForce RTX 4070 Ti 12GB Graphics Card',
    description: '12GB GDDR6X, NVIDIA Ada Lovelace architecture, 3rd Gen RT Cores, DLSS 3 AI frame generation, triple fan high-airflow cooling system.',
    price: 125000,
    stock: 12,
    category_id: 7,
    image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=800&q=80',
    featured: 1,
    created_at: new Date('2026-01-21T21:00:00Z')
  },
  {
    id: 13,
    name: 'AMD Ryzen 9 7950X 16-Core Processor CPU',
    description: '16 Cores, 32 Threads, up to 5.7GHz Max Boost, PCIe 5.0 support, DDR5 memory compatible, AM5 socket unlocked for overclocking.',
    price: 68000,
    stock: 20,
    category_id: 8,
    image: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-22T22:00:00Z')
  },
  {
    id: 14,
    name: '1TB NVMe PCIe 4.0 High-Speed M.2 SSD',
    description: 'Next-generation PCIe Gen4 x4 NVMe M.2 SSD, sequential read speeds up to 7,450 MB/s, integrated aluminum heat-sink for PS5 & PC.',
    price: 12500,
    stock: 55,
    category_id: 9,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-23T23:00:00Z')
  },
  {
    id: 15,
    name: 'USB-C Hub 10-in-1 Aluminum Multiport Adapter',
    description: 'Dual 4K HDMI ports, 100W Power Delivery pass-through, Gigabit Ethernet, 3x USB 3.0 ports, SD/MicroSD card reader, 3.5mm audio jack.',
    price: 3900,
    stock: 70,
    category_id: 10,
    image: 'https://images.unsplash.com/photo-1625842268584-8f3296236761?auto=format&fit=crop&w=800&q=80',
    featured: 0,
    created_at: new Date('2026-01-24T10:00:00Z')
  }
];

const initialBanks = [
  { id: 1, name: 'Commercial Bank of Ethiopia (CBE)', account_number: '1000123456789', account_name: 'PC Store PLC', is_active: 1 },
  { id: 2, name: 'Bank of Abyssinia (BOA)', account_number: '2000987654321', account_name: 'PC Store PLC', is_active: 1 },
  { id: 3, name: 'Telebirr', account_number: '0925692705', account_name: 'PC Store', is_active: 1 }
];

export class InMemoryStore {
  constructor() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@pcstore.com',
        password: bcrypt.hashSync('123456', 10),
        full_name: 'Administrator',
        phone: '+251 925692705',
        address: '123 Tech Street, Silicon Valley, CA 94000',
        avatar: 'id2.jpg',
        role: 'admin',
        created_at: new Date('2026-01-01T00:00:00Z')
      },
      {
        id: 2,
        username: 'customer',
        email: 'customer@example.com',
        password: bcrypt.hashSync('123456', 10),
        full_name: 'Alex Techie',
        phone: '+251 911223344',
        address: '456 Gaming Blvd, Tech City',
        avatar: null,
        role: 'user',
        created_at: new Date('2026-01-15T00:00:00Z')
      }
    ];

    this.categories = [...initialCategories];
    this.products = [...initialProducts];
    this.banks = [...initialBanks];

    this.orders = [
      {
        id: 1001,
        user_id: 2,
        total_amount: 185000,
        status: 'delivered',
        shipping_address: '456 Gaming Blvd, Tech City',
        phone: '+251 911223344',
        notes: 'Please handle with care. Signature required.',
        payment_method: 'Commercial Bank of Ethiopia (CBE)',
        payment_status: 'approved',
        payment_proof: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
        admin_message: 'Your laptop has been packaged and delivered securely via express courier in Addis Ababa. Enjoy your new gaming rig!',
        created_at: new Date('2026-02-01T14:30:00Z'),
        updated_at: new Date('2026-02-03T09:15:00Z'),
        items: [
          { product_id: 1, product_name: 'Gaming Laptop Pro X1 (Core i9 / RTX 4080)', quantity: 1, price: 185000, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        id: 1002,
        user_id: 2,
        total_amount: 13000,
        status: 'shipped',
        shipping_address: '456 Gaming Blvd, Tech City',
        phone: '+251 911223344',
        notes: 'Call before arriving',
        payment_method: 'Telebirr',
        payment_status: 'approved',
        payment_proof: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
        admin_message: 'Tracking #PC-EXP-889102. Estimated delivery tomorrow.',
        created_at: new Date('2026-02-18T16:20:00Z'),
        updated_at: new Date('2026-02-19T11:00:00Z'),
        items: [
          { product_id: 7, product_name: 'Mechanical Keyboard RGB Custom (Hot-Swap)', quantity: 1, price: 8500, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80' },
          { product_id: 9, product_name: 'Gaming Mouse Pro Ultralight (60g PAW3395)', quantity: 1, price: 4500, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=800&q=80' }
        ]
      },
      {
        id: 1003,
        user_id: 2,
        total_amount: 65000,
        status: 'processing',
        shipping_address: '456 Gaming Blvd, Tech City',
        phone: '+251 911223344',
        notes: '',
        payment_method: 'Bank of Abyssinia (BOA)',
        payment_status: 'proof_uploaded',
        payment_proof: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
        admin_message: 'Payment received and verified. Currently inspecting screen panel before shipment.',
        created_at: new Date('2026-02-22T08:45:00Z'),
        updated_at: new Date('2026-02-22T10:00:00Z'),
        items: [
          { product_id: 5, product_name: '4K UltraWide Curved Monitor 34" (144Hz)', quantity: 1, price: 65000, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80' }
        ]
      }
    ];

    this.contact_messages = [
      {
        id: 1,
        name: 'Sara Jenkins',
        email: 'sara.j@example.com',
        subject: 'Custom Water-Cooling Inquiry',
        message: 'Hello, do you offer custom tubing and loop filling for the Desktop Tower Beast? Thanks!',
        is_read: 0,
        created_at: new Date('2026-02-20T11:20:00Z')
      },
      {
        id: 2,
        name: 'Michael Chang',
        email: 'm.chang@example.com',
        subject: 'Bulk Order for Design Studio',
        message: 'Looking to purchase 5 units of the UltraBook Slim 14 with commercial invoicing. Please contact me.',
        is_read: 1,
        created_at: new Date('2026-02-15T09:10:00Z')
      }
    ];

    this.nextUserId = 3;
    this.nextProductId = 16;
    this.nextCategoryId = 11;
    this.nextOrderId = 1004;
    this.nextContactId = 3;
    this.nextChatId = 10;

    this.chats = [
      {
        id: 1,
        order_id: 1001,
        user_id: 2,
        user_name: 'Alex Techie',
        user_email: 'customer@example.com',
        subject: 'Order #1001: Gaming Laptop Pro X1',
        created_at: new Date('2026-02-01T14:35:00Z'),
        updated_at: new Date('2026-02-03T09:20:00Z'),
        messages: [
          {
            id: 1,
            sender: 'system',
            sender_name: 'PC Store Bot',
            text: 'Order #1001 placed successfully! CBE Payment screenshot received.',
            timestamp: new Date('2026-02-01T14:35:00Z')
          },
          {
            id: 2,
            sender: 'customer',
            sender_name: 'Alex Techie',
            text: 'Hello! I uploaded the CBE mobile receipt. When will the laptop be delivered?',
            timestamp: new Date('2026-02-01T15:00:00Z')
          },
          {
            id: 3,
            sender: 'admin',
            sender_name: 'Support Admin',
            text: 'Payment has been verified! We have tested the laptop and handed it to express courier. Tracking code is PC-EXP-889102.',
            timestamp: new Date('2026-02-02T10:15:00Z')
          },
          {
            id: 4,
            sender: 'customer',
            sender_name: 'Alex Techie',
            text: 'Received in perfect condition, thank you so much!',
            timestamp: new Date('2026-02-03T09:20:00Z')
          }
        ]
      },
      {
        id: 2,
        order_id: 1003,
        user_id: 2,
        user_name: 'Alex Techie',
        user_email: 'customer@example.com',
        subject: 'Order #1003: 4K UltraWide Monitor 34"',
        created_at: new Date('2026-02-22T08:50:00Z'),
        updated_at: new Date('2026-02-22T10:05:00Z'),
        messages: [
          {
            id: 5,
            sender: 'system',
            sender_name: 'PC Store Bot',
            text: 'Order #1003 placed. Bank of Abyssinia payment proof uploaded.',
            timestamp: new Date('2026-02-22T08:50:00Z')
          },
          {
            id: 6,
            sender: 'admin',
            sender_name: 'Support Admin',
            text: 'Hello Alex! We verified your Abyssinia transfer. We are performing screen calibration and will ship it today.',
            timestamp: new Date('2026-02-22T10:05:00Z')
          }
        ]
      }
    ];
  }

  // Users
  findUserById(id) {
    return this.users.find(u => u.id === Number(id));
  }

  findUserByUsername(username) {
    if (!username) return null;
    const term = username.toLowerCase().trim();
    return this.users.find(u => u.username && u.username.toLowerCase() === term);
  }

  findUserByEmail(email) {
    if (!email) return null;
    const term = email.toLowerCase().trim();
    return this.users.find(u => u.email && u.email.toLowerCase() === term);
  }

  findUserByUsernameOrEmail(identifier) {
    if (!identifier) return null;
    const term = identifier.toLowerCase().trim();
    return this.users.find(u => 
      (u.username && u.username.toLowerCase() === term) || 
      (u.email && u.email.toLowerCase() === term)
    );
  }

  verifyUser(identifier, password) {
    const user = this.findUserByUsernameOrEmail(identifier);
    if (!user) return null;

    // Direct password match for standard demo accounts or bcrypt compare
    const isDirectMatch = 
      password === user.password || 
      (user.username === 'admin' && (password === 'admin123' || password === '123456' || password === 'admin')) ||
      (user.username === 'customer' && (password === 'customer123' || password === '123456' || password === 'customer'));

    if (isDirectMatch) {
      return user;
    }

    try {
      if (user.password && bcrypt.compareSync(password, user.password)) {
        return user;
      }
    } catch {
      // Fallback
    }

    return null;
  }

  createUser(userData) {
    const user = {
      id: this.nextUserId++,
      username: userData.username,
      email: userData.email,
      password: userData.password.startsWith('$2') ? userData.password : bcrypt.hashSync(userData.password, 10),
      full_name: userData.full_name || userData.username,
      phone: userData.phone || '',
      address: userData.address || '',
      avatar: userData.avatar || null,
      role: userData.role || 'customer',
      is_admin: userData.role === 'admin' ? 1 : 0,
      created_at: new Date()
    };
    this.users.push(user);
    return user;
  }

  updateUser(id, data) {
    const user = this.findUserById(id);
    if (!user) return null;
    if (data.full_name !== undefined) user.full_name = data.full_name;
    if (data.email !== undefined) user.email = data.email;
    if (data.phone !== undefined) user.phone = data.phone;
    if (data.address !== undefined) user.address = data.address;
    if (data.city !== undefined) user.city = data.city;
    if (data.avatar !== undefined) user.avatar = data.avatar;
    if (data.role !== undefined) {
      user.role = data.role;
      user.is_admin = data.role === 'admin' ? 1 : 0;
    }
    if (data.username !== undefined && data.username.trim()) {
      user.username = data.username.trim();
    }
    if (data.password) {
      user.password = data.password.startsWith('$2') ? data.password : bcrypt.hashSync(data.password, 10);
    }
    user.updated_at = new Date();
    return user;
  }

  updatePassword(id, newPassword) {
    const user = this.findUserById(id);
    if (!user) return null;
    user.password = newPassword.startsWith('$2') ? newPassword : bcrypt.hashSync(newPassword, 10);
    user.updated_at = new Date();
    return user;
  }

  deleteUser(id) {
    const idx = this.users.findIndex(u => u.id === Number(id));
    if (idx !== -1) {
      this.users.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Categories
  getCategories() {
    return this.categories.map(c => {
      const product_count = this.products.filter(p => p.category_id === c.id).length;
      return { ...c, product_count };
    });
  }

  getCategory(id) {
    return this.categories.find(c => c.id === Number(id));
  }

  createCategory(data) {
    const cat = {
      id: this.nextCategoryId++,
      name: data.name,
      description: data.description || '',
      created_at: new Date()
    };
    this.categories.push(cat);
    return cat;
  }

  deleteCategory(id) {
    const idx = this.categories.findIndex(c => c.id === Number(id));
    if (idx !== -1) {
      this.categories.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Products
  getProducts(filters = {}) {
    let result = this.products.map(p => {
      const category = this.categories.find(c => c.id === p.category_id);
      return {
        ...p,
        category_name: category ? category.name : 'General'
      };
    });

    const categoryId = filters.category_id || filters.categoryId;
    if (categoryId) {
      result = result.filter(p => p.category_id === Number(categoryId));
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        (p.description && p.description.toLowerCase().includes(query)) ||
        p.category_name.toLowerCase().includes(query)
      );
    }

    if (filters.featured) {
      result = result.filter(p => p.featured === 1);
    }

    if (filters.sort) {
      if (filters.sort === 'price-asc') result.sort((a, b) => a.price - b.price);
      else if (filters.sort === 'price-desc') result.sort((a, b) => b.price - a.price);
      else if (filters.sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
      else if (filters.sort === 'newest') result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return result;
  }

  getFeaturedProducts() {
    return this.getProducts({ featured: true });
  }

  getProduct(id) {
    const p = this.products.find(prod => prod.id === Number(id));
    if (!p) return null;
    const category = this.categories.find(c => c.id === p.category_id);
    return {
      ...p,
      category_name: category ? category.name : 'General'
    };
  }

  createProduct(data) {
    const product = {
      id: this.nextProductId++,
      name: data.name,
      description: data.description || '',
      price: parseFloat(data.price) || 0,
      stock: parseInt(data.stock, 10) || 0,
      category_id: data.category_id ? parseInt(data.category_id, 10) : null,
      image: data.image || '2.webp',
      featured: data.featured ? 1 : 0,
      created_at: new Date()
    };
    this.products.push(product);
    return product;
  }

  updateProduct(id, data) {
    const product = this.products.find(p => p.id === Number(id));
    if (!product) return null;
    if (data.name !== undefined) product.name = data.name;
    if (data.description !== undefined) product.description = data.description;
    if (data.price !== undefined) product.price = parseFloat(data.price);
    if (data.stock !== undefined) product.stock = parseInt(data.stock, 10);
    if (data.category_id !== undefined) product.category_id = data.category_id ? parseInt(data.category_id, 10) : null;
    if (data.image !== undefined) product.image = data.image;
    if (data.featured !== undefined) product.featured = data.featured ? 1 : 0;
    product.updated_at = new Date();
    return product;
  }

  deleteProduct(id) {
    const idx = this.products.findIndex(p => p.id === Number(id));
    if (idx !== -1) {
      this.products.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Orders
  getOrders(filters = {}) {
    let list = this.orders.map(o => {
      const user = this.findUserById(o.user_id);
      return {
        ...o,
        username: user ? user.username : 'Unknown',
        full_name: user ? user.full_name : 'Customer'
      };
    });

    if (filters.user_id) {
      list = list.filter(o => o.user_id === Number(filters.user_id));
    }

    if (filters.status) {
      list = list.filter(o => o.status === filters.status);
    }

    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  getOrder(id) {
    const o = this.orders.find(ord => ord.id === Number(id));
    if (!o) return null;
    const user = this.findUserById(o.user_id);
    return {
      ...o,
      username: user ? user.username : 'Unknown',
      full_name: user ? user.full_name : 'Customer'
    };
  }

  createOrder(data) {
    const order = {
      id: this.nextOrderId++,
      user_id: data.user_id,
      total_amount: parseFloat(data.total_amount),
      status: 'pending',
      shipping_address: data.shipping_address,
      phone: data.phone,
      notes: data.notes || '',
      payment_method: data.payment_method || 'Commercial Bank of Ethiopia (CBE)',
      payment_status: data.payment_proof ? 'proof_uploaded' : 'pending',
      payment_proof: data.payment_proof || null,
      transaction_ref: data.transaction_ref || null,
      admin_message: null,
      created_at: new Date(),
      updated_at: new Date(),
      items: (data.items || []).map(item => ({
        product_id: item.product_id || item.id,
        product_name: item.product_name || item.name,
        quantity: item.quantity || 1,
        price: Number(item.price),
        image: item.image || '2.webp'
      }))
    };

    // decrement stock
    for (const item of (data.items || [])) {
      const p = this.products.find(prod => prod.id === (item.product_id || item.id));
      if (p) {
        p.stock = Math.max(0, p.stock - (item.quantity || 1));
      }
    }

    this.orders.unshift(order);

    // Auto-create chat thread for order
    const user = this.findUserById(data.user_id);
    const chat = {
      id: this.nextChatId++,
      order_id: order.id,
      user_id: order.user_id || 0,
      user_name: data.customer_name || (user ? user.full_name : 'Customer'),
      user_email: data.customer_email || (user ? user.email : ''),
      subject: `Order #${order.id} Support & Updates`,
      created_at: new Date(),
      updated_at: new Date(),
      messages: [
        {
          id: 1,
          sender: 'system',
          sender_name: 'PC Store Automated Notification',
          text: `🎉 Order #${order.id} placed successfully for $${order.total_amount.toFixed(2)} via ${order.payment_method}. ${order.payment_proof ? 'Payment proof screenshot uploaded.' : 'Please upload payment receipt.'}`,
          timestamp: new Date()
        }
      ]
    };
    this.chats.unshift(chat);

    return order;
  }

  updateOrderPayment(id, updateData) {
    const order = this.orders.find(o => o.id === Number(id));
    if (!order) return null;
    if (updateData.payment_proof !== undefined) order.payment_proof = updateData.payment_proof;
    if (updateData.payment_status !== undefined) order.payment_status = updateData.payment_status;
    if (updateData.transaction_ref !== undefined) order.transaction_ref = updateData.transaction_ref;
    if (updateData.status !== undefined) order.status = updateData.status;
    if (updateData.admin_message !== undefined) order.admin_message = updateData.admin_message;
    order.updated_at = new Date();
    return order;
  }

  updateOrderStatus(id, status, admin_message = null) {
    const order = this.orders.find(o => o.id === Number(id));
    if (!order) return null;
    if (status) order.status = status;
    if (admin_message !== null && admin_message !== undefined) {
      order.admin_message = admin_message;
    }
    order.updated_at = new Date();

    // Also notify in order chat thread
    const chat = this.chats.find(c => c.order_id === Number(id));
    if (chat) {
      chat.messages.push({
        id: chat.messages.length + 1,
        sender: 'admin',
        sender_name: 'Support Admin',
        text: `Order status updated to: ${status.toUpperCase()}.${admin_message ? ` Message: ${admin_message}` : ''}`,
        timestamp: new Date()
      });
      chat.updated_at = new Date();
    }

    return order;
  }

  // Chats & Messaging System
  getChats(filters = {}) {
    let list = [...this.chats];
    if (filters.user_id && !filters.is_admin) {
      list = list.filter(c => c.user_id === Number(filters.user_id));
    }
    return list.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at));
  }

  getChatByOrderId(orderId) {
    let chat = this.chats.find(c => c.order_id === Number(orderId));
    if (!chat) {
      const order = this.getOrder(orderId);
      if (order) {
        chat = {
          id: this.nextChatId++,
          order_id: Number(orderId),
          user_id: order.user_id || 0,
          user_name: order.full_name || order.customer_name || 'Customer',
          user_email: order.customer_email || '',
          subject: `Order #${orderId} Inquiry`,
          created_at: new Date(),
          updated_at: new Date(),
          messages: [
            {
              id: 1,
              sender: 'system',
              sender_name: 'PC Store Bot',
              text: `Chat thread opened for Order #${orderId}.`,
              timestamp: new Date()
            }
          ]
        };
        this.chats.unshift(chat);
      }
    }
    return chat;
  }

  sendChatMessage({ order_id, user_id, sender, sender_name, text, attachments }) {
    let chat;
    if (order_id) {
      chat = this.getChatByOrderId(order_id);
    } else if (user_id) {
      chat = this.chats.find(c => c.user_id === Number(user_id) && !c.order_id);
      if (!chat) {
        const user = this.findUserById(user_id);
        chat = {
          id: this.nextChatId++,
          order_id: null,
          user_id: Number(user_id),
          user_name: user ? user.full_name : 'Customer',
          user_email: user ? user.email : '',
          subject: 'Customer Live Support',
          created_at: new Date(),
          updated_at: new Date(),
          messages: []
        };
        this.chats.unshift(chat);
      }
    } else {
      chat = this.chats[0];
    }

    if (!chat) return null;

    const isSenderAdmin = sender === 'admin' || (sender_name && (sender_name.toLowerCase().includes('admin') || sender_name.toLowerCase().includes('support')));
    const finalSender = isSenderAdmin ? 'admin' : (sender || 'customer');
    const finalSenderName = isSenderAdmin ? 'Admin' : (sender_name || 'Customer');

    const newMessage = {
      id: (chat.messages.length || 0) + 1,
      sender: finalSender,
      sender_name: finalSenderName,
      text: text || '',
      attachments: attachments || null,
      is_read_by_admin: isSenderAdmin ? 1 : 0,
      is_read_by_customer: isSenderAdmin ? 0 : 1,
      timestamp: new Date()
    };

    chat.messages.push(newMessage);
    chat.updated_at = new Date();
    return { chat, message: newMessage };
  }

  markChatAsRead(orderId, role = 'admin') {
    const chat = this.chats.find(c => String(c.order_id) === String(orderId) || String(c.id) === String(orderId));
    if (!chat) return null;
    
    if (chat.messages) {
      chat.messages.forEach(m => {
        if (role === 'admin') {
          m.is_read_by_admin = 1;
        } else {
          m.is_read_by_customer = 1;
        }
      });
    }
    chat.updated_at = new Date();
    return chat;
  }

  markAllChatsAsRead(role = 'admin') {
    this.chats.forEach(chat => {
      if (chat.messages) {
        chat.messages.forEach(m => {
          if (role === 'admin') {
            m.is_read_by_admin = 1;
          } else {
            m.is_read_by_customer = 1;
          }
        });
      }
    });
    return true;
  }

  markAllContactMessagesAsRead() {
    this.contact_messages.forEach(m => {
      m.is_read = 1;
    });
    return true;
  }

  dismissAlert(alertId) {
    if (!this.dismissedAlerts) this.dismissedAlerts = new Set();
    this.dismissedAlerts.add(String(alertId));
    
    if (String(alertId).startsWith('contact-')) {
      const id = String(alertId).replace('contact-', '');
      this.markMessageAsRead(id);
    }
    if (String(alertId).startsWith('chat-') || String(alertId).startsWith('user-chat-')) {
      const parts = String(alertId).split('-');
      if (parts.length >= 2) {
        const orderId = parts[parts.length - 2];
        this.markChatAsRead(orderId, 'admin');
        this.markChatAsRead(orderId, 'customer');
      }
    }
    return true;
  }

  clearAllNotifications(user = null) {
    if (!this.dismissedAlerts) this.dismissedAlerts = new Set();
    this.markAllChatsAsRead('admin');
    this.markAllChatsAsRead('customer');
    this.markAllContactMessagesAsRead();
    this.orders.forEach(o => {
      o.user_notified = true;
    });
    return true;
  }

  // Get notifications count & list for both Admin and Customer
  getNotifications(user = null) {
    if (!this.dismissedAlerts) this.dismissedAlerts = new Set();

    if (!user) {
      return {
        is_admin: false,
        unread_messages: 0,
        pending_approvals: 0,
        pending_orders: 0,
        unread_inquiries: 0,
        total: 0,
        alerts: []
      };
    }

    const isAdmin = Boolean(user.role === 'admin' || user.is_admin);
    
    if (isAdmin) {
      // Pending receipts needing approval
      const pendingApprovalOrders = this.orders.filter(o => o.payment_status === 'proof_uploaded' || (o.payment_proof && o.payment_status !== 'approved'));
      const pendingOrders = this.orders.filter(o => o.status === 'pending');
      const unreadContactMsgs = this.contact_messages.filter(m => !m.is_read || m.is_read === 0);
      
      // Customer messages in order chats that haven't been read by admin
      let unreadChatCount = 0;
      let rawAlerts = [];

      for (const chat of this.chats) {
        const unreadMsgs = (chat.messages || []).filter(m => m.sender === 'customer' && !m.is_read_by_admin);
        if (unreadMsgs.length > 0) {
          unreadChatCount += unreadMsgs.length;
          const lastMsg = unreadMsgs[unreadMsgs.length - 1];
          rawAlerts.push({
            id: `chat-${chat.order_id || chat.id}-${lastMsg.id}`,
            type: 'chat',
            title: `Customer Message on Order #${chat.order_id || chat.id}`,
            description: `${lastMsg.sender_name || 'Customer'}: "${lastMsg.text?.slice(0, 50)}..."`,
            time: lastMsg.timestamp,
            target: 'messages',
            order_id: chat.order_id
          });
        }
      }

      for (const ord of pendingApprovalOrders) {
        rawAlerts.push({
          id: `order-proof-${ord.id}`,
          type: 'payment_proof',
          title: `Payment Receipt Needs Approval (Order #${ord.id})`,
          description: `${ord.customer_name || 'Customer'} uploaded ${ord.payment_method} receipt (${Number(ord.total_amount).toLocaleString()} ETB)`,
          time: ord.updated_at || ord.created_at,
          target: 'orders',
          order_id: ord.id
        });
      }

      for (const msg of unreadContactMsgs) {
        rawAlerts.push({
          id: `contact-${msg.id}`,
          type: 'contact',
          title: `Contact Inquiry: ${msg.subject || 'General'}`,
          description: `${msg.name}: "${msg.message?.slice(0, 50)}..."`,
          time: msg.created_at,
          target: 'messages'
        });
      }

      const activeAlerts = rawAlerts.filter(a => !this.dismissedAlerts.has(String(a.id)));

      return {
        is_admin: true,
        unread_messages: unreadChatCount,
        pending_approvals: pendingApprovalOrders.length,
        pending_orders: pendingOrders.length,
        unread_inquiries: unreadContactMsgs.length,
        total: activeAlerts.length,
        alerts: activeAlerts.slice(0, 10)
      };
    } else {
      // Customer Notifications
      const userId = user ? user.id : 2;
      const userOrders = this.orders.filter(o => o.user_id === Number(userId));
      const userChats = this.chats.filter(c => c.user_id === Number(userId) || userOrders.some(o => o.id === c.order_id));
      
      let unreadChatCount = 0;
      let rawAlerts = [];

      for (const chat of userChats) {
        const unreadMsgs = (chat.messages || []).filter(m => m.sender === 'admin' && !m.is_read_by_customer);
        if (unreadMsgs.length > 0) {
          unreadChatCount += unreadMsgs.length;
          const lastMsg = unreadMsgs[unreadMsgs.length - 1];
          rawAlerts.push({
            id: `user-chat-${chat.order_id || chat.id}-${lastMsg.id}`,
            type: 'chat',
            title: `Admin Reply on Order #${chat.order_id || chat.id}`,
            description: `Admin: "${lastMsg.text?.slice(0, 55)}..."`,
            time: lastMsg.timestamp,
            target: 'orders',
            order_id: chat.order_id
          });
        }
      }

      for (const ord of userOrders) {
        if (ord.payment_status === 'approved' && !ord.user_notified) {
          rawAlerts.push({
            id: `user-approved-${ord.id}`,
            type: 'approval',
            title: `🎉 Payment Approved for Order #${ord.id}`,
            description: `Your payment was verified by Admin! Order is now in ${ord.status} state.`,
            time: ord.updated_at,
            target: 'orders',
            order_id: ord.id
          });
        }
      }

      const activeAlerts = rawAlerts.filter(a => !this.dismissedAlerts.has(String(a.id)));

      return {
        is_admin: false,
        unread_messages: unreadChatCount,
        total: activeAlerts.length,
        alerts: activeAlerts.slice(0, 10)
      };
    }
  }

  // Contact Messages
  getContactMessages() {
    return [...this.contact_messages].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }

  createContactMessage(data) {
    const msg = {
      id: this.nextContactId++,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      is_read: 0,
      created_at: new Date()
    };
    this.contact_messages.unshift(msg);
    return msg;
  }

  markMessageAsRead(id) {
    const msg = this.contact_messages.find(m => m.id === Number(id));
    if (msg) msg.is_read = 1;
    return msg;
  }

  deleteContactMessage(id) {
    const idx = this.contact_messages.findIndex(m => m.id === Number(id));
    if (idx !== -1) {
      this.contact_messages.splice(idx, 1);
      return true;
    }
    return false;
  }

  // Dashboard Stats
  getStats() {
    const totalUsers = this.users.filter(u => u.role === 'user').length;
    const totalProducts = this.products.length;
    const totalOrders = this.orders.length;
    const totalRevenue = this.orders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.total_amount || 0), 0);
    const totalMessages = this.contact_messages.filter(m => m.is_read === 0).length;

    const pendingCount = this.orders.filter(o => o.status === 'pending').length;
    const processingCount = this.orders.filter(o => o.status === 'processing').length;
    const shippedCount = this.orders.filter(o => o.status === 'shipped').length;
    const deliveredCount = this.orders.filter(o => o.status === 'delivered').length;
    const cancelledCount = this.orders.filter(o => o.status === 'cancelled').length;

    return {
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      totalMessages,
      pendingCount,
      processingCount,
      shippedCount,
      deliveredCount,
      cancelledCount,
      recentOrders: this.getOrders().slice(0, 5)
    };
  }
}

export const store = new InMemoryStore();
