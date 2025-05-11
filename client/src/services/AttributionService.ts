import { AxiosInstance } from "./AxiosInstance";
import { Evaluation } from "@/types/EvaluationTypes";

export type AttributeParams = {
    sector: string;
    title: string;
    proposed_budget: number;
    document: File;
};

type UpdateAttributionParams = {
    sector?: string;
    proposed_budget?: number;
    attribution: Evaluation;
};

export type AttributionResponse = {
    collectionId: string;
    collectionName: string;
    id: string;
    user_id: string;
    document_id: string;
    sector: string;
    proposed_budget: number;
    attribution: Evaluation;
    expand?: {
        document_id: {
            collectionId: string;
            collectionName: string;
            id: string;
            title: string;
            document: string;
            created: string;
            updated: string;
        };
    };
    created: string;
    updated: string;
};

class AttributionService {
    static attribute = async (
        params: AttributeParams
    ): Promise<AttributionResponse> => {
        try {
            const formData = new FormData();
            formData.append("sector", params.sector);
            formData.append("title", params.title);
            formData.append(
                "proposed_budget",
                params.proposed_budget.toString()
            );
            formData.append("document", params.document);

            console.log(params.document);

            const response = await AxiosInstance.post(
                `/attributions/`,
                formData,
                { timeout: 100000 }
            );
            return response.data;
        } catch (error) {
            console.error("Error in attribute:", error);
            throw error;
        }
    };

    static updateAttribution = async (
        id: string,
        params: UpdateAttributionParams
    ): Promise<AttributionResponse> => {
        return await AxiosInstance.patch(`/attributions/${id}`, params).then(
            (response) => response.data as AttributionResponse
        );
    };

    static getAttributionById = async (
        id: string
    ): Promise<AttributionResponse> => {
        return await AxiosInstance.get(`/attributions/${id}`).then(
            (response) => response.data
        );
    };

    static getAllAttributions = async (
        sector?: string,
        userId?: string
    ): Promise<AttributionResponse[]> => {

        try {
            const params = new URLSearchParams();
            if (sector) params.append("sector", sector);
            if (userId) params.append("user_id", userId);
    
            const url = `/attributions${params.toString() ? `?${params.toString()}` : ""}`;
    
            const response = await AxiosInstance.get(url);
            return response.data;
        } catch (error) {
            console.error("Error fetching attributions:", error);
            throw error;
        }
    };

    static fillExcelFile = async (
        sheetName: string,
        updates: { cell: string; value: string }[]
    ): Promise<Blob> => {
        try {
            const response = await AxiosInstance.post(
                `/attributions/fill-excel-file`,
                { sheetName, updates },
                {
                    responseType: "blob",
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error filling checklist:", error);
            throw error;
        }
    };

    static fillExcelFileSummary = async (
        sheetName: string,
        updates: { cell: string; value: string }[]
    ): Promise<Blob> => {
        try {
            const response = await AxiosInstance.post(
                `/attributions/fill-excel-file-summary`,
                { sheetName, updates },
                {
                    responseType: "blob",
                }
            );
            return response.data;
        } catch (error) {
            console.error("Error filling checklist:", error);
            throw error;
        }
    };

    static deleteDocument = async (id: string): Promise<{ message: string }> => {
        try {
            const response = await AxiosInstance.delete(`/attributions/${id}`);
            return response.data;
        } catch (error) {
            console.error("Error deleting document:", error);
            throw error;
        }
    };
}

export default AttributionService;
