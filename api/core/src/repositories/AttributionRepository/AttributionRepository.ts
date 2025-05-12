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
  
    const filters: string[] = [];
  
    if (params.sector) {
      filters.push(`sector='${params.sector}'`);
    }
    if (params.userId) {
      filters.push(`user_id='${params.userId}'`);
    }
    if (params.startDate) {
      const [year, month, day] = params.startDate.split("-").map(Number);
      const isoStart = new Date(Date.UTC(year, month - 1, day, 0, 0, 0, 0)).toISOString();
      filters.push(`created >= "${isoStart}"`);
    }
  
    if (params.endDate) {
      const [year, month, day] = params.endDate.split("-").map(Number);
      const isoEnd = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)).toISOString();
      filters.push(`created <= "${isoEnd}"`);
    }
  
    const stringFilter = filters.join(" && ");
  
    // Debugging: Print the final filter string
    console.log("Generated Filter:", stringFilter);
  
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
