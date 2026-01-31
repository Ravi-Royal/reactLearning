/* eslint-disable react-refresh/only-export-components */
import DOMPurify from 'dompurify';
import { ALLOWED_TAGS, ALLOWED_ATTR } from '@config/sanitizeConfig';

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The unsanitized HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHTML(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

/**
 * Component for safely rendering user-generated HTML
 */
interface SafeHTMLProps {
  html: string;
  className?: string;
}

export function SafeHTML({ html, className }: SafeHTMLProps) {
  const sanitized = sanitizeHTML(html);
  return <div className={className} dangerouslySetInnerHTML={{ __html: sanitized }} />;
}
