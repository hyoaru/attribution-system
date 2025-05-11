import { inject, injectable } from "inversify";
import { DI } from "../../configurations/dependency-injection/symbols";
import { AttributionRepositoryInterface } from "../../repositories/AttributionRepository/Interface";
import { AttributionServiceInterface } from "./Interface";
import { MlApiClientInterface } from "../../utilities/MlApiClient/Interface";
import { DocumentRepositoryInterface } from "../../repositories/DocumentRepository/Interface";

@injectable()
export class AttributionService implements AttributionServiceInterface {
  private _attributionRepository: AttributionRepositoryInterface;
  private _mlApiClient: MlApiClientInterface;
  private _documentRepository: DocumentRepositoryInterface;

  constructor(
    @inject(DI.AttributionRepositoryInterface)
    attributionRepository: AttributionRepositoryInterface,
    @inject(DI.MlApiClientInterface)
    mlApiService: MlApiClientInterface,
    @inject(DI.DocumentRepositoryInterface)
    documentRepository: DocumentRepositoryInterface,
  ) {
    this._attributionRepository = attributionRepository;
    this._mlApiClient = mlApiService;
    this._documentRepository = documentRepository;
  }

  async update(
    params: Parameters<AttributionServiceInterface["update"]>[0],
  ): ReturnType<AttributionServiceInterface["update"]> {
    return await this._attributionRepository.update(params);
  }

  async get(
    params: Parameters<AttributionServiceInterface["get"]>[0],
  ): ReturnType<AttributionServiceInterface["get"]> {
    return await this._attributionRepository.get(params);
  }

  async getAll(
    params: Parameters<AttributionServiceInterface["getAll"]>[0],
  ): ReturnType<AttributionServiceInterface["getAll"]> {
    return await this._attributionRepository.getAll(params);
  }

  async attribute(
    params: Parameters<AttributionServiceInterface["attribute"]>[0],
  ): ReturnType<AttributionServiceInterface["attribute"]> {
    // Make an attribution call to the ML API
    const attributionData = await this._mlApiClient.evaluate({
      sector: params.sector,
      file: params.document,
    });

    // Create the document record in the database
    const documentRecord = await this._documentRepository.create({
      title: params.title,
      document: params.document,
    });

    return await this._attributionRepository.create({
      userId: params.userId,
      documentId: documentRecord.id,
      sector: params.sector,
      attribution: attributionData,
      proposedBudget: params.proposedBudget,
    });
  }
}
