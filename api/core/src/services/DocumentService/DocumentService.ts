import { inject, injectable } from "inversify";
import { DI } from "../../configurations/dependency-injection/symbols";
import { DocumentServiceInterface } from "./Interface";
import { DocumentRepositoryInterface } from "../../repositories/DocumentRepository/Interface";

@injectable()
export class DocumentService implements DocumentServiceInterface {
  private _documentRepository: DocumentRepositoryInterface;

  constructor(
    @inject(DI.DocumentRepositoryInterface)
    documentRepository: DocumentRepositoryInterface,
  ) {
    this._documentRepository = documentRepository;
  }

  async create(
    params: Parameters<DocumentRepositoryInterface["create"]>[0],
  ): ReturnType<DocumentRepositoryInterface["create"]> {
    return await this._documentRepository.create({
      title: params.title,
      document: params.document,
    });
  }
}
