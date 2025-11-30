<div align="center">
  <img src="https://storage.googleapis.com/hume-public-logos/hume/hume-banner.png">
  <h1>EVI Next.js App Router Example</h1>
</div>

![preview.png](preview.png)

## Overview

This project features a sample implementation of Hume's [Empathic Voice Interface](https://hume.docs.buildwithfern.com/docs/empathic-voice-interface-evi/overview) using Hume's React SDK. Here, we have a simple EVI that uses the Next.js App Router.

## Project deployment

Click the button below to deploy this example project with Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fhumeai%2Fhume-evi-next-js-starter&env=HUME_API_KEY,HUME_SECRET_KEY)

Below are the steps to completing deployment:

1. Create a Git Repository for your project.
2. Provide the required environment variables. To get your API key and Client Secret key, log into the portal and visit the [API keys page](https://beta.hume.ai/settings/keys).

## Environment Variables

This project relies on a few environment variables for running locally and in production.

Local development
- Create a file named .env at the project root with:
  HUME_API_KEY=your_api_key
  HUME_SECRET_KEY=your_secret_key
  NEXT_PUBLIC_HUME_CONFIG_ID=your_config_id
- Copy from .env.example as a template; ensure you never commit this file.
- Run npm install and start the dev server as usual.

Production deployment
- In your hosting provider's dashboard (e.g., Vercel), configure the following environment variables:
  - HUME_API_KEY (secret)
  - HUME_SECRET_KEY (secret)
  - NEXT_PUBLIC_HUME_CONFIG_ID (public)
- For Vercel: Settings > Environment Variables, add each key. Mark HUME_API_KEY and HUME_SECRET_KEY as "Secret" and NEXT_PUBLIC_HUME_CONFIG_ID as "Environment Variable" (exposed to the browser). Do not commit secrets to version control.
- After updating, redeploy to apply the changes.

Notes
- The NEXT_PUBLIC_HUME_CONFIG_ID variable is exposed to the client; only non-sensitive configuration should be placed here.
- If you rotate keys, update both local and production environments and restart services.

## Support

If you have questions, require assistance, or wish to engage in discussions pertaining to this starter template, [please reach out to us on Discord](https://link.hume.ai/discord).
