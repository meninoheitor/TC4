import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";

const CACHE_KEY_STORAGE = "app_cache_encryption_key_v1";
const CACHE_KEY_ASYNC_FALLBACK = "@encrypted_cache_key_v1";

let secureStoreAvailable: boolean | null = null;

async function checkSecureStoreAvailable(): Promise<boolean> {
  if (secureStoreAvailable !== null) {
    return secureStoreAvailable;
  }

  try {
    secureStoreAvailable = await SecureStore.isAvailableAsync();
  } catch {
    secureStoreAvailable = false;
  }

  return secureStoreAvailable;
}

async function readEncryptionKey(): Promise<string | null> {
  const useSecureStore = await checkSecureStoreAvailable();

  if (useSecureStore) {
    return SecureStore.getItemAsync(CACHE_KEY_STORAGE);
  }

  return AsyncStorage.getItem(CACHE_KEY_ASYNC_FALLBACK);
}

async function writeEncryptionKey(key: string): Promise<void> {
  const useSecureStore = await checkSecureStoreAvailable();

  if (useSecureStore) {
    await SecureStore.setItemAsync(CACHE_KEY_STORAGE, key);
    return;
  }

  await AsyncStorage.setItem(CACHE_KEY_ASYNC_FALLBACK, key);
}

async function getOrCreateEncryptionKey(): Promise<string> {
  const existing = await readEncryptionKey();

  if (existing) {
    return existing;
  }

  const randomBytes = await Crypto.getRandomBytesAsync(32);
  const key = Array.from(randomBytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  await writeEncryptionKey(key);
  return key;
}

function xorEncryptDecrypt(text: string, key: string): string {
  let result = "";

  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    result += String.fromCharCode(charCode);
  }

  return result;
}

function toBase64(value: string): string {
  if (typeof btoa !== "undefined") {
    return btoa(value);
  }

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let i = 0;

  while (i < value.length) {
    const a = value.charCodeAt(i++);
    const b = i < value.length ? value.charCodeAt(i++) : NaN;
    const c = i < value.length ? value.charCodeAt(i++) : NaN;

    const bitmap = (a << 16) | ((isNaN(b) ? 0 : b) << 8) | (isNaN(c) ? 0 : c);

    output +=
      chars.charAt((bitmap >> 18) & 63) +
      chars.charAt((bitmap >> 12) & 63) +
      chars.charAt(isNaN(b) ? 64 : (bitmap >> 6) & 63) +
      chars.charAt(isNaN(c) ? 64 : bitmap & 63);
  }

  return output;
}

function fromBase64(value: string): string {
  if (typeof atob !== "undefined") {
    return atob(value);
  }

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  let output = "";
  let i = 0;

  value = value.replace(/[^A-Za-z0-9+/=]/g, "");

  while (i < value.length) {
    const enc1 = chars.indexOf(value.charAt(i++));
    const enc2 = chars.indexOf(value.charAt(i++));
    const enc3 = chars.indexOf(value.charAt(i++));
    const enc4 = chars.indexOf(value.charAt(i++));

    const bitmap = (enc1 << 18) | (enc2 << 12) | (enc3 << 6) | enc4;

    output += String.fromCharCode((bitmap >> 16) & 255);

    if (enc3 !== 64) {
      output += String.fromCharCode((bitmap >> 8) & 255);
    }

    if (enc4 !== 64) {
      output += String.fromCharCode(bitmap & 255);
    }
  }

  return output;
}

export class EncryptedCache {
  constructor(private readonly namespace: string) {}

  private buildKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const encryptionKey = await getOrCreateEncryptionKey();
    const json = JSON.stringify(value);
    const encrypted = toBase64(xorEncryptDecrypt(json, encryptionKey));

    await AsyncStorage.setItem(this.buildKey(key), encrypted);
  }

  async get<T>(key: string): Promise<T | null> {
    const stored = await AsyncStorage.getItem(this.buildKey(key));

    if (!stored) {
      return null;
    }

    try {
      const encryptionKey = await getOrCreateEncryptionKey();
      const decrypted = xorEncryptDecrypt(fromBase64(stored), encryptionKey);
      return JSON.parse(decrypted) as T;
    } catch {
      await AsyncStorage.removeItem(this.buildKey(key));
      return null;
    }
  }

  async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(this.buildKey(key));
  }

  async clear(): Promise<void> {
    const keys = await AsyncStorage.getAllKeys();
    const namespaced = keys.filter((k) => k.startsWith(`${this.namespace}:`));

    if (namespaced.length > 0) {
      await AsyncStorage.multiRemove(namespaced);
    }
  }
}
