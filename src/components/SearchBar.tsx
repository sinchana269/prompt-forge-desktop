import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full max-w-3xl">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Ask Synapse anything about your files..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-4 bg-background border-border"
        />
      </div>
      <Button type="submit" className="gap-2">
        <Sparkles className="h-4 w-4" />
        Ask AI
      </Button>
    </form>
  );
};

export default SearchBar;
