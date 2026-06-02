const OBFUSCATION_KEY = 'polychat-a1f8c3e9b4d72e6a';

function xorBytes(bytes: Uint8Array, key: string): Uint8Array {
  const out = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    out[i] = bytes[i] ^ key.charCodeAt(i % key.length);
  }
  return out;
}

export function obfuscate(plain: string): string {
  if (!plain) return '';
  const bytes = new TextEncoder().encode(plain);
  const xored = xorBytes(bytes, OBFUSCATION_KEY);
  let binary = '';
  for (let i = 0; i < xored.length; i++) {
    binary += String.fromCharCode(xored[i]);
  }
  return btoa(binary);
}

export function deobfuscate(encoded: string): string {
  if (!encoded) return '';
  try {
    const binary = atob(encoded);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i) ^ OBFUSCATION_KEY.charCodeAt(i % OBFUSCATION_KEY.length);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    return encoded;
  }
}

export function isObfuscated(value: string): boolean {
  return /^[A-Za-z0-9+/]+=*$/.test(value) && !value.startsWith('sk-or-');
}
