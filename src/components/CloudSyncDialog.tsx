import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Cloud, RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CloudSyncDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CloudSyncDialog = ({ open, onOpenChange }: CloudSyncDialogProps) => {
  const [syncEnabled, setSyncEnabled] = useState({
    onedrive: false,
    googledrive: false,
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const handleSync = async () => {
    setIsSyncing(true);
    // Simulate sync
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date());
    }, 2000);
  };

  const handleConnect = (provider: "onedrive" | "googledrive") => {
    // In real app, this would open OAuth flow
    console.log(`Connecting to ${provider}...`);
    setSyncEnabled((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Cloud Sync Settings
          </DialogTitle>
          <DialogDescription>
            Connect and sync your files with cloud storage providers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Label htmlFor="onedrive" className="text-base">
                    OneDrive
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {syncEnabled.onedrive ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {syncEnabled.onedrive && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
                <Switch
                  id="onedrive"
                  checked={syncEnabled.onedrive}
                  onCheckedChange={() => handleConnect("onedrive")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                  <Cloud className="h-5 w-5 text-white" />
                </div>
                <div>
                  <Label htmlFor="googledrive" className="text-base">
                    Google Drive
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {syncEnabled.googledrive ? "Connected" : "Not connected"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {syncEnabled.googledrive && (
                  <Badge variant="secondary" className="text-xs">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
                <Switch
                  id="googledrive"
                  checked={syncEnabled.googledrive}
                  onCheckedChange={() => handleConnect("googledrive")}
                />
              </div>
            </div>
          </div>

          {(syncEnabled.onedrive || syncEnabled.googledrive) && (
            <div className="pt-4 border-t space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last synced:</span>
                <span className="text-sm font-medium">
                  {lastSync ? lastSync.toLocaleString() : "Never"}
                </span>
              </div>
              <Button
                onClick={handleSync}
                disabled={isSyncing}
                variant="outline"
                size="sm"
                className="w-full"
              >
                {isSyncing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Sync Now
                  </>
                )}
              </Button>
            </div>
          )}

          {!syncEnabled.onedrive && !syncEnabled.googledrive && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <p className="text-muted-foreground">
                Connect at least one cloud provider to enable automatic file synchronization.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CloudSyncDialog;
