import ProjectEvaluationTable from "@/components/result-table";
import { Button } from "@/components/ui/button";
import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
    const location = useLocation();
    const navigate = useNavigate();
    const json = location.state?.json || [];
    const jsonArray = [json];
    const suggestedBudget = location.state?.suggestedBudget || 0;
    const attributionId = location.state?.attributionId || "";
    const sector = location.state?.sector || "";
    const title = location.state?.title || "";

    return (
        <div className="p-40 pt-40">
            <div className="mt-10 mb-10">
                <Button
                    onClick={() => navigate(-1)}
                    className="bg-gray-500 text-white px-4 py-2 rounded-md mb-4"
                >
                    Back
                </Button>
                <ProjectEvaluationTable
                    data={jsonArray}
                    suggestedBudget={suggestedBudget}
                    attributionId={attributionId}
                    sector={sector}
                    title={title}
                />
            </div>
        </div>
    );
}
