import React from 'react';

interface RichTextDisplayProps {
  content: string;
  className?: string;
}

export const RichTextDisplay: React.FC<RichTextDisplayProps> = ({
  content,
  className = ""
}) => {
  // Sanitize and clean the HTML content
  const sanitizeHTML = (html: string) => {
    // Remove any potentially dangerous tags and attributes
    const allowedTags = ['b', 'strong', 'i', 'em', 'u', 'br', 'p', 'div'];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove any script tags or other dangerous elements
    const scripts = tempDiv.querySelectorAll('script');
    scripts.forEach(script => script.remove());
    
    // Only allow specific formatting tags
    const allElements = tempDiv.querySelectorAll('*');
    allElements.forEach(element => {
      if (!allowedTags.includes(element.tagName.toLowerCase())) {
        // Replace with span to preserve content but remove dangerous tags
        const span = document.createElement('span');
        span.innerHTML = element.innerHTML;
        element.parentNode?.replaceChild(span, element);
      }
      
      // Remove all attributes except for basic styling
      const attributes = Array.from(element.attributes);
      attributes.forEach(attr => {
        if (!['style'].includes(attr.name.toLowerCase())) {
          element.removeAttribute(attr.name);
        }
      });
    });
    
    return tempDiv.innerHTML;
  };

  const cleanContent = sanitizeHTML(content || '');

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: cleanContent }}
      style={{
        wordBreak: 'break-word',
        lineHeight: '1.5'
      }}
    />
  );
};