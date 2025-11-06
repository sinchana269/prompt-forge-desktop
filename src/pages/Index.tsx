import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, LogOut, Settings, Cloud, Menu, X } from "lucide-react";
import FileExplorer from "@/components/FileExplorer";
import AdvancedSearch from "@/components/AdvancedSearch";
import ChatInterface from "@/components/ChatInterface";
import FileViewer from "@/components/FileViewer";
import CloudSyncDialog from "@/components/CloudSyncDialog";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
}

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCloudSync, setShowCloudSync] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("synapse_auth");
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSearch = (filters: any) => {
    setSearchQuery(JSON.stringify(filters));
    setShowChat(true);
    setSelectedFile(null);
    setMobileMenuOpen(false);
  };

  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setShowChat(false);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("synapse_auth");
    navigate("/auth");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-toolbar-border bg-toolbar-background flex items-center justify-between px-4 gap-3">
        {/* Mobile Menu Toggle */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <FileExplorer onFileSelect={handleFileSelect} />
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-ai-secondary flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold hidden sm:block">Project Synapse</h1>
        </div>

        <div className="hidden md:flex flex-1 justify-center px-4 max-w-3xl">
          <AdvancedSearch onSearch={handleSearch} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setShowCloudSync(true)}>
              <Cloud className="h-4 w-4 mr-2" />
              Cloud Sync
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 py-3 border-b border-toolbar-border bg-toolbar-background">
        <AdvancedSearch onSearch={handleSearch} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar - Desktop */}
        <div className="w-64 flex-shrink-0 hidden lg:block">
          <FileExplorer onFileSelect={handleFileSelect} />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          {showChat ? (
            <ChatInterface initialQuery={searchQuery} />
          ) : selectedFile ? (
            <FileViewer fileName={selectedFile.name} onClose={() => setSelectedFile(null)} />
          ) : (
            <div className="h-full flex items-center justify-center bg-muted/20">
              <div className="text-center max-w-md px-4">
                <div className="flex justify-center mb-6">
                  <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-ai-secondary flex items-center justify-center shadow-lg">
                    <Brain className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-semibold mb-3">Welcome to Project Synapse</h2>
                <p className="text-muted-foreground mb-6">
                  Transform your unstructured data into actionable intelligence. Select a file from
                  the explorer or use the search bar to ask questions about your documents.
                </p>
                <div className="space-y-2 text-sm text-muted-foreground text-left">
                  <p>• Browse files in the explorer</p>
                  <p>• Ask AI questions about your documents</p>
                  <p>• View and edit files directly</p>
                  <p>• Get intelligent insights from your data</p>
                </div>
              </div>
            </div>
        )}
        </div>
      </div>

      <CloudSyncDialog open={showCloudSync} onOpenChange={setShowCloudSync} />
    </div>
  );
};

export default Index;
