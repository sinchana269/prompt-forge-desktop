import { useState } from "react";
import { Search, Filter, Calendar, FolderOpen, FileText, AlignLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface SearchFilters {
  query: string;
  dateFrom?: Date;
  dateTo?: Date;
  directory?: string;
  fileType?: string;
  searchIn: "filename" | "content" | "both";
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
}

const AdvancedSearch = ({ onSearch }: AdvancedSearchProps) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    searchIn: "both",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.query.trim()) {
      onSearch(filters);
    }
  };

  const clearFilter = (key: keyof SearchFilters) => {
    setFilters((prev) => ({ ...prev, [key]: undefined }));
  };

  const activeFiltersCount = [
    filters.dateFrom,
    filters.dateTo,
    filters.directory,
    filters.fileType,
  ].filter(Boolean).length;

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-2 w-full max-w-3xl">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files by name or content..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
            className="pl-10 pr-4"
          />
        </div>
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" className="relative">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Search In</label>
                <Select
                  value={filters.searchIn}
                  onValueChange={(value: any) =>
                    setFilters((prev) => ({ ...prev, searchIn: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="both">Filename & Content</SelectItem>
                    <SelectItem value="filename">Filename Only</SelectItem>
                    <SelectItem value="content">Content Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="justify-start text-left">
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? format(filters.dateFrom, "PP") : "From"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) => setFilters((prev) => ({ ...prev, dateFrom: date }))}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="justify-start text-left">
                        <Calendar className="mr-2 h-4 w-4" />
                        {filters.dateTo ? format(filters.dateTo, "PP") : "To"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => setFilters((prev) => ({ ...prev, dateTo: date }))}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Directory</label>
                <Select
                  value={filters.directory}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, directory: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All directories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Directories</SelectItem>
                    <SelectItem value="documents">Documents</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">File Type</label>
                <Select
                  value={filters.fileType}
                  onValueChange={(value) =>
                    setFilters((prev) => ({ ...prev, fileType: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="pdf">.pdf</SelectItem>
                    <SelectItem value="docx">.docx</SelectItem>
                    <SelectItem value="xlsx">.xlsx</SelectItem>
                    <SelectItem value="txt">.txt</SelectItem>
                    <SelectItem value="md">.md</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  setFilters({ query: filters.query, searchIn: "both" })
                }
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Button type="submit" className="hidden sm:flex">
          Search
        </Button>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.dateFrom && (
            <Badge variant="secondary" className="gap-1">
              From: {format(filters.dateFrom, "PP")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("dateFrom")}
              />
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary" className="gap-1">
              To: {format(filters.dateTo, "PP")}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("dateTo")}
              />
            </Badge>
          )}
          {filters.directory && filters.directory !== "all" && (
            <Badge variant="secondary" className="gap-1">
              <FolderOpen className="h-3 w-3" />
              {filters.directory}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("directory")}
              />
            </Badge>
          )}
          {filters.fileType && filters.fileType !== "all" && (
            <Badge variant="secondary" className="gap-1">
              <FileText className="h-3 w-3" />
              {filters.fileType}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => clearFilter("fileType")}
              />
            </Badge>
          )}
        </div>
      )}

      <Button type="submit" className="sm:hidden w-full">
        Search
      </Button>
    </form>
  );
};

export default AdvancedSearch;
