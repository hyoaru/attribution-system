import { DocumentsResponse } from "../../types/generated/pocketbase-types";

type CreateParams = {
  title: string;
  document: File;
};

export interface DocumentServiceInterface {
  create(params: CreateParams): Promise<DocumentsResponse>;
}
