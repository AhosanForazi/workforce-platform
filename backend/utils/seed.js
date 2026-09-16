require('dotenv').config();
const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');

const run = async () => {
  console.log('Connecting to PostgreSQL database...');
  await prisma.$connect();

  console.log('Clearing existing data...');
  // Delete in proper relational cascade order
  await prisma.dispute.deleteMany();
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.workerServiceOffer.deleteMany();
  await prisma.workerProfile.deleteMany();
  await prisma.service.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  console.log('Seeding services...');
  const servicesData = [
    { serviceName: 'Electrician', type: 'Electrical', icon: 'zap', description: 'Wiring, fan/light installation, panel repair.' },
    { serviceName: 'Painter', type: 'Home Improvement', icon: 'paint', description: 'Interior & exterior painting.' },
    { serviceName: 'Plumber', type: 'Plumbing', icon: 'droplet', description: 'Leak repair, pipe fitting, installations.' },
    { serviceName: 'Gardener', type: 'Landscaping', icon: 'leaf', description: 'Lawn care, planting, trimming.' },
    { serviceName: 'Carpenter', type: 'Construction', icon: 'hammer', description: 'Furniture, fittings, repairs.' },
    { serviceName: 'Cleaner', type: 'Home Services', icon: 'sparkles', description: 'Deep cleaning, move-in/out cleaning.' },
  ];

  const createdServices = {};
  for (const s of servicesData) {
    const created = await prisma.service.create({ data: s });
    createdServices[s.serviceName] = created;
  }

  const salt = await bcrypt.genSalt(10);
  const defaultAdminPass = await bcrypt.hash('admin123', salt);
  const defaultCustomerPass = await bcrypt.hash('customer123', salt);
  const defaultWorkerPass = await bcrypt.hash('worker123', salt);

  console.log('Seeding admin...');
  await prisma.user.create({
    data: {
      name: 'Platform Admin',
      email: 'admin@workforce.app',
      phone: '+8801000000000',
      password: defaultAdminPass,
      role: 'admin',
      location: 'Dhaka, Bangladesh',
    },
  });

  console.log('Seeding customer...');
  await prisma.user.create({
    data: {
      name: 'Rahim Uddin',
      email: 'customer@workforce.app',
      phone: '+8801111111111',
      password: defaultCustomerPass,
      role: 'customer',
      location: 'Faridpur, Dhaka Division',
    },
  });

  const workersData = [
    { name: 'Karim Sheikh', email: 'karim.electrician@workforce.app', phone: '+8801222222222', service_type: 'Electrician', experience: '5-8 years', rating: 4.8, ratingCount: 34, bio: 'Licensed electrician specializing in residential wiring & emergency repairs.', isVerified: true, skills: ['Wiring', 'Fan Installation', 'Panel Repair'], completedJobs: 128, location: 'Faridpur, Dhaka Division', service: 'Electrician', hourly_rate: 350 },
    { name: 'Nasrin Akter', email: 'nasrin.painter@workforce.app', phone: '+8801333333333', service_type: 'Painter', experience: '3-5 years', rating: 4.6, ratingCount: 21, bio: 'Detail-oriented painter for interior and exterior projects.', isVerified: true, skills: ['Interior Paint', 'Texture Wall', 'Waterproofing'], completedJobs: 76, location: 'Dhaka', service: 'Painter', fixed_price: 4500 },
    { name: 'Jahangir Alam', email: 'jahangir.plumber@workforce.app', phone: '+8801444444444', service_type: 'Plumber', experience: '8+ years', rating: 4.9, ratingCount: 58, bio: 'Master plumber, 8+ years fixing leaks and installing fixtures fast.', isVerified: true, skills: ['Leak Repair', 'Pipe Fitting'], completedJobs: 210, location: 'Faridpur, Dhaka Division', service: 'Plumber', hourly_rate: 300 },
    { name: 'Salma Begum', email: 'salma.gardener@workforce.app', phone: '+8801555555555', service_type: 'Gardener', experience: '2-4 years', rating: 4.5, ratingCount: 15, bio: 'Passionate gardener helping homes bloom, big or small.', isVerified: false, skills: ['Lawn Care', 'Planting'], completedJobs: 42, location: 'Gazipur', service: 'Gardener', hourly_rate: 200 },
    { name: 'Rafiq Islam', email: 'rafiq.carpenter@workforce.app', phone: '+8801666666666', service_type: 'Carpenter', experience: '5-8 years', rating: 4.7, ratingCount: 29, bio: 'Custom furniture and quick fix-it carpentry services.', isVerified: true, skills: ['Furniture', 'Door Repair'], completedJobs: 95, location: 'Faridpur, Dhaka Division', service: 'Carpenter', fixed_price: 2500 },
    { name: 'Moushumi Rani', email: 'moushumi.cleaner@workforce.app', phone: '+8801777777777', service_type: 'Cleaner', experience: '1-3 years', rating: 4.4, ratingCount: 12, bio: 'Reliable and thorough home cleaning, on your schedule.', isVerified: false, skills: ['Deep Clean', 'Move-out Clean'], completedJobs: 33, location: 'Dhaka', service: 'Cleaner', hourly_rate: 250 },
  ];

  console.log('Seeding workers...');
  for (const w of workersData) {
    const user = await prisma.user.create({
      data: {
        name: w.name,
        email: w.email,
        phone: w.phone,
        password: defaultWorkerPass,
        role: 'worker',
        location: w.location,
      },
    });

    const profile = await prisma.workerProfile.create({
      data: {
        userId: user.id,
        serviceType: w.service_type,
        experience: w.experience,
        rating: w.rating,
        ratingCount: w.ratingCount,
        bio: w.bio,
        isVerified: w.isVerified,
        skills: w.skills,
        completedJobs: w.completedJobs,
      },
    });

    const service = createdServices[w.service];
    if (service) {
      await prisma.workerServiceOffer.create({
        data: {
          workerId: profile.id,
          serviceId: service.id,
          hourlyRate: w.hourly_rate || null,
          fixedPrice: w.fixed_price || null,
        },
      });
    }

    await prisma.availability.createMany({
      data: [
        {
          workerId: profile.id,
          dayOfWeek: 'Monday',
          startTime: '09:00',
          endTime: '18:00',
        },
        {
          workerId: profile.id,
          dayOfWeek: 'Wednesday',
          startTime: '09:00',
          endTime: '18:00',
        },
        {
          workerId: profile.id,
          dayOfWeek: 'Saturday',
          startTime: '10:00',
          endTime: '16:00',
        },
      ],
    });
  }

  console.log('Database seeded successfully with PostgreSQL/Supabase!');
};

run()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
