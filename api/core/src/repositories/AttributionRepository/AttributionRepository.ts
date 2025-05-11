import { injectable } from "inversify";
import { PocketbaseService } from "../../services/PocketbaseService";
import { AttributionRepositoryInterface } from "./Interface";

@injectable()
export class AttributionRepository implements AttributionRepositoryInterface {
  async update(
    params: Parameters<AttributionRepositoryInterface["update"]>[0],
  ): ReturnType<AttributionRepositoryInterface["update"]> {
    const pb = PocketbaseService.getClient();

    return await pb.collection("attributions").update(params.id, {
      sector: params.sector,
      attribution: params.attribution,
      proposed_budget: params.proposedBudget,
    });
  }
  async get(
    params: Parameters<AttributionRepositoryInterface["get"]>[0],
  ): ReturnType<AttributionRepositoryInterface["get"]> {
    const pb = PocketbaseService.getClient();
    return await pb.collection("attributions").getOne(params.id, {
      expand: "document_id",
    });
  }

  async getAll(
    params: Parameters<AttributionRepositoryInterface["getAll"]>[0],
  ): ReturnType<AttributionRepositoryInterface["getAll"]> {
    const pb = PocketbaseService.getClient();

    const filters = {
      sector: params.sector,
      user_id: params.userId,
    };

    const stringFilter = Object.entries(filters)
      .filter((entry) => entry[1])
      .map((entry) => `${entry[0]}='${entry[1]}'`)
      .join("&&");

    return await pb.collection("attributions").getFullList({
      sort: "-created",
      filter: stringFilter,
      fields:
        "collectionId,collectionName,id,user_id,document_id,sector,proposed_budget,created,updated,expand",
      expand: "document_id",
    });
  }

  async create(
    params: Parameters<AttributionRepositoryInterface["create"]>[0],
  ): ReturnType<AttributionRepositoryInterface["create"]> {
    const pb = PocketbaseService.getClient();

    return await pb.collection("attributions").create({
      user_id: params.userId,
      document_id: params.documentId,
      sector: params.sector,
      attribution: params.attribution,
      proposed_budget: params.proposedBudget,
    });
  }
}
