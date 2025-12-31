const { PrismaClient } = require('@prisma/client');

// Use a global variable in development to prevent creating multiple
// PrismaClient instances during hot reloads (nodemon / ts-node-dev).
let prisma;
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

module.exports = prisma;
