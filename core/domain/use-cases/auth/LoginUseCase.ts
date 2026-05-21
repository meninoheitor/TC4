import type { AuthRepository } from "../../repositories/AuthRepository";
import type { AuthUser } from "../../entities/User";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  execute(email: string, password: string): Promise<AuthUser> {
    return this.authRepository.login(email.trim(), password);
  }
}
