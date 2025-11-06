import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Tag } from "lucide-react";

interface FileTooltipProps {
  children: React.ReactNode;
  fileName: string;
  summary: string;
  tags: string[];
  dateModified: string;
  size: string;
}

const FileTooltip = ({ children, fileName, summary, tags, dateModified, size }: FileTooltipProps) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side="right" className="w-80 p-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">{size}</p>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-medium">Summary</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{summary}</p>
            </div>

            {tags.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-medium flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  Tags
                </p>
                <div className="flex flex-wrap gap-1">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1 border-t">
              <Calendar className="h-3 w-3" />
              Modified: {dateModified}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default FileTooltip;
