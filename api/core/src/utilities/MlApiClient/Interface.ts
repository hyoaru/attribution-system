import { EvaluationResponse, Status } from "../../types/ml-types";

type EvaluateParams = {
  sector: string;
  file: File;
};

export interface MlApiClientInterface {
  getLogs(): Promise<string[]>;
  getStatus(): Promise<Status>;
  getSectors(): Promise<string[]>;
  evaluate(params: EvaluateParams): Promise<EvaluationResponse>;
}
