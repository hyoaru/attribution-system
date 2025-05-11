import { injectable } from "inversify";
import { PocketbaseService } from "../../services/PocketbaseService";
import { DocumentRepositoryInterface } from "./Interface";

@injectable()
export class DocumentRepository implements DocumentRepositoryInterface {
  async getById(
    id: Parameters<DocumentRepositoryInterface["getById"]>[0],
  ): ReturnType<DocumentRepositoryInterface["getById"]> {
    const pb = PocketbaseService.getClient();
    return await pb.collection("documents").getOne(id);
  }

  async create(
    params: Parameters<DocumentRepositoryInterface["create"]>[0],
  ): ReturnType<DocumentRepositoryInterface["create"]> {
    const pb = PocketbaseService.getClient();
    return await pb.collection("documents").create(params);
  }
}
