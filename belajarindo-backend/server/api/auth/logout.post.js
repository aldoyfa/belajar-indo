export default defineEventHandler(async (event) => {
  // Clear cookie
  setCookie(event, 'auth_token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return { ok: true };
});
