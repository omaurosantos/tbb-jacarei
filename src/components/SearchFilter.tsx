import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  showDateFilter?: boolean;
  filterMonth: number | null;
  filterYear: number | null;
  onMonthChange: (value: number | null) => void;
  onYearChange: (value: number | null) => void;
  availableYears?: number[];
  compact?: boolean;
}

const months = [
  { value: 0, label: "Janeiro" },
  { value: 1, label: "Fevereiro" },
  { value: 2, label: "Março" },
  { value: 3, label: "Abril" },
  { value: 4, label: "Maio" },
  { value: 5, label: "Junho" },
  { value: 6, label: "Julho" },
  { value: 7, label: "Agosto" },
  { value: 8, label: "Setembro" },
  { value: 9, label: "Outubro" },
  { value: 10, label: "Novembro" },
  { value: 11, label: "Dezembro" },
];

export function SearchFilter({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Buscar...",
  showDateFilter = true,
  filterMonth,
  filterYear,
  onMonthChange,
  onYearChange,
  availableYears = [],
  compact = false,
}: SearchFilterProps) {
  const currentYear = new Date().getFullYear();
  const years = availableYears.length > 0 
    ? availableYears 
    : Array.from({ length: 5 }, (_, i) => currentYear - i);

  const hasFilters = searchQuery || filterMonth !== null || filterYear !== null;

  const clearFilters = () => {
    onSearchChange("");
    onMonthChange(null);
    onYearChange(null);
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${compact ? "" : "mb-4"}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Date Filters */}
      {showDateFilter && (
        <div className="flex gap-2">
          <Select
            value={filterMonth !== null ? String(filterMonth) : "all"}
            onValueChange={(val) => onMonthChange(val === "all" ? null : Number(val))}
          >
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Mês" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os meses</SelectItem>
              {months.map((m) => (
                <SelectItem key={m.value} value={String(m.value)}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filterYear !== null ? String(filterYear) : "all"}
            onValueChange={(val) => onYearChange(val === "all" ? null : Number(val))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasFilters && (
            <Button variant="ghost" size="icon" onClick={clearFilters} title="Limpar filtros">
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
