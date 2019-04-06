import React from 'react';
import sanitizeHtml from 'sanitize-html';

const defaultOptions = {
  allowedTags: ['b', 'i', 'em', 'strong', 'a', 'img'],
  allowedAttributes: {
    a: ['href']
  },
  allowedIframeHostnames: ['www.youtube.com']
};

export default ({ html, options }) => (
  <div
    style={{ display: 'inline' }}
    dangerouslySetInnerHTML={{
      __html: sanitizeHtml(html, { ...defaultOptions, ...options })
    }}
  />
);
