import { injectable, inject } from "inversify";
import { DI } from "../../configurations/dependency-injection/symbols";
import { AuthenticationRepositoryInterface } from "../../repositories/AuthenticationRepository/Interface";
import { AuthenticationServiceInterface } from "./Interface";
import { UsersResponse } from "../../types/generated/pocketbase-types";

@injectable()
export class AuthenticationService implements AuthenticationServiceInterface {
  private _authenticationRepository: AuthenticationRepositoryInterface;

  constructor(
    @inject(DI.AuthenticationRepositoryInterface)
    authenticationRepository: AuthenticationRepositoryInterface,
  ) {
    this._authenticationRepository = authenticationRepository;
  }

  async signIn(
    params: Parameters<AuthenticationRepositoryInterface["signIn"]>[0],
  ): ReturnType<AuthenticationRepositoryInterface["signIn"]> {
    return this._authenticationRepository.signIn(params);
  }

  async signOut(): ReturnType<AuthenticationRepositoryInterface["signOut"]> {
    return this._authenticationRepository.signOut();
  }

  async register(
    params: Parameters<AuthenticationRepositoryInterface["register"]>[0],
  ): ReturnType<AuthenticationRepositoryInterface["register"]> {
    return this._authenticationRepository.register(params);
  }

  async fetchAllUsers(params: Parameters<AuthenticationRepositoryInterface["fetchAllUsers"]>[0]
  ): Promise<UsersResponse[]> {
    return this._authenticationRepository.fetchAllUsers(params);
  }
  
  async checkAdminStatus(
    id: Parameters<AuthenticationRepositoryInterface["checkAdminStatus"]>[0]
  ): ReturnType<AuthenticationRepositoryInterface["checkAdminStatus"]> {
    return this._authenticationRepository.checkAdminStatus(id);
  }
}