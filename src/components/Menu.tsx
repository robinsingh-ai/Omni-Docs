import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

interface MenuProps {
    options: { value: string; label: string }[]; // Array of options for the menu
    placeholder: string; // Placeholder text for the select
    onChange?: (value: string) => void; // Optional callback for value changes
}

export default function Menu({ options, placeholder, onChange }: MenuProps) {
    return (
        <Select onValueChange={onChange}>
            <SelectTrigger className="w-[120px]">
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center">
                            <span className="mr-2">{option.label}</span>
                            {/* <RepeatIcon size={16} /> */}
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
