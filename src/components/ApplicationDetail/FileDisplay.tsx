import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Eye, Download, FileText, X, ExternalLink, Github, Linkedin, Globe } from "lucide-react";

type FileType = {
  name?: string;
  type?: string;
  url?: string;
  fileName?: string;
  fileType?: string;
  fileUrl?: string;
};

export const FileDisplay = ({
  file,
  label,
}: {
  file: FileType | string | FileType[] | string[];
  label: string;
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [pdfError, setPdfError] = useState(false);
  const [docxError, setDocxError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Helper function to normalize files to array
  const normalizeFiles = (): Array<{ name: string; type: string; url: string }> => {
    if (!file) return [];

    const files = Array.isArray(file) ? file : [file];
    
    return files.map((f, index) => {
      if (typeof f === "string") {
        return parseStringFile(f, index);
      }
      return {
        name: f.name || f.fileName || `File ${index + 1}`,
        type: f.type || f.fileType || "document",
        url: f.url || f.fileUrl || "",
      };
    }).filter(f => f.url); // Only return files with URLs
  };

  // Helper function to parse string file URLs
  const parseStringFile = (url: string, index: number) => {
    // Extract filename from URL
    let fileName = url.split("/").pop()?.split("?")[0] || `File ${index + 1}`;
    let fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

    // Special handling for Cloudinary URLs
    if (url.includes("cloudinary.com") && url.includes("/raw/upload/")) {
      const pathParts = url.split("/");
      const lastPart = pathParts[pathParts.length - 1].split("?")[0];
      const extensionMatch = lastPart.match(/\.([a-z0-9]+)$/i);
      if (extensionMatch) {
        fileName = lastPart;
        fileExtension = extensionMatch[1].toLowerCase();
      }
    }

    // Determine file type
    let fileType = "document";
    const imageExts = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];
    const videoExts = ["mp4", "avi", "mov", "wmv", "flv", "webm"];
    const audioExts = ["mp3", "wav", "flac", "aac", "ogg"];

    if (imageExts.includes(fileExtension)) {
      fileType = "image";
    } else if (fileExtension === "pdf") {
      fileType = "pdf";
    } else if (fileExtension === "docx") {
      fileType = "docx";
    } else if (videoExts.includes(fileExtension)) {
      fileType = "video";
    } else if (audioExts.includes(fileExtension)) {
      fileType = "audio";
    }

    // Check for external links
    const domain = url.toLowerCase();
    if (domain.includes("github.com") || domain.includes("github.io")) {
      return { name: "GitHub Repository", type: "external-github", url };
    }
    if (domain.includes("linkedin.com")) {
      return { name: "LinkedIn Profile", type: "external-linkedin", url };
    }
    if (label.toLowerCase() === "portfolio" && (url.startsWith("http://") || url.startsWith("https://"))) {
      return { name: "Portfolio Website", type: "external-portfolio", url };
    }

    return { name: fileName, type: fileType, url };
  };

  const allFiles = normalizeFiles();
  
  if (allFiles.length === 0) {
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
            <FileText className="h-5 w-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">No files available</p>
            <p className="text-xs text-red-500">Files not available</p>
          </div>
        </div>
      </div>
    );
  }

  const currentFile = allFiles[selectedFileIndex] || allFiles[0];
  const isMultiple = allFiles.length > 1;

  const isImage = currentFile.type === "image";
  const isPDF = currentFile.type === "pdf";
  const isDocx = currentFile.type === "docx";
  const isExternal = currentFile.type.startsWith("external-");
  const isVideo = currentFile.type === "video";
  const isAudio = currentFile.type === "audio";
  const canPreview = isImage || isPDF || isVideo || isAudio || isDocx;

  const handleFileDownload = () => {
    if (currentFile.url) {
      if (currentFile.url.includes("cloudinary.com") && !isExternal) {
        const downloadUrl = currentFile.url.includes("?")
          ? `${currentFile.url}&fl_attachment`
          : `${currentFile.url}?fl_attachment`;
        window.open(downloadUrl, "_blank");
      } else {
        window.open(currentFile.url, "_blank");
      }
    }
  };

  const handlePreviewOpen = (index: number = selectedFileIndex) => {
    setSelectedFileIndex(index);
    setImageError(false);
    setPdfError(false);
    setDocxError(false);
    setLoading(true);
    setPreviewOpen(true);
  };

  // Render single file or first file if multiple
  const renderFileItem = (fileInfo: { name: string; type: string; url: string }, index: number, showActions: boolean = true) => {
    const isItemExternal = fileInfo.type.startsWith("external-");
    const isItemImage = fileInfo.type === "image";

    // External link display
    if (isItemExternal) {
      const getExternalIcon = () => {
        if (fileInfo.type === "external-github") return <Github className="h-5 w-5 text-blue-600" />;
        if (fileInfo.type === "external-linkedin") return <Linkedin className="h-5 w-5 text-blue-600" />;
        if (fileInfo.type === "external-portfolio") return <Globe className="h-5 w-5 text-purple-600" />;
        return <ExternalLink className="h-5 w-5 text-blue-600" />;
      };

      const getBgColor = () => {
        if (fileInfo.type === "external-portfolio") return "bg-purple-50 border-purple-200";
        return "bg-blue-50 border-blue-200";
      };

      return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${getBgColor()}`}>
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`w-10 h-10 ${fileInfo.type === "external-portfolio" ? "bg-purple-100" : "bg-blue-100"} rounded flex items-center justify-center`}>
              {getExternalIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{fileInfo.name}</p>
              <p className="text-xs text-blue-600">{isMultiple ? `${label} ${index + 1}` : label}</p>
            </div>
          </div>
          {showActions && (
            <Button
              onClick={() => window.open(fileInfo.url, "_blank")}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open Link
            </Button>
          )}
        </div>
      );
    }

    // Regular file display
    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {isItemImage && !imageError ? (
            <img
              src={fileInfo.url}
              alt={fileInfo.name}
              className="w-10 h-10 object-cover rounded"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-10 h-10 bg-blue-100 rounded flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{fileInfo.name}</p>
            <p className="text-xs text-gray-500">
              {isMultiple ? `${label} ${index + 1}` : label} • {fileInfo.type.toUpperCase()}
            </p>
          </div>
        </div>

        {showActions && (
          <div className="flex items-center gap-2 ml-3">
            <Button
              onClick={() => handlePreviewOpen(index)}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
              disabled={!canPreview}
            >
              <Eye className="h-4 w-4" />
              {canPreview ? "Preview" : "No Preview"}
            </Button>
            <Button
              onClick={() => handlePreviewOpen(index)}
              variant="outline"
              size="sm"
              className="sm:hidden p-2"
              disabled={!canPreview}
            >
              <Eye className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleFileDownload}
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            <Button 
              onClick={handleFileDownload} 
              variant="outline" 
              size="sm" 
              className="sm:hidden p-2"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  // If multiple files, show as a list
  if (isMultiple) {
    return (
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-900 mb-2">
          {label} ({allFiles.length} files)
        </div>
        {allFiles.map((fileInfo, index) => (
          <div key={index}>
            {renderFileItem(fileInfo, index, true)}
          </div>
        ))}
        
        {/* Preview Dialog for multiple files */}
        <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
          <DialogContent
            showCloseButton={false}
            aria-describedby={undefined}
            className="max-w-[95vw] w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] overflow-auto p-2 sm:p-4 md:p-6"
          >
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span className="truncate pr-4 text-sm sm:text-base md:text-lg">
                  {currentFile.name} ({selectedFileIndex + 1} of {allFiles.length})
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => setSelectedFileIndex(Math.max(0, selectedFileIndex - 1))}
                      variant="ghost"
                      size="sm"
                      disabled={selectedFileIndex === 0}
                      className="h-8 w-8 p-0"
                    >
                      ←
                    </Button>
                    <Button
                      onClick={() => setSelectedFileIndex(Math.min(allFiles.length - 1, selectedFileIndex + 1))}
                      variant="ghost"
                      size="sm"
                      disabled={selectedFileIndex === allFiles.length - 1}
                      className="h-8 w-8 p-0"
                    >
                      →
                    </Button>
                  </div>
                  <Button
                    onClick={() => setPreviewOpen(false)}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-2 sm:mt-4">
              {/* Preview content based on file type */}
              {renderPreviewContent(currentFile)}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Single file display
  return (
    <>
      {renderFileItem(currentFile, 0, true)}
      
      {/* Preview Dialog for single file */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent
          showCloseButton={false}
          aria-describedby={undefined}
          className="max-w-[95vw] w-full sm:max-w-3xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl max-h-[95vh] overflow-auto p-2 sm:p-4 md:p-6"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="truncate pr-4 text-sm sm:text-base md:text-lg">{currentFile.name}</span>
              <Button
                onClick={() => setPreviewOpen(false)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          <div className="mt-2 sm:mt-4">
            {renderPreviewContent(currentFile)}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );

  // Helper function to render preview content
  function renderPreviewContent(fileInfo: { name: string; type: string; url: string }) {
    const isItemImage = fileInfo.type === "image";
    const isItemPDF = fileInfo.type === "pdf";
    const isItemDocx = fileInfo.type === "docx";
    const isItemVideo = fileInfo.type === "video";
    const isItemAudio = fileInfo.type === "audio";

    if (isItemImage && !imageError) {
      return (
        <div className="flex flex-col items-center">
          {loading && (
            <div className="flex items-center justify-center w-full h-48 sm:h-64 md:h-80 lg:h-96 bg-gray-100 rounded-lg">
              <div className="text-gray-500 text-sm sm:text-base">Loading image...</div>
            </div>
          )}
          <img
            src={fileInfo.url}
            alt={fileInfo.name}
            className={`w-full h-auto max-h-[75vh] object-contain rounded-lg shadow-lg ${loading ? "hidden" : ""}`}
            onLoad={() => setLoading(false)}
            onLoadStart={() => setLoading(true)}
            onError={() => {
              setImageError(true);
              setLoading(false);
            }}
          />
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4 w-full sm:w-auto">
            <Button onClick={handleFileDownload} variant="outline" className="w-full sm:w-auto">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={() => window.open(fileInfo.url, "_blank")}
              variant="outline"
              className="w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    if (isItemPDF && !pdfError) {
      return (
        <div className="flex flex-col">
          <div className="w-full h-[70vh] border rounded-lg overflow-hidden relative">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="text-gray-500">Loading PDF...</div>
              </div>
            )}
            <iframe
              src={`${fileInfo.url}#toolbar=1&navpanes=1&scrollbar=1`}
              className="w-full h-full"
              title={fileInfo.name}
              onLoad={() => setLoading(false)}
              onError={() => {
                setPdfError(true);
                setLoading(false);
              }}
            />
          </div>
          <div className="flex gap-3 mt-4 justify-center">
            <Button onClick={handleFileDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button onClick={() => window.open(fileInfo.url, "_blank")} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    if (isItemDocx && !docxError) {
      const docxPreviewUrl = `https://docs.google.com/gview?url=${fileInfo.url}&embedded=true`;
      return (
        <div className="flex flex-col">
          <div className="w-full h-[70vh] border rounded-lg overflow-hidden relative bg-white">
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                <div className="text-gray-500">Loading DOCX preview...</div>
              </div>
            )}
            <iframe
              src={docxPreviewUrl}
              className="w-full h-full border-0"
              title={`Preview of ${fileInfo.name}`}
              onLoad={() => setLoading(false)}
              onError={() => {
                setDocxError(true);
                setLoading(false);
              }}
            />
          </div>
          <div className="flex gap-3 mt-4 justify-center">
            <Button onClick={handleFileDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download DOCX
            </Button>
            <Button onClick={() => window.open(docxPreviewUrl, "_blank")} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Open Preview
            </Button>
          </div>
        </div>
      );
    }

    if (isItemVideo) {
      return (
        <div className="flex flex-col items-center">
          <video
            controls
            className="w-full max-h-[70vh] rounded-lg shadow-lg"
            preload="metadata"
          >
            <source src={fileInfo.url} />
            Your browser does not support the video tag.
          </video>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleFileDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => window.open(fileInfo.url, "_blank")} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    if (isItemAudio) {
      return (
        <div className="flex flex-col items-center">
          <div className="w-full max-w-lg p-8 bg-gray-50 rounded-lg">
            <audio controls className="w-full">
              <source src={fileInfo.url} />
              Your browser does not support the audio tag.
            </audio>
          </div>
          <div className="flex gap-3 mt-4">
            <Button onClick={handleFileDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button onClick={() => window.open(fileInfo.url, "_blank")} variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Open in New Tab
            </Button>
          </div>
        </div>
      );
    }

    // Fallback for unsupported file types
    return (
      <div className="text-center py-12">
        <FileText className="h-20 w-20 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 mb-2">Preview not available for this file type</p>
        <p className="text-sm text-gray-400 mb-6">{fileInfo.type.toUpperCase()} • {fileInfo.name}</p>
        <div className="flex gap-3 justify-center">
          <Button onClick={handleFileDownload} className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Download to View
          </Button>
          <Button onClick={() => window.open(fileInfo.url, "_blank")} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Open in New Tab
          </Button>
        </div>
      </div>
    );
  }
};
