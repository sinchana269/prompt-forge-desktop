import { useState } from "react";
import { FileText, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface FileViewerProps {
  fileName: string;
  onClose: () => void;
}

const FileViewer = ({ fileName, onClose }: FileViewerProps) => {
  const [content, setContent] = useState(
    `# ${fileName}\n\nThis is a sample file content. You can edit this content and save your changes.\n\nProject Synapse allows you to:\n- View and edit documents\n- Search across all files\n- Get AI-powered insights\n- Collaborate with your team`
  );
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    toast.success("File saved successfully");
    setIsEditing(false);
  };

  return (
    <div className="h-full flex flex-col bg-editor-background">
      <div className="flex items-center justify-between p-3 border-b border-editor-border bg-toolbar-background">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          <span className="font-medium text-sm">{fileName}</span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button size="sm" onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
          <Button size="sm" variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <Card className="max-w-4xl mx-auto p-6">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
            />
          ) : (
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {content}
              </pre>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default FileViewer;
