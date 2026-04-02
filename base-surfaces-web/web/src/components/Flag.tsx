interface FlagProps {
  code: string;
  intrinsicSize?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
}

export function Flag({ code, intrinsicSize = 64, className, loading = 'lazy' }: FlagProps) {
  return (
    <img
      className={`wds-flag wds-flag-${code.toLowerCase()}${className ? ` ${className}` : ''}`}
      src={`/flags/${code.toLowerCase()}.svg`}
      loading={loading}
      alt=""
      width={intrinsicSize}
      height={intrinsicSize}
    />
  );
}
