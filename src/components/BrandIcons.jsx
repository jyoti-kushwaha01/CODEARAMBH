/** Brand marks — lucide retired its brand icon set, so we ship our own compact SVGs. */

export function XIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.53 3H21l-7.19 8.21L22.5 21h-6.6l-5.17-6.36L4.8 21H1.33l7.7-8.8L1.5 3h6.77l4.67 5.83L17.53 3Zm-1.16 16h1.83L7.7 4.88H5.74L16.37 19Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5.2" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.1" cy="6.9" r="1.05" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedinIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05a4.2 4.2 0 0 1 3.75-2.05c4 0 4.75 2.6 4.75 6V21h-4v-5.3c0-1.3 0-3-1.8-3s-2.05 1.4-2.05 2.9V21h-4V9Z" />
    </svg>
  );
}

export function GithubIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 1.8a10.2 10.2 0 0 0-3.23 19.88c.51.09.7-.22.7-.49v-1.9c-2.84.62-3.44-1.21-3.44-1.21-.47-1.18-1.14-1.5-1.14-1.5-.93-.63.07-.62.07-.62 1.03.07 1.57 1.06 1.57 1.06.92 1.57 2.4 1.12 2.98.86.09-.67.36-1.12.65-1.38-2.27-.26-4.65-1.13-4.65-5.04 0-1.12.4-2.03 1.06-2.74-.11-.26-.46-1.3.1-2.71 0 0 .86-.28 2.82 1.06a9.8 9.8 0 0 1 5.14 0c1.96-1.34 2.82-1.06 2.82-1.06.56 1.41.21 2.45.1 2.71.66.71 1.06 1.62 1.06 2.74 0 3.92-2.39 4.78-4.67 5.03.37.32.7.94.7 1.9v2.82c0 .27.19.59.71.49A10.2 10.2 0 0 0 12 1.8Z" />
    </svg>
  );
}

export function GoogleIcon({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.55 5.55 0 0 1-2.4 3.58v2.98h3.86c2.26-2.09 3.56-5.17 3.56-8.8Z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-2.98c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A12 12 0 0 0 12 24Z" />
      <path fill="#FBBC05" d="M5.27 14.31a7.2 7.2 0 0 1 0-4.62V6.6H1.29a12 12 0 0 0 0 10.8l3.98-3.09Z" />
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.97 11.97 0 0 0 12 0 12 12 0 0 0 1.29 6.6l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z" />
    </svg>
  );
}
