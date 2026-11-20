import { useId } from 'react';
import type { ComponentPropsWithRef, ReactNode } from 'react';
import { BrandMark } from './components';
import { Text } from './Text';
import './callout-banner.css';

export interface CalloutBannerProps extends Omit<ComponentPropsWithRef<'section'>, 'title' | 'children'> {
  title: string;
  eyebrow?: string;
  description?: ReactNode;
  action?: ReactNode;
  artwork?: ReactNode;
}

/** An evergreen callout with a consumer-supplied action and optional artwork. */
export function CalloutBanner({ title, eyebrow, description, action, artwork, className, 'aria-labelledby': labelledBy, 'aria-label': ariaLabel, ...props }: CalloutBannerProps) {
  const id = useId();
  const illustration = artwork === undefined ? <BrandMark /> : artwork;
  const hasDescription = description !== undefined && description !== null && description !== false;
  const hasArtwork = illustration !== undefined && illustration !== null && illustration !== false;
  return <section {...props} className={['cr-callout-banner', className].filter(Boolean).join(' ')} aria-label={ariaLabel} aria-labelledby={labelledBy || (ariaLabel ? undefined : `${id}-title`)}>
    <div className="cr-callout-banner-layout"><div className="cr-callout-banner-content">{eyebrow && <Text size="body" className="cr-callout-banner-eyebrow">{eyebrow}</Text>}<Text size="heading-2" id={`${id}-title`}>{title}</Text>{hasDescription && <div className="cr-callout-banner-description">{description}</div>}{action && <div className="cr-callout-banner-action">{action}</div>}</div>
    {hasArtwork && <div className="cr-callout-banner-artwork">{illustration}</div>}</div>
  </section>;
}
