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
    temporaryEmailNotAllowed: string;
    temporaryEmailError: string;
    joinFamily: string;
    startJourney: string;
  };

  // Auth Layout
  authLayout: {
    customDesign: {
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
    stats: {
      brandPartner: string;
      productsCompleted: string;
      yearsExperience: string;
    };
    termsAndPrivacy: string;
    termsOfService: string;
    privacyPolicy: string;
    and: string;
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
      loading: 'Sedang memuat...',
      save: 'Simpan',
      cancel: 'Batal',
      delete: 'Hapus',
      edit: 'Ubah',
      add: 'Tambah',
      confirm: 'Konfirmasi',
      back: 'Kembali',
      next: 'Lanjut',
      previous: 'Sebelumnya',
      search: 'Cari',
      filter: 'Saring',
      sort: 'Urutkan',
      export: 'Ekspor',
      import: 'Impor',
      refresh: 'Perbarui',
      close: 'Tutup',
      open: 'Buka',
      view: 'Lihat',
      download: 'Unduh',
      upload: 'Unggah',
      submit: 'Kirim',
      reset: 'Atur Ulang',
      clear: 'Hapus Semua',
      select: 'Pilih',
      selectAll: 'Pilih Semua',
      deselectAll: 'Batal Pilih Semua',
      yes: 'Ya',
      no: 'Tidak',
      ok: 'Baik',
      error: 'Terjadi Kesalahan',
      success: 'Berhasil',
      warning: 'Peringatan',
      info: 'Informasi',
    },
    nav: {
      home: 'Beranda',
      dashboard: 'Dasbor',
      orders: 'Pesanan',
      materials: 'Bahan',
      inventory: 'Stok',
      customers: 'Pelanggan',
      reports: 'Laporan',
      production: 'Produksi',
      archive: 'Arsip',
      profile: 'Profil',
      settings: 'Pengaturan',
      logout: 'Keluar',
      login: 'Masuk',
      register: 'Daftar',
      features: 'Fitur Unggulan',
      about: 'Tentang Kami',
      testimonials: 'Testimoni',
      faq: 'Tanya Jawab',
    },
    auth: {
      signIn: 'Masuk',
      signUp: 'Daftar',
      signOut: 'Keluar',
      email: 'Email',
      password: 'Kata Sandi',
      confirmPassword: 'Konfirmasi Kata Sandi',
      forgotPassword: 'Lupa kata sandi?',
      resetPassword: 'Atur Ulang Kata Sandi',
      rememberMe: 'Ingat saya',
      alreadyHaveAccount: 'Sudah punya akun?',
      dontHaveAccount: 'Belum punya akun?',
      createAccount: 'Buat Akun Baru',
      welcomeBack: 'Selamat datang kembali!',
      getStarted: 'Mulai sekarang',
      emailRequired: 'Email harus diisi',
      passwordRequired: 'Kata sandi harus diisi',
      passwordTooShort: 'Kata sandi terlalu pendek',
      passwordsDoNotMatch: 'Kata sandi tidak sama',
      invalidEmail: 'Format email tidak benar',
      invalidCredentials: 'Email atau kata sandi salah',
      accountCreated: 'Akun berhasil dibuat',
      passwordReset: 'Kata sandi berhasil diperbarui',
      checkEmail: 'Silakan cek email Anda',
      temporaryEmailNotAllowed: 'Email sementara tidak diperbolehkan',
      temporaryEmailError: 'Email sementara tidak diperbolehkan. Gunakan email permanen agar kami dapat mengirim update pesanan dan berkomunikasi dengan baik.',
      joinFamily: 'Bergabung dengan Keluarga Rafsakaos',
      startJourney: 'Buat akun dan mulai perjalanan konveksi custom Anda hari ini',
    },

    // Auth Layout
    authLayout: {
      customDesign: {
        title: 'Desain Custom',
        description: 'Desain custom sesuai kebutuhan brand Anda dengan konsultasi gratis dari tim ahli kami',
      },
      qualityMaterials: {
        title: 'Bahan Berkualitas',
        description: 'Menggunakan bahan berkualitas premium dengan standar internasional untuk hasil terbaik',
      },
      fastProduction: {
        title: 'Produksi Cepat',
        description: 'Produksi cepat dengan teknologi modern dan sistem manajemen yang efisien',
      },
      stats: {
        brandPartner: 'Brand Partner',
        productsCompleted: 'Produk Selesai',
        yearsExperience: 'Tahun Pengalaman',
      },
      termsAndPrivacy: 'Dengan melanjutkan, Anda menyetujui',
      termsOfService: 'Syarat & Ketentuan',
      privacyPolicy: 'Kebijakan Privasi',
      and: 'dan',
    },
    home: {
      hero: {
        badge: '🚀 Manufaktur Pakaian Profesional',
        title: 'Buat Pakaian Custom',
        titleHighlight: 'Jadi Mudah',
        description: 'Layanan produksi pakaian profesional untuk brand Anda. Bahan berkualitas tinggi, pengrajin berpengalaman, dan pengiriman terpercaya dengan tracking real-time.',
        rating: '4.9/5',
        ratingText: 'dari 200+ pelanggan yang puas',
        startProject: 'Mulai Proyek Anda',
        signIn: 'Masuk',
        qualityGuaranteed: 'Kualitas Terjamin',
        fastProduction: 'Produksi Cepat',
      },
      features: {
        badge: '✨ Mengapa Pilih Kami?',
        title: 'Semua yang Anda Butuhkan untuk',
        titleHighlight: ' Produksi Custom',
        description: 'Mulai dari upload desain sampai pengiriman produk jadi, kami sediakan solusi lengkap untuk kebutuhan pakaian custom Anda.',
        customerCentric: {
          title: 'Mengutamakan Pelanggan',
          description: 'Dukungan penuh selama proses produksi dengan notifikasi dan update real-time yang transparan.',
        },
        qualityMaterials: {
          title: 'Bahan Berkualitas Tinggi',
          description: 'Kain premium seperti Cotton Combed, Denim, Rayon, dan Linen untuk hasil produk yang terbaik.',
        },
        fastProduction: {
          title: 'Produksi Cepat',
          description: 'Proses produksi yang efisien dengan waktu pengerjaan 7-14 hari dan tracking progress yang jelas.',
        },
        qualityGuarantee: {
          title: 'Garansi Kualitas',
          description: '100% jaminan kualitas dengan garansi ganti rugi jika produk tidak sesuai standar yang dijanjikan.',
        },
        realTimeUpdates: {
          title: 'Update Langsung',
          description: 'Selalu tahu perkembangan pesanan Anda dengan notifikasi langsung untuk setiap tahap produksi.',
        },
        professionalTeam: {
          title: 'Tim Ahli',
          description: 'Pengrajin berpengalaman dan tim quality control yang memastikan setiap produk berkualitas tinggi.',
        },
      },
      about: {
        badge: '🏭 Cerita Kami',
        title: 'Berkomitmen pada Kualitas Sejak',
        titleHighlight: 'Hari Pertama',
        description: 'Dengan pengalaman bertahun-tahun di bidang manufaktur pakaian, kami sudah menguasai seni produksi pakaian custom. Fasilitas modern dan pengrajin ahli kami pastikan setiap produk memenuhi standar terbaik.',
        stats: {
          projectsCompleted: 'Proyek Selesai',
          customerSatisfaction: 'Tingkat Kepuasan',
          partnerBrands: 'Brand Mitra',
          yearsExperience: 'Tahun Berpengalaman',
        },
      },
      testimonials: {
        badge: '💬 Kata Mereka',
        title: 'Dipercaya oleh',
        titleHighlight: ' Brand Ternama',
        description: 'Lebih dari 200 pelanggan sudah mempercayai kami untuk produksi pakaian brand mereka.',
        viewAllTestimonials: 'Lihat Semua Testimoni',
      },
      faq: {
        badge: '❓ Tanya Jawab',
        title: 'Pertanyaan yang',
        titleHighlight: ' Sering Ditanyakan',
        description: 'Cari tahu jawaban dari pertanyaan-pertanyaan umum seputar layanan produksi kami.',
      },
      cta: {
        title: 'Siap Mulai Proyek Anda?',
        description: 'Gabung dengan ratusan brand yang sudah percaya sama kami untuk produksi pakaian mereka.',
        startNow: 'Mulai Sekarang',
        learnMore: 'Pelajari Lebih Lanjut',
      },
      footer: {
        description: 'Layanan produksi pakaian profesional dengan kualitas terjamin dan support 24/7.',
        allRightsReserved: 'Seluruh hak cipta dilindungi.',
      },
    },
    orders: {
      title: 'Pesanan',
      newOrder: 'Pesanan Baru',
      orderHistory: 'Riwayat Pesanan',
      orderDetails: 'Detail Pesanan',
      orderStatus: 'Status Pesanan',
      orderDate: 'Tanggal Pesan',
      deliveryDate: 'Tanggal Kirim',
      totalAmount: 'Total Harga',
      quantity: 'Jumlah',
      material: 'Bahan',
      design: 'Desain',
      notes: 'Catatan',
      payment: 'Pembayaran',
      paymentMethod: 'Cara Bayar',
      paymentStatus: 'Status Bayar',
      shippingAddress: 'Alamat Kirim',
      trackingNumber: 'Nomor Resi',
      createOrder: 'Buat Pesanan',
      updateOrder: 'Perbarui Pesanan',
      cancelOrder: 'Batalkan Pesanan',
      confirmOrder: 'Konfirmasi Pesanan',
      viewOrder: 'Lihat Pesanan',
      downloadInvoice: 'Unduh Invoice',
      status: {
        pending: 'Menunggu',
        confirmed: 'Dikonfirmasi',
        inProduction: 'Sedang Diproduksi',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
        shipped: 'Dikirim',
        delivered: 'Sampai Tujuan',
      },
    },
    materials: {
      title: 'Bahan',
      addMaterial: 'Tambah Bahan',
      editMaterial: 'Edit Bahan',
      deleteMaterial: 'Hapus Bahan',
      materialName: 'Nama Bahan',
      materialType: 'Jenis Bahan',
      price: 'Harga',
      pricePerUnit: 'Harga per Unit',
      stock: 'Stok',
      description: 'Deskripsi',
      availability: 'Ketersediaan',
      specifications: 'Spesifikasi',
      color: 'Warna',
      size: 'Ukuran',
      weight: 'Berat',
      category: 'Kategori',
      supplier: 'Pemasok',
      minimumOrder: 'Minimum Order',
      estimatedDelivery: 'Estimasi Pengiriman',
      available: 'Tersedia',
      outOfStock: 'Habis',
      lowStock: 'Stok Menipis',
    },
    faqData: {
      questions: [
        {
          question: 'Berapa minimum order untuk produksi custom?',
          answer: 'Minimum order kami adalah 24 pcs per desain. Ini biar produksi lebih efisien dan harga jadi lebih kompetitif buat pelanggan.',
        },
        {
          question: 'Berapa lama waktu produksinya?',
          answer: 'Waktu produksi standar 7-14 hari kerja, tergantung rumitnya desain dan jumlah pesanan. Kami kasih estimasi yang akurat setelah review detail pesanan Anda.',
        },
        {
          question: 'Bahan apa aja yang tersedia?',
          answer: 'Kami sedia berbagai bahan berkualitas tinggi seperti Cotton Combed 24s, Cotton Combed 30s, Denim, Rayon, dan Linen. Setiap bahan punya karakteristik dan harga yang berbeda.',
        },
        {
          question: 'Gimana cara upload desain?',
          answer: 'Anda bisa upload desain dalam format PNG, JPG, atau PDF lewat platform kami. Tim kami akan review desain dan kasih feedback kalau perlu ada penyesuaian untuk produksi.',
        },
        {
          question: 'Ada garansi kualitas nggak?',
          answer: 'Tentu ada! Kami kasih garansi kualitas untuk semua produk. Kalau ada masalah kualitas, kami akan ganti atau perbaiki tanpa biaya tambahan.',
        },
        {
          question: 'Sistem pembayarannya gimana?',
          answer: 'Kami pakai sistem pembayaran yang aman. Pembayaran dilakukan setelah konfirmasi pesanan, dan Anda akan dapat kode unik untuk transfer bank.',
        },
      ],
    },
    validation: {
      required: 'Kolom ini harus diisi',
      invalidEmail: 'Format email tidak benar',
      minLength: 'Minimal {count} karakter',
      maxLength: 'Maksimal {count} karakter',
      passwordMismatch: 'Kata sandi tidak sama',
      invalidNumber: 'Harus berupa angka',
      invalidUrl: 'Format URL tidak benar',
      invalidPhone: 'Nomor telepon tidak benar',
      invalidDate: 'Format tanggal tidak benar',
    },
    notifications: {
      orderCreated: 'Pesanan berhasil dibuat',
      orderUpdated: 'Pesanan berhasil diperbarui',
      orderCancelled: 'Pesanan dibatalkan',
      paymentReceived: 'Pembayaran sudah diterima',
      productionStarted: 'Produksi sudah dimulai',
      productionCompleted: 'Produksi sudah selesai',
      orderShipped: 'Pesanan sudah dikirim',
      orderDelivered: 'Pesanan sudah sampai',
      materialAdded: 'Bahan berhasil ditambahkan',
      materialUpdated: 'Bahan berhasil diperbarui',
      materialDeleted: 'Bahan berhasil dihapus',
      stockUpdated: 'Stok berhasil diperbarui',
      lowStockAlert: 'Peringatan: Stok menipis',
      outOfStockAlert: 'Peringatan: Stok habis',
    },
    dashboard: {
      welcome: 'Selamat datang',
      overview: 'Ringkasan',
      recentOrders: 'Pesanan Terbaru',
      totalOrders: 'Total Pesanan',
      totalRevenue: 'Total Pendapatan',
      totalCustomers: 'Total Pelanggan',
      productionQueue: 'Antrian Produksi',
      quickActions: 'Aksi Cepat',
      viewAllOrders: 'Lihat Semua Pesanan',
      viewReports: 'Lihat Laporan',
      manageInventory: 'Kelola Stok',
      addMaterial: 'Tambah Bahan',
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
      temporaryEmailNotAllowed: 'Temporary email not allowed',
      temporaryEmailError: 'Temporary email addresses are not allowed. Please use a permanent email address for better communication and order updates.',
      joinFamily: 'Join the Rafsakaos Family',
      startJourney: 'Create your account and start your custom clothing journey today',
    },

    // Auth Layout
    authLayout: {
      customDesign: {
        title: 'Custom Design',
        description: 'Custom designs tailored to your brand needs with free consultation from our expert team',
      },
      qualityMaterials: {
        title: 'Quality Materials',
        description: 'Using premium quality materials with international standards for the best results',
      },
      fastProduction: {
        title: 'Fast Production',
        description: 'Fast production with modern technology and efficient management systems',
      },
      stats: {
        brandPartner: 'Brand Partners',
        productsCompleted: 'Products Completed',
        yearsExperience: 'Years Experience',
      },
      termsAndPrivacy: 'By continuing, you agree to our',
      termsOfService: 'Terms of Service',
      privacyPolicy: 'Privacy Policy',
      and: 'and',
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