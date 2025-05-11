import FormData from "form-data";
import { injectable } from "inversify";
import { EvaluationResponse, Status } from "../../types/ml-types";
import { axiosMl } from "../../utilities/axios-instances/axiosMl";
import { MlApiClientInterface } from "./Interface";

@injectable()
export class MlApiClient implements MlApiClientInterface {
  async getLogs(): Promise<string[]> {
    return await axiosMl
      .get<string[]>("/api/v1/logs")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async getStatus(): Promise<Status> {
    return await axiosMl
      .get<Status>("/api/v1/status")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async getSectors(): Promise<string[]> {
    return await axiosMl
      .get<string[]>("/api/v1/evaluation/evaluate")
      .then((response) => response.data)
      .catch((error) => {
        throw error;
      });
  }

  async evaluate(params: {
    sector: string;
    file: File;
  }): Promise<EvaluationResponse> {
    const fileBuffer = Buffer.from(await params.file.arrayBuffer());

    const formData = new FormData();
    formData.append("file", fileBuffer, {
      filename: params.file.name,
      contentType: params.file.type,
    });

    formData.append("sector", params.sector);

    return await axiosMl
      .post<EvaluationResponse>("/api/v1/evaluation/evaluate", formData, {
        headers: {
          ...formData.getHeaders(),
          accept: "application/json",
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }
}
