import { Currency, Language, PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Albanian book covers from public sources (placeholder URLs)
const bookCovers = [
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518373714866-3f1478910cc0?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=600&fit=crop',
  'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=600&fit=crop',
];

// Albanian authors and books data
const albanianBooksData = [
  {
    title: 'Kështjella',
    author: 'Kadare Ismail',
    description:
      'Një nga veprat më të famshme të letërsisë shqipe, që tregon historinë e një kështjelle në kohën e Skënderbeut.',
    price: 1200,
    language: Language.SQ,
    featured: true,
    category: 'Letërsi Klasike',
  },
  {
    title: 'Gjenerali i ushtrisë së vdekur',
    author: 'Kadare Ismail',
    description:
      'Roman historik që eksploron marrëdhëniet midis pushtetit dhe individit në Shqipërinë komuniste.',
    price: 1350,
    language: Language.SQ,
    featured: true,
    category: 'Letërsi Bashkëkohore',
  },
  {
    title: 'Kronikë në gur',
    author: 'Kadare Ismail',
    description:
      'Një vepër që kombinon historinë dhe fantazinë për të treguar jetën në një qytet të lashtë shqiptar.',
    price: 1100,
    language: Language.SQ,
    category: 'Letërsi Klasike',
  },
  {
    title: 'Toka jonë',
    author: 'Migjeni',
    description: 'Koleksion poezish që pasqyron realitetin social të Shqipërisë së viteve 1930.',
    price: 900,
    language: Language.SQ,
    featured: true,
    category: 'Poezi',
  },
  {
    title: 'Më jep emrin tënd',
    author: 'Visar Zhiti',
    description:
      'Koleksion i bukur poezish për dashurinë dhe jetën nga një nga poetët më të njohur shqiptarë.',
    price: 850,
    language: Language.SQ,
    category: 'Poezi',
  },
  {
    title: 'Spiritus',
    author: 'Visar Zhiti',
    description: 'Vepër që eksploron temat e lirisë dhe shpirtit njerëzor përmes poezisë.',
    price: 950,
    language: Language.SQ,
    category: 'Poezi',
  },
  {
    title: 'Fytyra e mijëvjeçarit të tretë',
    author: 'Dritëro Agolli',
    description: 'Roman që eksploron ndryshimet shoqërore në Shqipërinë moderne.',
    price: 1250,
    language: Language.SQ,
    category: 'Letërsi Bashkëkohore',
  },
  {
    title: 'Lumi i Vdekjes',
    author: 'Jakov Xoxa',
    description: 'Roman psikologjik që eksploron natyrën njerëzore dhe marrëdhëniet familjare.',
    price: 1050,
    language: Language.SQ,
    category: 'Letërsi Bashkëkohore',
  },
  {
    title: 'Histori e letërsisë shqipe',
    author: 'Rexhep Qosja',
    description:
      'Studim i plotë mbi zhvillimin e letërsisë shqipe nga fillimet deri në ditët e sotme.',
    price: 2200,
    language: Language.SQ,
    category: 'Studime Letrare',
  },
  {
    title: 'Shkëlqimi dhe rënia e shoqërisë shqiptare',
    author: 'Rexhep Qosja',
    description: 'Analizë e thellë e zhvillimeve shoqërore dhe kulturore në Shqipëri.',
    price: 1800,
    language: Language.SQ,
    category: 'Studime Shoqërore',
  },
  {
    title: 'Albanians and Their Territories',
    author: 'Robert Elsie',
    description:
      'Comprehensive study of Albanian history and territories throughout the centuries.',
    price: 2500,
    language: Language.EN,
    category: 'Historia',
  },
  {
    title: 'Dictionary of Albanian Religion',
    author: 'Robert Elsie',
    description: 'Complete guide to religious beliefs and practices in Albanian culture.',
    price: 3200,
    language: Language.EN,
    category: 'Feja dhe Kultura',
  },
  {
    title: 'Të dhëna për studime shqiptare',
    author: 'Eqrem Çabej',
    description: 'Koleksion i rëndësishëm studimesh gjuhësore dhe kulturore shqiptare.',
    price: 2800,
    language: Language.SQ,
    category: 'Gjuhësi',
  },
  {
    title: 'Fjalor etimologjik i gjuhës shqipe',
    author: 'Eqrem Çabej',
    description: 'Fjalor i plotë që eksploron origjinën e fjalëve në gjuhën shqipe.',
    price: 4200,
    language: Language.SQ,
    featured: true,
    category: 'Gjuhësi',
  },
  {
    title: 'Kanuni i Lekë Dukagjinit',
    author: 'Shtjefën Gjeçov',
    description: 'Koleksion i zakoneve dhe traditave të popullit shqiptar.',
    price: 1500,
    language: Language.SQ,
    category: 'Traditë dhe Zakonet',
  },
];

const categories = [
  { name: 'Letërsi Klasike', nameEn: 'Classic Literature', slug: 'lettersi-klasike' },
  {
    name: 'Letërsi Bashkëkohore',
    nameEn: 'Contemporary Literature',
    slug: 'lettersi-bashkekohore',
  },
  { name: 'Poezi', nameEn: 'Poetry', slug: 'poezi' },
  { name: 'Historia', nameEn: 'History', slug: 'historia' },
  { name: 'Gjuhësi', nameEn: 'Linguistics', slug: 'gjuhesi' },
  { name: 'Studime Letrare', nameEn: 'Literary Studies', slug: 'studime-letrare' },
  { name: 'Studime Shoqërore', nameEn: 'Social Studies', slug: 'studime-shoqerore' },
  { name: 'Feja dhe Kultura', nameEn: 'Religion and Culture', slug: 'feja-dhe-kultura' },
  { name: 'Traditë dhe Zakonet', nameEn: 'Traditions and Customs', slug: 'tradita-dhe-zakonet' },
];

const tags = [
  { name: 'Kadare', nameEn: 'Kadare' },
  { name: 'Letërsi Shqipe', nameEn: 'Albanian Literature' },
  { name: 'Poezi Moderne', nameEn: 'Modern Poetry' },
  { name: 'Historia Shqiptare', nameEn: 'Albanian History' },
  { name: 'Kultura Shqiptare', nameEn: 'Albanian Culture' },
  { name: 'Gjuha Shqipe', nameEn: 'Albanian Language' },
  { name: 'Tradita', nameEn: 'Traditions' },
  { name: 'Studime', nameEn: 'Studies' },
];

async function createSlug(title: string): Promise<string> {
  return title
    .toLowerCase()
    .replace(/[ëç]/g, 'e')
    .replace(/[ñ]/g, 'n')
    .replace(/[áàâãäå]/g, 'a')
    .replace(/[éèêë]/g, 'e')
    .replace(/[íìîï]/g, 'i')
    .replace(/[óòôõö]/g, 'o')
    .replace(/[úùûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  try {
    await prisma.book.deleteMany();
    await prisma.category.deleteMany();
    await prisma.session.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.exchangeRate.deleteMany();
  } catch (error) {
    console.log('Some tables might not exist yet, continuing...');
  }

  // Create admin user
  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@brendalibrave.com',
      password: hashedPassword,
      name: 'Administrator',
      role: Role.ADMIN,
      language: Language.SQ,
      currency: Currency.ALL,
      newsletter: true,
      emailVerified: new Date(),
    },
  });

  // Create test users
  console.log('👥 Creating test users...');
  const testUsers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'test@brendalibrave.com',
        password: await bcrypt.hash('test123', 12),
        name: 'Përdorues Test',
        role: Role.USER,
        language: Language.SQ,
        currency: Currency.ALL,
        newsletter: true,
        emailVerified: new Date(),
      },
    }),
    prisma.user.create({
      data: {
        email: 'user@brendalibrave.com',
        password: await bcrypt.hash('user123', 12),
        name: 'Lexues Shqiptar',
        role: Role.USER,
        language: Language.SQ,
        currency: Currency.EUR,
        newsletter: false,
        emailVerified: new Date(),
      },
    }),
  ]);

  // Create categories
  console.log('📚 Creating book categories...');
  const createdCategories = await Promise.all(
    categories.map(async (cat) => {
      return prisma.category.create({
        data: {
          name: cat.name,
          nameEn: cat.nameEn,
          slug: cat.slug,
          description: `Koleksion librash për ${cat.name.toLowerCase()}`,
          active: true,
        },
      });
    })
  );

  // Skip tags for now - will add in Phase 2
  console.log('🏷️ Skipping tags (Phase 2 feature)...');
  const createdTags: any[] = [];

  // Create books
  console.log('📖 Creating Albanian books...');
  const createdBooks = await Promise.all(
    albanianBooksData.map(async (bookData, index) => {
      const category = createdCategories.find((cat) => cat.name === bookData.category);
      const slug = await createSlug(bookData.title);

      const book = await prisma.book.create({
        data: {
          title: bookData.title,
          slug: slug,
          author: bookData.author,
          description: bookData.description,
          priceALL: bookData.price,
          priceEUR: Math.round(bookData.price * 0.0091 * 100) / 100, // Convert ALL to EUR
          language: bookData.language,
          isbn: `978-99943-${String(index + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 100)).padStart(2, '0')}-1`,
          publishedDate: new Date(
            2020 + Math.floor(Math.random() * 4),
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          ),
          inventory: 10 + Math.floor(Math.random() * 50),
          featured: bookData.featured || false,
          active: true,
          coverImage: bookCovers[index % bookCovers.length],
          categoryId: category?.id,
          hasDigital: Math.random() > 0.6, // 40% chance of having digital version
          digitalPriceALL: Math.floor(bookData.price * 0.7), // 30% discount for digital
          digitalPriceEUR: Math.round(bookData.price * 0.0091 * 0.7 * 100) / 100, // Convert and discount
        },
      });

      // Skip tags for now - will add in Phase 2
      // const randomTags = createdTags
      //   .sort(() => 0.5 - Math.random())
      //   .slice(0, Math.floor(Math.random() * 3) + 1);

      return book;
    })
  );

  // Skip orders for now - will add in Phase 2
  console.log('🛒 Skipping sample orders (Phase 2 feature)...');

  // Create exchange rates
  console.log('💱 Creating exchange rates...');
  await prisma.exchangeRate.create({
    data: {
      fromCurrency: Currency.ALL,
      toCurrency: Currency.EUR,
      rate: 0.0091, // 1 ALL = 0.0091 EUR (approximate)
      isActive: true,
    },
  });

  await prisma.exchangeRate.create({
    data: {
      fromCurrency: Currency.EUR,
      toCurrency: Currency.ALL,
      rate: 109.89, // 1 EUR = 109.89 ALL (approximate)
      isActive: true,
    },
  });

  // Create application settings
  console.log('⚙️ Creating application settings...');
  const settings = [
    { key: 'site_name', value: 'Brënda Librave' },
    { key: 'site_description', value: 'Libraria më e madhe online në Shqipëri' },
    { key: 'contact_email', value: 'info@brendalibrave.com' },
    { key: 'contact_phone', value: '+355 69 123 4567' },
    { key: 'shipping_cost_all', value: '300' }, // 300 ALL
    { key: 'free_shipping_threshold_all', value: '3000' }, // Free shipping over 3000 ALL
    { key: 'shipping_cost_eur', value: '3' }, // 3 EUR
    { key: 'free_shipping_threshold_eur', value: '30' }, // Free shipping over 30 EUR
  ];

  await Promise.all(
    settings.map((setting) =>
      prisma.setting.create({
        data: setting,
      })
    )
  );

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:
  - ${1} Admin user (admin@brendalibrave.com / admin123)
  - ${testUsers.length} Test users
  - ${createdCategories.length} Categories
  - ${createdTags.length} Tags
  - ${createdBooks.length} Albanian books
  - ${testUsers.length} Sample orders
  - Exchange rates (ALL/EUR)
  - Application settings`);

  console.log(`
🚀 Ready to test the app!
📝 Admin credentials:
   Email: admin@brendalibrave.com
   Password: admin123

🧪 Test user credentials:
   Email: test@brendalibrave.com
   Password: test123
`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
