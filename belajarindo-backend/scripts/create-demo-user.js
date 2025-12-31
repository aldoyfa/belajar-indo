#!/usr/bin/env node
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

async function main() {
  const prisma = new PrismaClient();
  try {
    const email = process.env.DEMO_EMAIL || 'demo@local';
    const password = process.env.DEMO_PASSWORD || '123456';
    const name = process.env.DEMO_NAME || 'Demo User';

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await prisma.user.upsert({
      where: { email },
      update: { name, password: hashed, salt },
      create: { email, name, password: hashed, salt }
    });

    console.log('Upserted demo user:', { id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error('Failed to create demo user:', err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
