import crypto from 'crypto';

const RAW_ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '12345678901234567890123456789012';
const KEY_BUFFER = crypto.createHash('sha256').update(RAW_ENCRYPTION_KEY).digest();
const IV_LENGTH = 12; // Standard 96-bit IV for AES-GCM

/**
 * Encrypts sensitive personal document data using authenticated AES-256-GCM.
 * Prevents unauthorized data theft and tamper attacks.
 */
export function encrypt(text: string): string {
  if (!text) return text;
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-gcm', KEY_BUFFER, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
}

/**
 * Decrypts sensitive document data using authenticated AES-256-GCM.
 * Verifies authenticity tag to prevent ciphertext forgery.
 */
export function decrypt(text: string): string {
  if (!text) return text;
  try {
    const parts = text.split(':');
    if (parts.length !== 3) return text; // Fallback if plain text or old format
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encryptedText = parts[2];
    const decipher = crypto.createDecipheriv('aes-256-gcm', KEY_BUFFER, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return text;
  }
}

/**
 * Masks sensitive document numbers for safe display in UI/API responses (e.g. XXXX-XXXX-1234)
 */
export function maskDocumentNumber(docNo: string): string {
  if (!docNo || docNo.length < 4) return 'XXXX';
  const lastFour = docNo.slice(-4);
  return `XXXX-XXXX-${lastFour}`;
}

/**
 * Sanitizes input text against XSS, HTML injection, and malicious script execution.
 */
export function sanitizeInput(str: string): string {
  if (typeof str !== 'string') return str;

  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

/**
 * Recursively sanitizes data payloads against malicious injection payloads.
 */
export function sanitizeObject<T>(data: T): T {
  if (typeof data === 'string') {
    return sanitizeInput(data) as unknown as T;
  }

  if (Array.isArray(data)) {
    return data.map((item) => sanitizeObject(item)) as unknown as T;
  }

  if (data !== null && typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(data)) {
      sanitized[key] = sanitizeObject((data as Record<string, any>)[key]);
    }
    return sanitized as T;
  }

  return data;
}
