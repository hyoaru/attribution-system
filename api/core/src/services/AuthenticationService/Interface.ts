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

export interface AuthenticationServiceInterface {
  signIn(params: SignInParams): Promise<RecordAuthResponse<UsersResponse>>;
  signOut(): Promise<void>;
  register(params: RegisterParams): Promise<UsersResponse>;
  fetchAllUsers(params: SignInParams): Promise<UsersResponse[]>;
  checkAdminStatus(id: string): Promise<boolean>;
}