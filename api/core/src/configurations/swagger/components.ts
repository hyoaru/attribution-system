import {
  Criteria,
  CriteriaSection,
  EndCriteria,
  EvaluationResponse,
  EvaluationResult,
  NLIEvaluation,
  SubCriteria,
} from "./schemas/attribution/Attribution";
import { GetAllAttributionsResponse } from "./schemas/attribution/GetAllAttributionsResponse";
import { GetAttributionByIdResponse } from "./schemas/attribution/GetAttributionByIdResponse";
import { NewAttributionRequest } from "./schemas/attribution/NewAttributionRequest";
import { NewAttributionResponse } from "./schemas/attribution/NewAttributionResponse";
import { UpdateAttributionRequest } from "./schemas/attribution/UpdateAttributionRequest";
import { UpdateAttributionResponse } from "./schemas/attribution/UpdateAttributionResponse";
import { SignInRequest } from "./schemas/authentication/SignInRequest";
import { SignInResponse } from "./schemas/authentication/SignInResponse";
import { SignOutResponse } from "./schemas/authentication/SignOutResponse";
import { DocumentResponse } from "./schemas/document/DocumentResponse";

export const components = {
  securitySchemes: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  schemas: {
    SignInRequest,
    SignInResponse,
    SignOutResponse,
    NewAttributionRequest,
    NewAttributionResponse,
    NLIEvaluation,
    EvaluationResult,
    EndCriteria,
    SubCriteria,
    Criteria,
    CriteriaSection,
    EvaluationResponse,
    GetAllAttributionsResponse,
    DocumentResponse,
    GetAttributionByIdResponse,
    UpdateAttributionResponse,
    UpdateAttributionRequest,
  },
};
