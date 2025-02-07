import React from "react";
import { ChevronRight, ChevronDown, Folder, File } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeItemProps {
  children?: React.ReactNode;
  label?: string;
  isFolder?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
}

const TreeItem = ({ 
  children, 
  label = "", 
  isFolder = false, 
  isOpen = false,
  onToggle 
}: TreeItemProps) => {
  return (
    <div>
      <div 
        className="flex items-center gap-2 py-1 px-2 hover:bg-accent rounded-sm cursor-pointer"
        onClick={onToggle}
      >
        {isFolder && (
          <span className="w-4 h-4">
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {isFolder ? <Folder className="w-4 h-4" /> : <File className="w-4 h-4" />}
        <span className="text-sm">{label}</span>
      </div>
      {isOpen && children && (
        <div className="ml-4">{children}</div>
      )}
    </div>
  );
};

const Tree = ({ children }: { children: React.ReactNode }) => {
  return <div className="space-y-1">{children}</div>;
};

export { Tree, TreeItem }; 