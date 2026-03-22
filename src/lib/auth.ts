import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'super-secret-oscar-key-2024';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any, expiresIn: string = "7d") {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
