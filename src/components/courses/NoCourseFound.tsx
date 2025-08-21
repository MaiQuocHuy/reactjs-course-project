type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

const NoCourseFound = (props: Props) => {
  const { title, description, actionLabel, onAction } = props;
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-semibold mb-2">{title}</h2>
      {description && <p className="text-sm text-gray-600">{description}</p>}
      {actionLabel && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default NoCourseFound;
