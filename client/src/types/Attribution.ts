export type DocumentDetails = {
    collectionId: string;
    collectionName: string;
    id: string;
    title: string;
    document: string;
    created: string;
    updated: string;
};

export type Attribution = {
    collectionId: string;
    collectionName: string;
    id: string;
    user_id: string;
    document_id: string;
    sector: string;
    proposed_budget: number;
    expand: {
        document_id: DocumentDetails;
    };
    created: string;
    updated: string;
};

export type User = {
    id: string;
    email: string;
    name: string;
    avatar: string;
    verified: boolean;
};