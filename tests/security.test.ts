import { describe, it, expect } from 'vitest';
import { sanitizeInput, sanitizeObject, encrypt, decrypt, maskDocumentNumber } from '../lib/security';
import { checkRateLimit } from '../lib/rateLimit';

describe('Security Hardening Integration Tests', () => {
  it('should encrypt and decrypt sensitive documents using AES-256-GCM', () => {
    const rawAadhaar = '999988887777';
    const encrypted = encrypt(rawAadhaar);
    expect(encrypted).not.toBe(rawAadhaar);
    expect(encrypted.split(':').length).toBe(3); // iv:authTag:ciphertext

    const decrypted = decrypt(encrypted);
    expect(decrypted).toBe(rawAadhaar);
  });

  it('should mask document numbers securely for UI/API responses', () => {
    const masked = maskDocumentNumber('999988887777');
    expect(masked).toBe('XXXX-XXXX-7777');
  });

  it('should strip malicious script tags and inline XSS handlers', () => {
    const maliciousText = '<script>alert("hack")</script>Hello <img src="x" onerror="alert(1)">World';
    const cleanText = sanitizeInput(maliciousText);
    expect(cleanText).not.toContain('<script>');
    expect(cleanText).not.toContain('onerror=');
    expect(cleanText).toContain('Hello');

    const maliciousObj = {
      name: 'John <script>bad()</script>',
      bio: 'Normal text',
      nested: {
        title: 'Title <script>evil()</script>',
      },
    };

    const cleanObj = sanitizeObject(maliciousObj);
    expect(cleanObj.name).toBe('John');
    expect(cleanObj.bio).toBe('Normal text');
    expect(cleanObj.nested.title).toBe('Title');
  });

  it('should enforce rate limits on high-frequency API requests', () => {
    const testKey = 'ip_test_rate_limiter_' + Date.now();
    const limit = 5;
    const windowMs = 10000;

    for (let i = 0; i < limit; i++) {
      const res = checkRateLimit(testKey, limit, windowMs);
      expect(res.allowed).toBe(true);
    }

    // 6th call exceeds rate limit
    const blockedRes = checkRateLimit(testKey, limit, windowMs);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
  });
});
