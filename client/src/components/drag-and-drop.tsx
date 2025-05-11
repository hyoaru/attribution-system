import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
    onFileChange: (file: File) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileChange }) => {
    const [file, setFile] = useState<File | null>(null);
    const { toast } = useToast();

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length > 1) {
                toast({
                    variant: "destructive",
                    title: "Only one file allowed",
                    description: "Please upload only one file at a time.",
                });
                return;
            }

            const uploadedFile = acceptedFiles[0];
            setFile(uploadedFile);
            onFileChange(uploadedFile);
        },
        [onFileChange, toast]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
        },
        multiple: false,
    });

    return (
        <div
            {...getRootProps()}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 rounded-md p-4 cursor-pointer hover:border-gray-400 transition-colors"
        >
            <input {...getInputProps()} />
            {isDragActive ? (
                <p className="text-gray-500">Drop the file here...</p>
            ) : (
                <div className="text-center">
                    <p className="text-gray-500 mb-4">
                        Drag and drop a file here
                    </p>
                    <Button variant="outline" className="w-full">
                        Click to select a file
                    </Button>
                </div>
            )}
            {file && (
                <p className="mt-2 text-sm text-gray-600">
                    Uploaded: {file.name}
                </p>
            )}
        </div>
    );
};

export default FileUpload;
