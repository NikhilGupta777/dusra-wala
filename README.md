# Amplify Flask Trimmer (Backend-only, Gen-2)

This repo deploys your single-file Flask video trimmer to **AWS Amplify Gen-2** as a **Lambda Function URL** (no Docker, no API Gateway). It keeps your code intact and adds only a lightweight WSGI adapter.

## Quick Start

```bash
# 1) Install Amplify Gen-2 tooling (Node 18+ required)
npm create amplify@latest

# 2) Launch a dev sandbox (provisions the Lambda + Function URL)
npx ampx sandbox
```

After provisioning, copy the **Function URL** from the output and open it in the browser.
- `GET /` → loads your full UI (served by Flask from `app.py`)
- `GET /api/ping` → `{ ok: true }`
- `POST /api/trim` → starts a trim job

## Region FFmpeg layer

Edit `amplify/functions/trimmer/resource.ts` to set a valid **FFmpeg layer ARN** for your region:
```ts
const ffmpegLayerArn = "arn:aws:lambda:<your-region>:<acct-id>:layer:ffmpeg:<ver>";
```

## Why no amplify.yaml?

Amplify **Gen-2** uses `amplify/backend.ts` (CDK under the hood) for infra. There is no buildspec required for backend-only projects, so `amplify.yaml` is **not needed**. Use `amplify.yaml` only when you add **Amplify Hosting (frontend)** and want to customize build commands.
