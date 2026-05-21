/**
 * Configuração do Firebase via variáveis de ambiente (EXPO_PUBLIC_*).
 * Nunca commite o arquivo .env com credenciais reais.
 */
/** Valores padrão do projeto (usados quando .env não está configurado). */
const projectDefaults = {
  apiKey: "AIzaSyChmBnZ8Bbk5dlAZgQ0xdyYNurqYUo_bcQ",
  authDomain: "tech-challenge-fase-03-eedb4.firebaseapp.com",
  projectId: "tech-challenge-fase-03-eedb4",
  storageBucket: "tech-challenge-fase-03-eedb4.firebasestorage.app",
  messagingSenderId: "199027648248",
  appId: "1:199027648248:web:9ca59575d1a23c3b2f7d0d",
  measurementId: "G-DPN95EYYLC",
};

function envOrDefault(
  envValue: string | undefined,
  fallback: string,
): string {
  return envValue && envValue.length > 0 ? envValue : fallback;
}

export const firebaseConfig = {
  apiKey: envOrDefault(
    process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    projectDefaults.apiKey,
  ),
  authDomain: envOrDefault(
    process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectDefaults.authDomain,
  ),
  projectId: envOrDefault(
    process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    projectDefaults.projectId,
  ),
  storageBucket: envOrDefault(
    process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    projectDefaults.storageBucket,
  ),
  messagingSenderId: envOrDefault(
    process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    projectDefaults.messagingSenderId,
  ),
  appId: envOrDefault(
    process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
    projectDefaults.appId,
  ),
  measurementId: envOrDefault(
    process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
    projectDefaults.measurementId,
  ),
};
export function assertFirebaseConfig(): void {
  const required = [
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
    "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "EXPO_PUBLIC_FIREBASE_APP_ID",
  ] as const;

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `[Firebase] Variáveis ausentes: ${missing.join(", ")}. Copie .env.example para .env`,
    );
  }
}
