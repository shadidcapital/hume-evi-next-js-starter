import React from 'react';

 type ErrorProps = {
   error: Error;
   reset: () => void;
 };
 
 export default function Error({ error, reset }: ErrorProps) {
-  return (
-    <html lang=\"en\">\n      <head>\n        <title>Server Error</title>\n      </head>\n      <body>\n        <h1>Server Error</h1>\n        <p>{error?.message ?? 'An unexpected server error occurred.'}</p>\n        <button onClick={() => reset()} style={{ marginTop: 16 }}>Retry</button>\n      </body>\n    </html>\n  );
+  const isProd = process.env.NODE_ENV === 'production';
+  const displayMessage = isProd
+    ? 'An unexpected server error occurred.'
+    : (error?.message ?? 'An unexpected server error occurred.');
+  return (
+    <html lang="en">
+      <head>
+        <title>Server Error</title>
+      </head>
+      <body>
+        <h1>Server Error</h1>
+        <p>{displayMessage}</p>
+        <button onClick={() => reset()} style={{ marginTop: 16 }}>Retry</button>
+      </body>
+    </html>
+  );
 }
