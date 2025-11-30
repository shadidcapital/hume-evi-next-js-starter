import React from 'react';

type ErrorProps = {
  error: Error;
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  const isProd = process.env.NODE_ENV === 'production';
  const displayMessage = isProd
    ? 'An unexpected server error occurred.'
    : (error?.message ?? 'Server error');
  return (
    <html lang="en">
      <head>
        <title>Chat Server Error</title>
      </head>
      <body>
        <h1>Chat Server Error</h1>
        <p>{displayMessage}</p>
        <button onClick={() => reset()} style={{ marginTop: 16 }}>Retry</button>
      </body>
    </html>
  );
}
