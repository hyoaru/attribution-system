import { injectable } from "inversify";
import { PocketbaseService } from "../../services/PocketbaseService";
import { AuthenticationRepositoryInterface } from "./Interface";
import { UsersResponse } from "../../types/generated/pocketbase-types";

type ExtendedUsersResponse = UsersResponse & {
  isAdmin?: boolean; 
};

@injectable()
export class AuthenticationRepository
  implements AuthenticationRepositoryInterface
{
  async signIn(
    params: Parameters<AuthenticationRepositoryInterface["signIn"]>[0],
  ): ReturnType<AuthenticationRepositoryInterface["signIn"]> {
    const pb = PocketbaseService.getClient();

    return await pb
      .collection("users")
      .authWithPassword(params.email, params.password);
  }

  async signOut(): Promise<void> {
    const pb = PocketbaseService.getClient();
    pb.authStore.clear();
  }

  async register(
    params: Parameters<AuthenticationRepositoryInterface["register"]>[0],
  ): ReturnType<AuthenticationRepositoryInterface["register"]> {
    const pb = PocketbaseService.getClient();

    await pb.admins.authWithPassword(
      process.env.POCKETBASE_ADMIN_EMAIL ?? "",
      process.env.POCKETBASE_ADMIN_PASSWORD ?? ""
    );

    const newUser = await pb.collection("users").create<UsersResponse>({
      email: params.email,
      password: params.password,
      passwordConfirm: params.password,
      name: params.name,
      verified: true,
    });

    return newUser;
  }

  async fetchAllUsers(
  params: Parameters<AuthenticationRepositoryInterface["fetchAllUsers"]>[0]
): ReturnType<AuthenticationRepositoryInterface["fetchAllUsers"]> {
  const pb = PocketbaseService.getClient();

  await pb.admins.authWithPassword(params.email, params.password);

  return await pb.collection("users").getFullList<UsersResponse>();
}

async checkAdminStatus(
  id: Parameters<AuthenticationRepositoryInterface["checkAdminStatus"]>[0]
): ReturnType<AuthenticationRepositoryInterface["checkAdminStatus"]> {
  const pb = PocketbaseService.getClient();
  
  await pb.admins.authWithPassword(
    process.env.POCKETBASE_ADMIN_EMAIL ?? "",
    process.env.POCKETBASE_ADMIN_PASSWORD ?? ""
  );

  const user = await pb.collection("users").getOne<ExtendedUsersResponse>(id);

  return user.isAdmin ?? false;
}
}