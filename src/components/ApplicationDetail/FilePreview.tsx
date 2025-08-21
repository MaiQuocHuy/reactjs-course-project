import { Download, FileText, ImageIcon, File, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type FileItem = {
  type: "image" | "pdf" | "docx";
  url: string;
  name: string;
};

interface FilePreviewProps {
  file: FileItem;
}

export function FilePreview({ file }: FilePreviewProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case "image":
        return <ImageIcon className="h-5 w-5" />;
      case "pdf":
        return <FileText className="h-5 w-5" />;
      case "docx":
        return <File className="h-5 w-5" />;
      default:
        return <File className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        {getFileIcon(file.type)}
        <div>
          <p className="font-medium text-sm">{file.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{file.type} file</p>
        </div>
      </div>
      <div className="flex gap-2">
        {file.type === "image" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Preview</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{file.name}</DialogTitle>
              </DialogHeader>
              <div className="flex justify-center">
                <img
                  src={file.url || "/placeholder.svg"}
                  alt={file.name}
                  className="max-w-full max-h-[70vh] object-contain"
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
        {file.type === "pdf" && (
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 md:mr-2" />
                <span className="hidden md:inline">Preview</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>{file.name}</DialogTitle>
              </DialogHeader>
              <div className="h-[70vh] flex items-center justify-center bg-muted rounded">
                <div className="text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">PDF Preview would be displayed here</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    In a real implementation, use react-pdf library
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 md:mr-2" />
          <span className="hidden md:inline">Download</span>
        </Button>
      </div>
    </div>
  );
}
