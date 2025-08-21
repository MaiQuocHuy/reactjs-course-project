type Props = {
  countSection: number;
  countLesson: number;
  totalDuration: number;
};

const CourseStatistics = ({
  countSection,
  countLesson,
  totalDuration,
}: Props) => {
  // helper to format seconds into Hh Mm format
  function formatDuration(totalSeconds: number) {
    if (!totalSeconds || totalSeconds <= 0) return '0m';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    return `${minutes}m ${seconds}s`;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-50 to-white border space-x-3">
        <span className="text-sm text-muted-foreground">Sections</span>
        <span className="text-2xl font-semibold">{countSection}</span>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-emerald-50 to-white border space-x-3">
        <span className="text-sm text-muted-foreground">Lessons</span>
        <span className="text-2xl font-semibold">{countLesson}</span>
      </div>

      <div className="p-4 rounded-lg bg-gradient-to-r from-rose-50 to-white border space-x-3">
        <span className="text-sm text-muted-foreground">Total Duration</span>
        <span className="text-2xl font-semibold">
          {formatDuration(totalDuration)}
        </span>
      </div>
    </div>
  );
};

export default CourseStatistics;
