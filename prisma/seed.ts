const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // Creăm rolurile implicite
  const roles = [
    {
      name: 'admin',
      description: 'Administrator cu acces complet'
    },
    {
      name: 'moderator',
      description: 'Moderator cu acces limitat'
    },
    {
      name: 'user',
      description: 'Utilizator standard'
    }
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role
    });
  }

  console.log('Rolurile au fost create cu succes!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 