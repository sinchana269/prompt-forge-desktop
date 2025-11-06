import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

  // Sample file structure
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

    return (
      <div key={node.id}>
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
          <span className="truncate">{node.name}</span>
        </button>
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
