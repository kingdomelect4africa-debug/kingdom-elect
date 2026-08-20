import { randomBytes, scrypt, timingSafeEqual } from 'crypto'

const SCRYPT_KEY_LENGTH = 64

function scryptAsync(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, SCRYPT_KEY_LENGTH, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex')
  const derivedKey = await scryptAsync(password, salt)
  return `${salt}:${derivedKey.toString('hex')}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [salt, storedHex] = stored.split(':')
  if (!salt || !storedHex) return false
  const derivedKey = await scryptAsync(password, salt)
  const storedBuffer = Buffer.from(storedHex, 'hex')
  if (derivedKey.length !== storedBuffer.length) return false
  return timingSafeEqual(derivedKey, storedBuffer)
}
