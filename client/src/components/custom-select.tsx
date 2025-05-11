import React from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    options: SelectOption[];
    placeholder: string;
    onChange: (value: string) => void;
    all?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    placeholder,
    onChange,
    all = true,
}) => (
    <Select onValueChange={onChange} defaultValue={all ? "clear" : undefined}>
        <SelectTrigger className="w-full">
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            {all && <SelectItem value="clear">All</SelectItem>}
            {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                    {option.label}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
);

export default CustomSelect;
