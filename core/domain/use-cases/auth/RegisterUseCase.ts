import type { AuthRepository } from "../../repositories/AuthRepository";
import type { AuthUser } from "../../entities/User";

export class RegisterUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(name: string, email: string, password: string): Promise<AuthUser> {
    return this.authRepository.register(name.trim(), email.trim(), password);
  }
}
