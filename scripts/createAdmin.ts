import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    // Verifică dacă contul de admin există deja
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@hub.com' }
    });

    if (existingAdmin) {
      console.log('Contul de admin există deja!');
      return;
    }

    // Creează contul de admin
    const hashedPassword = await bcrypt.hash('admin1234', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@hub.com',
        username: 'admin',
        password: hashedPassword,
        country: 'RO',
        phone: '0000000000',
        interests: JSON.stringify(['admin']),
      }
    });

    console.log('Cont de admin creat cu succes:', admin.username);
  } catch (error) {
    console.error('Eroare la crearea contului de admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 