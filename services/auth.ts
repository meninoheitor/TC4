/**
 * @deprecated Prefira container.useCases.auth ou useAuth()
 */
import { container } from "@/core/di/container";

export async function register(name: string, email: string, password: string) {
  return container.useCases.auth.register.execute(name, email, password);
}

export async function login(email: string, password: string) {
  return container.useCases.auth.login.execute(email, password);
}

export async function logout() {
  return container.useCases.auth.logout.execute();
}
