type Props = {
  videoUrl: string;
};

const VideoContent = ({ videoUrl }: Props) => {
  return (
    <>
      {videoUrl ? (
        <div className="space-y-3">
          {/* Video Information */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium">Lesson video</span>
            </div>
          </div>

          {/* Video Preview */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            <video
              src={videoUrl}
              controls
              style={{
                width: '100%',
                maxHeight: '55vh',
                objectFit: 'contain',
                background: '#000',
                borderRadius: '12px',
              }}
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <p className="text-sm text-muted-foreground">No Video Found!</p>
        </div>
      )}
    </>
  );
};

export default VideoContent;
