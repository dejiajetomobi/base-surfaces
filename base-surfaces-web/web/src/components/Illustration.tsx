import { forwardRef } from 'react';

type IllustrationSize = 'small' | 'medium' | 'large';

type Props = {
  name: string;
  alt?: string;
  size?: IllustrationSize;
  loading?: 'eager' | 'lazy';
  className?: string;
};

const imageSizes = { small: 200, medium: 300, large: 500 };

function src(name: string, size: IllustrationSize, desc: '1x' | '2x') {
  return `/illustrations/${name}-${size}@${desc}.webp`;
}

export const Illustration = forwardRef<HTMLImageElement, Props>(
  ({ name, alt = '', loading = 'eager', className, size = 'medium' }, ref) =>
    name ? (
      <picture>
        {(size === 'large' || size === 'medium') && (
          <>
            <source
              width={imageSizes.small}
              height={imageSizes.small}
              media="(max-width: 575px)"
              srcSet={`${src(name, 'small', '1x')}, ${src(name, 'small', '2x')} 2x`}
            />
            {size === 'large' && (
              <source
                width={imageSizes.medium}
                height={imageSizes.medium}
                media="(max-width: 992px)"
                srcSet={`${src(name, 'medium', '1x')}, ${src(name, 'medium', '2x')} 2x`}
              />
            )}
          </>
        )}
        <img
          ref={ref}
          alt={alt}
          className={`wds-illustration wds-illustration-${name}${className ? ` ${className}` : ''}`}
          loading={loading}
          src={src(name, size, '1x')}
          srcSet={`${src(name, size, '2x')} 2x`}
          width={imageSizes[size]}
          height={imageSizes[size]}
        />
      </picture>
    ) : null,
);
