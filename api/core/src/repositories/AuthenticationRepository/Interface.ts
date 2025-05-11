import { RecordAuthResponse } from "pocketbase";
import { UsersResponse } from "../../types/generated/pocketbase-types";

type SignInParams = {
  email: string;
  password: string;
};

type RegisterParams = {
  email: string;
  password: string;
  name: string;
};

type ExtendedUsersResponse = UsersResponse & {
  isAdmin?: boolean; 
};

export interface AuthenticationRepositoryInterface {
  signIn(params: SignInParams): Promise<RecordAuthResponse<ExtendedUsersResponse>>;
  signOut(): Promise<void>;
  register(params: RegisterParams): Promise<ExtendedUsersResponse>;
  fetchAllUsers(params: SignInParams): Promise<ExtendedUsersResponse[]>;
  checkAdminStatus(id: string): Promise<boolean>;
}