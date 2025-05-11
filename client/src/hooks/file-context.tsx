import React, { createContext, useContext, useState, ReactNode } from "react";

interface ContextType {
    selectedPPA: string | null;
    selectedSector: string | null;
    files: File[];
    setSelectedPPA: (ppa: string | null) => void;
    setSelectedSector: (sector: string | null) => void;
    setFiles: (files: File[]) => void;
}

interface FileProviderProps {
    children: ReactNode;
}

const FileContext = createContext<ContextType | undefined>(undefined);

export const FileProvider: React.FC<FileProviderProps> = ({ children }) => {
    const [selectedPPA, setSelectedPPA] = useState<string | null>(null);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [files, setFiles] = useState<File[]>([]);

    return (
        <FileContext.Provider
            value={{
                selectedPPA,
                selectedSector,
                files,
                setSelectedPPA,
                setSelectedSector,
                setFiles,
            }}
        >
            {children}
        </FileContext.Provider>
    );
};

export const useFileContext = () => {
    const context = useContext(FileContext);

    if (!context) {
        throw new Error("useFileContext must be used within a FileProvider");
    }
    return context;
};
