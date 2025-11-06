import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Brain, LogOut, Settings } from "lucide-react";
import FileExplorer from "@/components/FileExplorer";
import SearchBar from "@/components/SearchBar";
import ChatInterface from "@/components/ChatInterface";
import FileViewer from "@/components/FileViewer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("synapse_auth");
    if (!isAuthenticated) {
      navigate("/auth");
    }
  }, [navigate]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowChat(true);
    setSelectedFile(null);
  };

  const handleFileSelect = (file: FileNode) => {
    if (file.type === "file") {
      setSelectedFile(file);
      setShowChat(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("synapse_auth");
    navigate("/auth");
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top Toolbar */}
      <div className="h-14 border-b border-toolbar-border bg-toolbar-background flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-ai-secondary flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-lg font-semibold">Project Synapse</h1>
        </div>

        <div className="flex-1 flex justify-center px-8">
          <SearchBar onSearch={handleSearch} />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer Sidebar */}
        <div className="w-64 flex-shrink-0">
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
    </div>
  );
};

export default Index;
