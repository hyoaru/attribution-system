import { DocumentsResponse } from "../../types/generated/pocketbase-types";

type CreateParams = {
  title: string;
  document: File;
};

export interface DocumentRepositoryInterface {
  getById(id: string): Promise<DocumentsResponse>;
  create(params: CreateParams): Promise<DocumentsResponse>;
}
