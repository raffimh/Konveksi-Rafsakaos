export type Language = 'id' | 'en';

export interface Translations {
  // Common
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    confirm: string;
    back: string;
    next: string;
    previous: string;
    search: string;
    filter: string;
    sort: string;
    export: string;
    import: string;
    refresh: string;
    close: string;
    open: string;
    view: string;
    download: string;
    upload: string;
    submit: string;
    reset: string;
    clear: string;
    select: string;
    selectAll: string;
    deselectAll: string;
    yes: string;
    no: string;
    ok: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };

  // Navigation
  nav: {
    home: string;
    dashboard: string;
    orders: string;
    materials: string;
    inventory: string;
    customers: string;
    reports: string;
    production: string;
    archive: string;
    profile: string;
    settings: string;
    logout: string;
    login: string;
    register: string;
    features: string;
    about: string;
    testimonials: string;
    faq: string;
  };

  // Authentication
  auth: {
    signIn: string;
    signUp: string;
    signOut: string;
    email: string;
    password: string;
    confirmPassword: string;
    forgotPassword: string;
    resetPassword: string;
    rememberMe: string;
    alreadyHaveAccount: string;
    dontHaveAccount: string;
    createAccount: string;
    welcomeBack: string;
    getStarted: string;
    emailRequired: string;
    passwordRequired: string;
    passwordTooShort: string;
    passwordsDoNotMatch: string;
    invalidEmail: string;
    invalidCredentials: string;
    accountCreated: string;
    passwordReset: string;
    checkEmail: string;
  };

  // Home Page
  home: {
    hero: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
      rating: string;
      ratingText: string;
      startProject: string;
      signIn: string;
      qualityGuaranteed: string;
      fastProduction: string;
    };
    features: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
      customerCentric: {
        title: string;
        description: string;
      };
      qualityMaterials: {
        title: string;
        description: string;
      };
      fastProduction: {
        title: string;
        description: string;
      };
      qualityGuarantee: {
        title: string;
        description: string;
      };
      realTimeUpdates: {
        title: string;
        description: string;
      };
      professionalTeam: {
        title: string;
        description: string;
      };
    };
    about: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
      stats: {
        projectsCompleted: string;
        customerSatisfaction: string;
        partnerBrands: string;
        yearsExperience: string;
      };
    };
    testimonials: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
      viewAllTestimonials: string;
    };
    faq: {
      badge: string;
      title: string;
      titleHighlight: string;
      description: string;
    };
    cta: {
      title: string;
      description: string;
      startNow: string;
      learnMore: string;
    };
    footer: {
      description: string;
      allRightsReserved: string;
    };
  };

  // Orders
  orders: {
    title: string;
    newOrder: string;
    orderHistory: string;
    orderDetails: string;
    orderStatus: string;
    orderDate: string;
    deliveryDate: string;
    totalAmount: string;
    quantity: string;
    material: string;
    design: string;
    notes: string;
    payment: string;
    paymentMethod: string;
    paymentStatus: string;
    shippingAddress: string;
    trackingNumber: string;
    createOrder: string;
    updateOrder: string;
    cancelOrder: string;
    confirmOrder: string;
    viewOrder: string;
    downloadInvoice: string;
    status: {
      pending: string;
      confirmed: string;
      inProduction: string;
      completed: string;
      cancelled: string;
      shipped: string;
      delivered: string;
    };
  };

  // Materials
  materials: {
    title: string;
    addMaterial: string;
    editMaterial: string;
    deleteMaterial: string;
    materialName: string;
    materialType: string;
    price: string;
    pricePerUnit: string;
    stock: string;
    description: string;
    availability: string;
    specifications: string;
    color: string;
    size: string;
    weight: string;
    category: string;
    supplier: string;
    minimumOrder: string;
    estimatedDelivery: string;
    available: string;
    outOfStock: string;
    lowStock: string;
  };

  // FAQ Data
  faqData: {
    questions: Array<{
      question: string;
      answer: string;
    }>;
  };

  // Form Validation
  validation: {
    required: string;
    invalidEmail: string;
    minLength: string;
    maxLength: string;
    passwordMismatch: string;
    invalidNumber: string;
    invalidUrl: string;
    invalidPhone: string;
    invalidDate: string;
  };

  // Notifications
  notifications: {
    orderCreated: string;
    orderUpdated: string;
    orderCancelled: string;
    paymentReceived: string;
    productionStarted: string;
    productionCompleted: string;
    orderShipped: string;
    orderDelivered: string;
    materialAdded: string;
    materialUpdated: string;
    materialDeleted: string;
    stockUpdated: string;
    lowStockAlert: string;
    outOfStockAlert: string;
  };

  // Dashboard
  dashboard: {
    welcome: string;
    overview: string;
    recentOrders: string;
    totalOrders: string;
    totalRevenue: string;
    totalCustomers: string;
    productionQueue: string;
    quickActions: string;
    viewAllOrders: string;
    viewReports: string;
    manageInventory: string;
    addMaterial: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    common: {
      loading: 'Memuat...',
      save: 'Simpan',
      cancel: 'Batal',
      delete: 'Hapus',
      edit: 'Edit',
      add: 'Tambah',
      confirm: 'Konfirmasi',
      back: 'Kembali',
      next: 'Selanjutnya',
      previous: 'Sebelumnya',
      search: 'Cari',
      filter: 'Filter',
      sort: 'Urutkan',
      export: 'Ekspor',
      import: 'Impor',
      refresh: 'Muat Ulang',
      close: 'Tutup',
      open: 'Buka',
      view: 'Lihat',
      download: 'Unduh',
      upload: 'Unggah',
      submit: 'Kirim',
      reset: 'Reset',
      clear: 'Bersihkan',
      select: 'Pilih',
      selectAll: 'Pilih Semua',
      deselectAll: 'Batalkan Semua',
      yes: 'Ya',
      no: 'Tidak',
      ok: 'OK',
      error: 'Error',
      success: 'Berhasil',
      warning: 'Peringatan',
      info: 'Informasi',
    },
    nav: {
      home: 'Beranda',
      dashboard: 'Dashboard',
      orders: 'Pesanan',
      materials: 'Material',
      inventory: 'Inventori',
      customers: 'Pelanggan',
      reports: 'Laporan',
      production: 'Produksi',
      archive: 'Arsip',
      profile: 'Profil',
      settings: 'Pengaturan',
      logout: 'Keluar',
      login: 'Masuk',
      register: 'Daftar',
      features: 'Fitur',
      about: 'Tentang',
      testimonials: 'Testimoni',
      faq: 'FAQ',
    },
    auth: {
      signIn: 'Masuk',
      signUp: 'Daftar',
      signOut: 'Keluar',
      email: 'Email',
      password: 'Kata Sandi',
      confirmPassword: 'Konfirmasi Kata Sandi',
      forgotPassword: 'Lupa Kata Sandi?',
      resetPassword: 'Reset Kata Sandi',
      rememberMe: 'Ingat Saya',
      alreadyHaveAccount: 'Sudah punya akun?',
      dontHaveAccount: 'Belum punya akun?',
      createAccount: 'Buat Akun',
      welcomeBack: 'Selamat Datang Kembali',
      getStarted: 'Mulai Sekarang',
      emailRequired: 'Email wajib diisi',
      passwordRequired: 'Kata sandi wajib diisi',
      passwordTooShort: 'Kata sandi terlalu pendek',
      passwordsDoNotMatch: 'Kata sandi tidak cocok',
      invalidEmail: 'Format email tidak valid',
      invalidCredentials: 'Email atau kata sandi salah',
      accountCreated: 'Akun berhasil dibuat',
      passwordReset: 'Kata sandi berhasil direset',
      checkEmail: 'Periksa email Anda',
    },
    home: {
      hero: {
        badge: '🚀 Manufaktur Pakaian Profesional',
        title: 'Pakaian Custom',
        titleHighlight: 'Jadi Mudah',
        description: 'Layanan produksi pakaian profesional untuk brand Anda. Material berkualitas, keahlian ahli, dan pengiriman tepercaya dengan pelacakan real-time.',
        rating: '4.9/5',
        ratingText: 'dari 200+ pelanggan puas',
        startProject: 'Mulai Proyek Anda',
        signIn: 'Masuk',
        qualityGuaranteed: 'Kualitas Terjamin',
        fastProduction: 'Produksi Cepat',
      },
      features: {
        badge: '✨ Mengapa Memilih Kami',
        title: 'Semua yang Anda Butuhkan untuk',
        titleHighlight: ' Produksi Custom',
        description: 'Dari upload desain hingga pengiriman final, kami menyediakan solusi end-to-end untuk kebutuhan pakaian custom Anda.',
        customerCentric: {
          title: 'Berpusat pada Pelanggan',
          description: 'Dukungan khusus sepanjang perjalanan produksi Anda dengan notifikasi dan update real-time.',
        },
        qualityMaterials: {
          title: 'Material Berkualitas',
          description: 'Kain premium termasuk Cotton Combed, Denim, Rayon, dan Linen untuk produk yang superior.',
        },
        fastProduction: {
          title: 'Produksi Cepat',
          description: 'Manufaktur efisien dengan waktu penyelesaian 7-14 hari dan pelacakan progres transparan.',
        },
        qualityGuarantee: {
          title: 'Jaminan Kualitas',
          description: '100% jaminan kualitas dengan garansi penggantian jika produk tidak memenuhi standar.',
        },
        realTimeUpdates: {
          title: 'Update Real-time',
          description: 'Tetap terinformasi dengan notifikasi instan tentang status pesanan dan progres produksi.',
        },
        professionalTeam: {
          title: 'Tim Profesional',
          description: 'Pengrajin berpengalaman dan tim kontrol kualitas memastikan setiap produk mencapai keunggulan.',
        },
      },
      about: {
        badge: '🏭 Cerita Kami',
        title: 'Menghasilkan Kualitas Sejak',
        titleHighlight: 'Hari Pertama',
        description: 'Dengan pengalaman bertahun-tahun di manufaktur pakaian, kami telah menyempurnakan seni produksi pakaian custom. Fasilitas mutakhir dan pengrajin terampil kami memastikan setiap produk memenuhi standar tertinggi.',
        stats: {
          projectsCompleted: 'Proyek Selesai',
          customerSatisfaction: 'Kepuasan Pelanggan',
          partnerBrands: 'Brand Partner',
          yearsExperience: 'Tahun Pengalaman',
        },
      },
      testimonials: {
        badge: '💬 Apa Kata Mereka',
        title: 'Dipercaya oleh',
        titleHighlight: ' Brand Terkemuka',
        description: 'Lebih dari 200 pelanggan mempercayai kami untuk kebutuhan produksi pakaian mereka.',
        viewAllTestimonials: 'Lihat Semua Testimoni',
      },
      faq: {
        badge: '❓ FAQ',
        title: 'Pertanyaan yang',
        titleHighlight: ' Sering Ditanyakan',
        description: 'Temukan jawaban untuk pertanyaan umum tentang layanan produksi kami.',
      },
      cta: {
        title: 'Siap Memulai Proyek Anda?',
        description: 'Bergabunglah dengan ratusan brand yang telah mempercayai kami untuk kebutuhan produksi pakaian mereka.',
        startNow: 'Mulai Sekarang',
        learnMore: 'Pelajari Lebih Lanjut',
      },
      footer: {
        description: 'Layanan produksi pakaian profesional dengan kualitas terjamin dan dukungan 24/7.',
        allRightsReserved: 'Semua hak dilindungi.',
      },
    },
    orders: {
      title: 'Pesanan',
      newOrder: 'Pesanan Baru',
      orderHistory: 'Riwayat Pesanan',
      orderDetails: 'Detail Pesanan',
      orderStatus: 'Status Pesanan',
      orderDate: 'Tanggal Pesanan',
      deliveryDate: 'Tanggal Pengiriman',
      totalAmount: 'Total Jumlah',
      quantity: 'Kuantitas',
      material: 'Material',
      design: 'Desain',
      notes: 'Catatan',
      payment: 'Pembayaran',
      paymentMethod: 'Metode Pembayaran',
      paymentStatus: 'Status Pembayaran',
      shippingAddress: 'Alamat Pengiriman',
      trackingNumber: 'Nomor Pelacakan',
      createOrder: 'Buat Pesanan',
      updateOrder: 'Update Pesanan',
      cancelOrder: 'Batalkan Pesanan',
      confirmOrder: 'Konfirmasi Pesanan',
      viewOrder: 'Lihat Pesanan',
      downloadInvoice: 'Unduh Invoice',
      status: {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
        inProduction: 'Dalam Produksi',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
        shipped: 'Dikirim',
        delivered: 'Terkirim',
      },
    },
    materials: {
      title: 'Material',
      addMaterial: 'Tambah Material',
      editMaterial: 'Edit Material',
      deleteMaterial: 'Hapus Material',
      materialName: 'Nama Material',
      materialType: 'Jenis Material',
      price: 'Harga',
      pricePerUnit: 'Harga Per Unit',
      stock: 'Stok',
      description: 'Deskripsi',
      availability: 'Ketersediaan',
      specifications: 'Spesifikasi',
      color: 'Warna',
      size: 'Ukuran',
      weight: 'Berat',
      category: 'Kategori',
      supplier: 'Supplier',
      minimumOrder: 'Pesanan Minimum',
      estimatedDelivery: 'Estimasi Pengiriman',
      available: 'Tersedia',
      outOfStock: 'Stok Habis',
      lowStock: 'Stok Rendah',
    },
    faqData: {
      questions: [
        {
          question: 'Berapa pesanan minimum untuk produksi custom?',
          answer: 'Pesanan minimum kami adalah 24 pcs per desain. Ini memastikan efisiensi produksi dan harga yang kompetitif untuk pelanggan kami.',
        },
        {
          question: 'Berapa lama waktu produksi?',
          answer: 'Waktu produksi standar adalah 7-14 hari kerja, tergantung kompleksitas desain dan kuantitas pesanan. Kami memberikan estimasi akurat setelah meninjau detail pesanan Anda.',
        },
        {
          question: 'Material apa saja yang tersedia?',
          answer: 'Kami menyediakan berbagai material berkualitas tinggi termasuk Cotton Combed 24s, Cotton Combed 30s, Denim, Rayon, dan Linen. Setiap material memiliki karakteristik dan harga yang berbeda.',
        },
        {
          question: 'Bagaimana cara upload desain?',
          answer: 'Anda dapat upload desain dalam format PNG, JPG, atau PDF melalui platform kami. Tim kami akan meninjau desain dan memberikan feedback jika diperlukan penyesuaian untuk produksi.',
        },
        {
          question: 'Apakah ada jaminan kualitas?',
          answer: 'Ya, kami memberikan jaminan kualitas untuk semua produk. Jika ada masalah kualitas dengan produksi, kami akan mengganti atau memperbaiki tanpa biaya tambahan.',
        },
        {
          question: 'Bagaimana sistem pembayarannya?',
          answer: 'Kami menggunakan sistem pembayaran yang aman. Pembayaran dilakukan setelah konfirmasi pesanan, dan Anda akan menerima kode unik untuk transfer bank.',
        },
      ],
    },
    validation: {
      required: 'Field ini wajib diisi',
      invalidEmail: 'Format email tidak valid',
      minLength: 'Minimal {count} karakter',
      maxLength: 'Maksimal {count} karakter',
      passwordMismatch: 'Kata sandi tidak cocok',
      invalidNumber: 'Harus berupa angka',
      invalidUrl: 'URL tidak valid',
      invalidPhone: 'Nomor telepon tidak valid',
      invalidDate: 'Format tanggal tidak valid',
    },
    notifications: {
      orderCreated: 'Pesanan berhasil dibuat',
      orderUpdated: 'Pesanan berhasil diupdate',
      orderCancelled: 'Pesanan dibatalkan',
      paymentReceived: 'Pembayaran diterima',
      productionStarted: 'Produksi dimulai',
      productionCompleted: 'Produksi selesai',
      orderShipped: 'Pesanan dikirim',
      orderDelivered: 'Pesanan terkirim',
      materialAdded: 'Material berhasil ditambahkan',
      materialUpdated: 'Material berhasil diupdate',
      materialDeleted: 'Material berhasil dihapus',
      stockUpdated: 'Stok berhasil diupdate',
      lowStockAlert: 'Peringatan stok rendah',
      outOfStockAlert: 'Peringatan stok habis',
    },
    dashboard: {
      welcome: 'Selamat Datang',
      overview: 'Ringkasan',
      recentOrders: 'Pesanan Terbaru',
      totalOrders: 'Total Pesanan',
      totalRevenue: 'Total Pendapatan',
      totalCustomers: 'Total Pelanggan',
      productionQueue: 'Antrian Produksi',
      quickActions: 'Aksi Cepat',
      viewAllOrders: 'Lihat Semua Pesanan',
      viewReports: 'Lihat Laporan',
      manageInventory: 'Kelola Inventori',
      addMaterial: 'Tambah Material',
    },
  },
  en: {
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      add: 'Add',
      confirm: 'Confirm',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      export: 'Export',
      import: 'Import',
      refresh: 'Refresh',
      close: 'Close',
      open: 'Open',
      view: 'View',
      download: 'Download',
      upload: 'Upload',
      submit: 'Submit',
      reset: 'Reset',
      clear: 'Clear',
      select: 'Select',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      yes: 'Yes',
      no: 'No',
      ok: 'OK',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information',
    },
    nav: {
      home: 'Home',
      dashboard: 'Dashboard',
      orders: 'Orders',
      materials: 'Materials',
      inventory: 'Inventory',
      customers: 'Customers',
      reports: 'Reports',
      production: 'Production',
      archive: 'Archive',
      profile: 'Profile',
      settings: 'Settings',
      logout: 'Logout',
      login: 'Login',
      register: 'Register',
      features: 'Features',
      about: 'About',
      testimonials: 'Testimonials',
      faq: 'FAQ',
    },
    auth: {
      signIn: 'Sign In',
      signUp: 'Sign Up',
      signOut: 'Sign Out',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      forgotPassword: 'Forgot Password?',
      resetPassword: 'Reset Password',
      rememberMe: 'Remember Me',
      alreadyHaveAccount: 'Already have an account?',
      dontHaveAccount: "Don't have an account?",
      createAccount: 'Create Account',
      welcomeBack: 'Welcome Back',
      getStarted: 'Get Started',
      emailRequired: 'Email is required',
      passwordRequired: 'Password is required',
      passwordTooShort: 'Password is too short',
      passwordsDoNotMatch: 'Passwords do not match',
      invalidEmail: 'Invalid email format',
      invalidCredentials: 'Invalid email or password',
      accountCreated: 'Account created successfully',
      passwordReset: 'Password reset successfully',
      checkEmail: 'Check your email',
    },
    home: {
      hero: {
        badge: '🚀 Professional Garment Manufacturing',
        title: 'Custom Clothing',
        titleHighlight: 'Made Simple',
        description: 'Professional garment production service for your brand. Quality materials, expert craftsmanship, and reliable delivery with real-time tracking.',
        rating: '4.9/5',
        ratingText: 'from 200+ happy customers',
        startProject: 'Start Your Project',
        signIn: 'Sign In',
        qualityGuaranteed: 'Quality Guaranteed',
        fastProduction: 'Fast Production',
      },
      features: {
        badge: '✨ Why Choose Us',
        title: 'Everything You Need for',
        titleHighlight: ' Custom Production',
        description: 'From design upload to final delivery, we provide end-to-end solutions for your custom clothing needs.',
        customerCentric: {
          title: 'Customer-Centric',
          description: 'Dedicated support throughout your production journey with real-time notifications and updates.',
        },
        qualityMaterials: {
          title: 'Quality Materials',
          description: 'Premium fabrics including Cotton Combed, Denim, Rayon, and Linen for superior products.',
        },
        fastProduction: {
          title: 'Fast Production',
          description: 'Efficient manufacturing with 7-14 days turnaround time and transparent progress tracking.',
        },
        qualityGuarantee: {
          title: 'Quality Guarantee',
          description: '100% quality assurance with replacement guarantee if products don\'t meet standards.',
        },
        realTimeUpdates: {
          title: 'Real-time Updates',
          description: 'Stay informed with instant notifications about your order status and production progress.',
        },
        professionalTeam: {
          title: 'Professional Team',
          description: 'Experienced craftsmen and quality control team ensuring every piece meets excellence.',
        },
      },
      about: {
        badge: '🏭 Our Story',
        title: 'Crafting Quality Since',
        titleHighlight: 'Day One',
        description: 'With years of experience in garment manufacturing, we\'ve perfected the art of custom clothing production. Our state-of-the-art facility and skilled craftsmen ensure every piece meets the highest standards.',
        stats: {
          projectsCompleted: 'Projects Completed',
          customerSatisfaction: 'Customer Satisfaction',
          partnerBrands: 'Partner Brands',
          yearsExperience: 'Years Experience',
        },
      },
      testimonials: {
        badge: '💬 What They Say',
        title: 'Trusted by',
        titleHighlight: ' Leading Brands',
        description: 'Over 200 customers trust us for their garment production needs.',
        viewAllTestimonials: 'View All Testimonials',
      },
      faq: {
        badge: '❓ FAQ',
        title: 'Frequently',
        titleHighlight: ' Asked Questions',
        description: 'Find answers to common questions about our production services.',
      },
      cta: {
        title: 'Ready to Start Your Project?',
        description: 'Join hundreds of brands who trust us for their garment production needs.',
        startNow: 'Start Now',
        learnMore: 'Learn More',
      },
      footer: {
        description: 'Professional garment production service with guaranteed quality and 24/7 support.',
        allRightsReserved: 'All rights reserved.',
      },
    },
    orders: {
      title: 'Orders',
      newOrder: 'New Order',
      orderHistory: 'Order History',
      orderDetails: 'Order Details',
      orderStatus: 'Order Status',
      orderDate: 'Order Date',
      deliveryDate: 'Delivery Date',
      totalAmount: 'Total Amount',
      quantity: 'Quantity',
      material: 'Material',
      design: 'Design',
      notes: 'Notes',
      payment: 'Payment',
      paymentMethod: 'Payment Method',
      paymentStatus: 'Payment Status',
      shippingAddress: 'Shipping Address',
      trackingNumber: 'Tracking Number',
      createOrder: 'Create Order',
      updateOrder: 'Update Order',
      cancelOrder: 'Cancel Order',
      confirmOrder: 'Confirm Order',
      viewOrder: 'View Order',
      downloadInvoice: 'Download Invoice',
      status: {
        pending: 'Pending',
        confirmed: 'Confirmed',
        inProduction: 'In Production',
        completed: 'Completed',
        cancelled: 'Cancelled',
        shipped: 'Shipped',
        delivered: 'Delivered',
      },
    },
    materials: {
      title: 'Materials',
      addMaterial: 'Add Material',
      editMaterial: 'Edit Material',
      deleteMaterial: 'Delete Material',
      materialName: 'Material Name',
      materialType: 'Material Type',
      price: 'Price',
      pricePerUnit: 'Price Per Unit',
      stock: 'Stock',
      description: 'Description',
      availability: 'Availability',
      specifications: 'Specifications',
      color: 'Color',
      size: 'Size',
      weight: 'Weight',
      category: 'Category',
      supplier: 'Supplier',
      minimumOrder: 'Minimum Order',
      estimatedDelivery: 'Estimated Delivery',
      available: 'Available',
      outOfStock: 'Out of Stock',
      lowStock: 'Low Stock',
    },
    faqData: {
      questions: [
        {
          question: 'What is the minimum order for custom production?',
          answer: 'Our minimum order is 24 pieces per design. This ensures production efficiency and competitive pricing for our customers.',
        },
        {
          question: 'How long does production take?',
          answer: 'Standard production time is 7-14 working days, depending on design complexity and order quantity. We provide accurate estimates after reviewing your order details.',
        },
        {
          question: 'What materials are available?',
          answer: 'We offer various high-quality materials including Cotton Combed 24s, Cotton Combed 30s, Denim, Rayon, and Linen. Each material has different characteristics and pricing.',
        },
        {
          question: 'How do I upload my design?',
          answer: 'You can upload designs in PNG, JPG, or PDF format through our platform. Our team will review your design and provide feedback if adjustments are needed for production.',
        },
        {
          question: 'Is there a quality guarantee?',
          answer: 'Yes, we provide quality guarantee for all products. If there are any quality issues with production, we will replace or repair at no additional cost.',
        },
        {
          question: 'How does the payment system work?',
          answer: 'We use a secure payment system. Payment is made after order confirmation, and you will receive a unique code for bank transfer.',
        },
      ],
    },
    validation: {
      required: 'This field is required',
      invalidEmail: 'Invalid email format',
      minLength: 'Minimum {count} characters',
      maxLength: 'Maximum {count} characters',
      passwordMismatch: 'Passwords do not match',
      invalidNumber: 'Must be a number',
      invalidUrl: 'Invalid URL',
      invalidPhone: 'Invalid phone number',
      invalidDate: 'Invalid date format',
    },
    notifications: {
      orderCreated: 'Order created successfully',
      orderUpdated: 'Order updated successfully',
      orderCancelled: 'Order cancelled',
      paymentReceived: 'Payment received',
      productionStarted: 'Production started',
      productionCompleted: 'Production completed',
      orderShipped: 'Order shipped',
      orderDelivered: 'Order delivered',
      materialAdded: 'Material added successfully',
      materialUpdated: 'Material updated successfully',
      materialDeleted: 'Material deleted successfully',
      stockUpdated: 'Stock updated successfully',
      lowStockAlert: 'Low stock alert',
      outOfStockAlert: 'Out of stock alert',
    },
    dashboard: {
      welcome: 'Welcome',
      overview: 'Overview',
      recentOrders: 'Recent Orders',
      totalOrders: 'Total Orders',
      totalRevenue: 'Total Revenue',
      totalCustomers: 'Total Customers',
      productionQueue: 'Production Queue',
      quickActions: 'Quick Actions',
      viewAllOrders: 'View All Orders',
      viewReports: 'View Reports',
      manageInventory: 'Manage Inventory',
      addMaterial: 'Add Material',
    },
  },
};