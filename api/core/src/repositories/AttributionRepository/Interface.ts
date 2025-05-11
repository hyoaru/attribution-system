import { AttributionsResponse } from "../../types/generated/pocketbase-types";
import { EvaluationResponse } from "../../types/ml-types";

type CreateParams = {
  userId: string;
  documentId: string;
  sector: string;
  attribution: EvaluationResponse;
  proposedBudget: number;
};

type GetAllParams = {
  sector?: string;
  userId?: string;
};

type GetParams = {
  id: string;
};

type UpdateParams = {
  id: string;
  sector: string;
  attribution: EvaluationResponse;
  proposedBudget: number;
};

export interface AttributionRepositoryInterface {
  create(params: CreateParams): Promise<AttributionsResponse>;
  getAll(params: GetAllParams): Promise<AttributionsResponse[]>;
  get(params: GetParams): Promise<AttributionsResponse>;
  update(params: UpdateParams): Promise<AttributionsResponse>;
}
