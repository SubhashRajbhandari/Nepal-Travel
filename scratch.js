const { PrismaClient } = require('./lib/generated/prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const adapter = new PrismaLibSql({ url: 'file:./dev.db' });
const prisma = new PrismaClient({ adapter });

async function main() {
  const d = await prisma.destination.findFirst();
  console.log(`ID: ${d.id}`);
  console.log(`Name: ${d.name}`);
}

main().finally(() => prisma.$disconnect());
