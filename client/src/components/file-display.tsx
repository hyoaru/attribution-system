import React, { useState, useEffect } from "react";
import { FileIcon, LayoutGridIcon, LayoutList, Loader } from "lucide-react";
import { Button } from "./ui/button";
import FileUpload from "@/components/drag-and-drop";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import AttributionService, {
    AttributionResponse,
} from "@/services/AttributionService";
import CustomSelect from "@/components/custom-select";

const selectOptionsSector = [
    { value: "general", label: "General" },
    { value: "agriculture_and_agrarian_reform", label: "Agriculture And Agrarian Reform" },
    { value: "child_labor", label: "Child Labor" },
    { value: "development_planning", label: "Development Planning" },
    { value: "disaster_risk_reduction_management", label: "Disaster Risk Reduction Management" },
    { value: "employment_and_work_related", label: "Employment And Work Related" },
    { value: "energy", label: "Energy" },
    { value: "fisheries", label: "Fisheries" },
    { value: "generic", label: "Generic" },
    { value: "ict", label: "ICT" },
    { value: "infrastructure", label: "Infrastructure" },
    { value: "justice", label: "Justice" },
    { value: "labor_migration", label: "Labor Migration" },
    { value: "microfinance", label: "Microfinance" },
    { value: "natural_resource_management", label: "Natural Resource Management" },
    { value: "private_sector_development", label: "Private Sector Development" },
    { value: "social_sector_education", label: "Social Sector Education" },
    { value: "social_sector_health", label: "Social Sector Health" },
    { value: "social_sector_housing_and_settlement", label: "Social Sector Housing And Settlement" },
    { value: "social_sector_women_in_areas_under_armed_conflict", label: "Social Sector Women In Areas Under Armed Conflict" },
    { value: "tourism", label: "Tourism" }
];

const FileDisplay: React.FC = () => {
    const navigate = useNavigate();
    const [isListView, setIsListView] = useState(false);
    const [selectedSector, setSelectedSector] = useState<string | null>(null);
    const [attributions, setAttributions] = useState<AttributionResponse[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [proposedBudget, setProposedBudget] = useState<number>(0);
    const [title, setTitle] = useState<string>("");
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [documentToDelete, setDocumentToDelete] = useState<string | null>(null);

    // Move fetchAttributions outside so it can be reused after deleting
    const fetchAttributions = async () => {
        const data = await AttributionService.getAllAttributions(
            selectedSector || undefined,
            localStorage.getItem("userId") || undefined
        );
        setAttributions(data);
    };

    useEffect(() => {
        fetchAttributions();
    }, [selectedSector]);

    const handleFileChange = (file: File) => {
        setFiles([file]);
    };

    const handleUploadFile = async () => {
        setIsLoading(true);

        if (files.length === 0 || !selectedSector || !title) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await AttributionService.attribute({
                sector: selectedSector,
                title: title.trim(),
                proposed_budget: proposedBudget,
                document: files[0],
            });

            console.log("Response", response);

            navigate("/result", {
                state: {
                    json: response.attribution,
                    suggestedBudget: response.proposed_budget,
                    attributionId: response.id,
                    sector: response.sector,
                    title: response.expand?.document_id.title,
                },
            });
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectSector = (value: string) => {
        setSelectedSector(value === "clear" ? null : value);
        console.log(value);
    };

    const handleDeleteDocument = async (documentId?: string) => {
        if (!documentId) return;

        try {
            await AttributionService.deleteDocument(documentId);
            await fetchAttributions();
        } catch (error) {
            console.error("Error deleting document:", error);
        }
    };

    return (
        <div className="p-4">
            <img
                src="/gad_cover.png"
                alt="logo"
                className="mx-auto filter drop-shadow-[0_0_4px_white] max-w-xs md:max-w-sm h-auto"
            />
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-6">
                    <h2 className="text-lg font-semibold">My Files</h2>
                    <CustomSelect
                        options={selectOptionsSector}
                        placeholder="Sector"
                        onChange={handleSelectSector}
                    />
                </div>
                <Button onClick={() => setIsListView(!isListView)}>
                    {isListView ? <LayoutGridIcon /> : <LayoutList />}
                </Button>
            </div>

            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="w-full mb-6 mt-2">
                        Add File
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload New File</DialogTitle>
                    </DialogHeader>
                    <FileUpload onFileChange={handleFileChange} />
                    <Input
                        placeholder="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input
                        placeholder="Proposed Budget"
                        type="number"
                        value={proposedBudget}
                        onChange={(e) =>
                            setProposedBudget(Number(e.target.value))
                        }
                    />
                    <CustomSelect
                        options={selectOptionsSector}
                        placeholder="Sector"
                        onChange={handleSelectSector}
                        all={false}
                    />
                    <Button
                        className="w-full mt-4"
                        onClick={handleUploadFile}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <Loader className="animate-spin" />
                        ) : (
                            "Upload"
                        )}
                    </Button>
                </DialogContent>
            </Dialog>

            <div
                className={`grid gap-4 ${isListView
                        ? "grid-cols-1"
                        : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    }`}
            >
                {attributions.map((attribution) => (
                    <div
                        key={attribution.id}
                        className="relative group"
                    >
                        <div
                            className="flex items-center p-4 bg-gray-100 rounded-lg cursor-pointer"
                            onClick={async () => {
                                const detailedAttribution =
                                    await AttributionService.getAttributionById(
                                        attribution.id
                                    );

                                navigate("/result", {
                                    state: {
                                        json: detailedAttribution.attribution,
                                        suggestedBudget:
                                            detailedAttribution.proposed_budget,
                                        attributionId: attribution.id,
                                        sector: attribution.sector,
                                        title: attribution.expand?.document_id
                                            .title,
                                    },
                                });
                            }}
                        >
                            <FileIcon className="w-8 h-8 text-gray-500 mr-4" />
                            <div>
                                <p className="text-sm font-medium">
                                    {attribution.expand?.document_id?.title ||
                                        "Untitled"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {new Date(attribution.created).toLocaleDateString()}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {attribution.sector}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                                e.stopPropagation();
                                setDocumentToDelete(attribution.id || null);
                                setShowConfirmDialog(true);
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                ))}
            </div>
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                    </DialogHeader>
                    <p>Are you sure you want to delete this document?</p>
                    <div className="flex justify-end space-x-2 mt-4">
                        <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={async () => {
                                if (documentToDelete) {
                                    await handleDeleteDocument(documentToDelete);
                                    setShowConfirmDialog(false);
                                    setDocumentToDelete(null);
                                }
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FileDisplay;
