import PocketBase, { RecordModel } from "pocketbase";
import { TypedPocketBase } from "../types/generated/pocketbase-types";

export interface PocketbaseServiceInterface {}

type GetFileUrlParams = {
  record: RecordModel;
  filename: string;
};

export class PocketbaseService implements PocketbaseServiceInterface {
  static getFileUrl(params: GetFileUrlParams): string {
    const pb = this.getClient();
    return pb.getFileUrl(params.record, params.filename);
  }

  static getClient(): TypedPocketBase {
    return new PocketBase(process.env.POCKETBASE_URL) as TypedPocketBase;
  }
}
