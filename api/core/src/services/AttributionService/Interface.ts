import { AttributionsResponse } from "../../types/generated/pocketbase-types";
import { EvaluationResponse } from "../../types/ml-types";

type AttributeParams = {
  title: string;
  sector: string;
  userId: string;
  document: File;
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

export interface AttributionServiceInterface {
  attribute(params: AttributeParams): Promise<AttributionsResponse>;
  getAll(params: GetAllParams): Promise<AttributionsResponse[]>;
  get(params: GetParams): Promise<AttributionsResponse>;
  update(params: UpdateParams): Promise<AttributionsResponse>;
}
