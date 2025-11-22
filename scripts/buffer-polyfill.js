/**
 * Buffer polyfill for browser environment
 * Uses buffer package which provides Buffer implementation for browsers
 */
import { Buffer } from 'buffer';

// Make Buffer globally available
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  window.global = window;
}

export { Buffer };
