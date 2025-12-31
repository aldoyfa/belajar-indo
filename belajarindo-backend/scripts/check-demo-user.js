const prisma = require('../src/utils/prisma');

(async function main(){
  try {
    const email = process.env.DEMO_EMAIL || 'demo@local';
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log('Demo user not found:', email);
      process.exit(0);
    }
    console.log('Demo user found:');
    console.log(JSON.stringify({ id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }, null, 2));
    process.exit(0);
  } catch (err) {
    console.error('Error checking demo user:', err.message || err);
    process.exit(1);
  }
})();
