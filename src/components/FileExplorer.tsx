import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import FileTooltip from "@/components/FileTooltip";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  children?: FileNode[];
}

interface FileExplorerProps {
  onFileSelect: (file: FileNode) => void;
}

const FileExplorer = ({ onFileSelect }: FileExplorerProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(["root"]));
  const [workingDirectory, setWorkingDirectory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Sample file structure with metadata
  const [fileTree] = useState<FileNode>({
    id: "root",
    name: "Workspace",
    type: "folder",
    children: [
      {
        id: "1",
        name: "Documents",
        type: "folder",
        children: [
          { id: "1-1", name: "Q4_Report.pdf", type: "file" },
          { id: "1-2", name: "Budget_2024.xlsx", type: "file" },
          { id: "1-3", name: "Meeting_Notes.docx", type: "file" },
        ],
      },
      {
        id: "2",
        name: "Research",
        type: "folder",
        children: [
          { id: "2-1", name: "AI_Analysis.pdf", type: "file" },
          { id: "2-2", name: "Data_Summary.txt", type: "file" },
        ],
      },
      { id: "3", name: "Project_Brief.md", type: "file" },
    ],
  });

  // Mock metadata for tooltips
  const fileMetadata: Record<string, { summary: string; tags: string[]; dateModified: string; size: string }> = {
    "1-1": {
      summary: "Quarterly financial report covering revenue, expenses, and projections for Q4 2024.",
      tags: ["Finance", "Report", "Q4"],
      dateModified: "2024-12-15",
      size: "2.4 MB",
    },
    "1-2": {
      summary: "Annual budget planning document with detailed expense breakdowns and allocations.",
      tags: ["Budget", "Planning", "Finance"],
      dateModified: "2024-11-20",
      size: "1.8 MB",
    },
    "1-3": {
      summary: "Notes from the monthly team meeting discussing project milestones and deadlines.",
      tags: ["Meeting", "Team", "Notes"],
      dateModified: "2024-12-01",
      size: "156 KB",
    },
    "2-1": {
      summary: "Comprehensive AI market analysis covering trends, competitors, and opportunities.",
      tags: ["AI", "Analysis", "Research"],
      dateModified: "2024-11-28",
      size: "3.2 MB",
    },
    "2-2": {
      summary: "Statistical summary of collected data with key insights and visualization notes.",
      tags: ["Data", "Summary", "Statistics"],
      dateModified: "2024-11-15",
      size: "82 KB",
    },
    "3": {
      summary: "Project overview document outlining goals, timeline, and deliverables.",
      tags: ["Project", "Brief", "Documentation"],
      dateModified: "2024-10-30",
      size: "45 KB",
    },
  };

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleAddDirectory = () => {
    if (workingDirectory) {
      // Simulate adding directory
      setIsDialogOpen(false);
      setWorkingDirectory("");
    }
  };

  const renderFileTree = (node: FileNode, level: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const paddingLeft = level * 16;
    const metadata = fileMetadata[node.id];

    const fileButton = (
      <button
        onClick={() => {
          if (node.type === "folder") {
            toggleFolder(node.id);
          } else {
            onFileSelect(node);
          }
        }}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-sm hover:bg-sidebar-accent text-sidebar-foreground transition-colors rounded-md"
        style={{ paddingLeft: `${paddingLeft + 12}px` }}
      >
        {node.type === "folder" ? (
          <>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 flex-shrink-0" />
            ) : (
              <ChevronRight className="h-4 w-4 flex-shrink-0" />
            )}
            <Folder className="h-4 w-4 flex-shrink-0 text-primary" />
          </>
        ) : (
          <>
            <span className="w-4" />
            <File className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
          </>
        )}
        <span className="truncate flex-1 text-left">{node.name}</span>
        {metadata && metadata.tags.length > 0 && (
          <Badge variant="secondary" className="text-xs px-1 py-0 h-4">
            {metadata.tags.length}
          </Badge>
        )}
      </button>
    );

    return (
      <div key={node.id}>
        {node.type === "file" && metadata ? (
          <FileTooltip
            fileName={node.name}
            summary={metadata.summary}
            tags={metadata.tags}
            dateModified={metadata.dateModified}
            size={metadata.size}
          >
            {fileButton}
          </FileTooltip>
        ) : (
          fileButton
        )}
        {node.type === "folder" && isExpanded && node.children && (
          <div>{node.children.map((child) => renderFileTree(child, level + 1))}</div>
        )}
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-sidebar-background border-r border-sidebar-border">
      <div className="p-3 border-b border-sidebar-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-sidebar-foreground">Explorer</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              <FolderPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Working Directory</DialogTitle>
              <DialogDescription>
                Enter the path to the directory you want to add to your workspace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="directory">Directory Path</Label>
                <Input
                  id="directory"
                  placeholder="/path/to/directory"
                  value={workingDirectory}
                  onChange={(e) => setWorkingDirectory(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDirectory}>Add Directory</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex-1 overflow-y-auto p-2">{renderFileTree(fileTree)}</div>
    </div>
  );
};

export default FileExplorer;
