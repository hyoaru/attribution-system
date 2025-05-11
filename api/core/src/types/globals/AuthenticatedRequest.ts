import { UsersResponse } from "../generated/pocketbase-types";
import { Request } from "express";

export type AuthenticatedRequest<T = any> = Request<
  Record<string, any>,
  any,
  T
> & {
  user?: UsersResponse;
};
