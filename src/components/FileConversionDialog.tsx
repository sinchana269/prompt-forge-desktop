import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileType, ArrowRight, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileConversionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileName: string;
  currentFormat: string;
}

const FileConversionDialog = ({ open, onOpenChange, fileName, currentFormat }: FileConversionDialogProps) => {
  const [targetFormat, setTargetFormat] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);

  const availableFormats = {
    pdf: ["docx", "txt", "html"],
    docx: ["pdf", "txt", "html"],
    xlsx: ["csv", "pdf"],
    txt: ["pdf", "docx"],
    md: ["pdf", "docx", "html"],
  };

  const formats = availableFormats[currentFormat as keyof typeof availableFormats] || [];

  const handleConvert = async () => {
    if (!targetFormat) return;

    setIsConverting(true);
    setProgress(0);

    // Simulate conversion progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsConverting(false);
            setProgress(0);
            onOpenChange(false);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileType className="h-5 w-5" />
            Convert File Format
          </DialogTitle>
          <DialogDescription>
            Convert "{fileName}" to a different format.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 space-y-2">
              <Label>Current Format</Label>
              <div className="h-10 px-3 py-2 rounded-md border bg-muted flex items-center justify-center font-medium uppercase">
                {currentFormat}
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground mt-6" />
            <div className="flex-1 space-y-2">
              <Label>Target Format</Label>
              <Select value={targetFormat} onValueChange={setTargetFormat} disabled={isConverting}>
                <SelectTrigger>
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format.toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isConverting && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Converting...</span>
                <span className="font-medium">{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isConverting}
          >
            Cancel
          </Button>
          <Button onClick={handleConvert} disabled={!targetFormat || isConverting}>
            {isConverting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Converting...
              </>
            ) : (
              "Convert"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileConversionDialog;
