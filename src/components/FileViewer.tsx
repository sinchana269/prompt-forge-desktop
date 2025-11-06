import { useState } from "react";
import { X, Save, Edit2, Copy, FileText, Download, FileType, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import PasswordDialog from "@/components/PasswordDialog";
import FileConversionDialog from "@/components/FileConversionDialog";

interface FileViewerProps {
  fileName: string;
  onClose: () => void;
}

const FileViewer = ({ fileName, onClose }: FileViewerProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(
    `# ${fileName}\n\nThis is a preview of the file content.\n\nYou can view and edit the file here.`
  );
  const [originalContent, setOriginalContent] = useState(content);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showConversionDialog, setShowConversionDialog] = useState(false);
  const [isPasswordProtected] = useState(fileName.includes("Protected"));

  const fileExtension = fileName.split(".").pop()?.toLowerCase() || "txt";
  const fileTags = ["Document", "Important", "Q4"];

  const handleSave = () => {
    setOriginalContent(content);
    setIsEditing(false);
    toast.success("File saved successfully");
  };

  const handleCancel = () => {
    setContent(originalContent);
    setIsEditing(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    toast.success("Content copied to clipboard");
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("File downloaded");
  };

  const handlePasswordSubmit = (password: string) => {
    console.log("Password verified:", password);
    toast.success("File unlocked successfully");
  };

  return (
    <>
      <div className="h-full flex flex-col bg-editor-background">
        {/* File Header */}
        <div className="border-b border-editor-border bg-editor-toolbar">
          <div className="h-14 flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold">{fileName}</h2>
                  {isPasswordProtected && (
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Lock className="h-3 w-3" />
                      Protected
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1 mt-1">
                  {fileTags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="sm:hidden">
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Action Toolbar */}
          <div className="flex items-center gap-2 px-4 pb-3 overflow-x-auto">
            {!isEditing ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  <Copy className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Copy</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit2 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Edit</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Download</span>
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowConversionDialog(true)}>
                  <FileType className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Convert</span>
                </Button>
                {isPasswordProtected && (
                  <Button variant="ghost" size="sm" onClick={() => setShowPasswordDialog(true)}>
                    <Lock className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">Unlock</span>
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" onClick={onClose} className="hidden sm:flex ml-auto">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <Card className="max-w-4xl mx-auto p-6">
            {isEditing ? (
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full h-full min-h-[500px] font-mono text-sm resize-none"
              />
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <pre className="whitespace-pre-wrap font-mono text-sm">{content}</pre>
              </div>
            )}
          </Card>
        </div>
      </div>

      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
        fileName={fileName}
        onSubmit={handlePasswordSubmit}
      />

      <FileConversionDialog
        open={showConversionDialog}
        onOpenChange={setShowConversionDialog}
        fileName={fileName}
        currentFormat={fileExtension}
      />
    </>
  );
};

export default FileViewer;
