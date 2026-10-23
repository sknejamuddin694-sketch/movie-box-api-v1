

## Multi-platform deployment

### Vercel

Import this repository into Vercel and deploy with the default settings. The serverless adapter is `api/[...path].js`; Vercel routes are under `/api`, for example:

```text
/api/search?q=oshi%20no%20ko
/api/detail/{slug}
/api/episodes/{slug}
/api/stream/{subject_id}?detail_path={slug}&se=1&ep=1
/api/watch/{subject_id}?detail_path={slug}&se=1&ep=1&resolution=480
/api/download/{subject_id}?detail_path={slug}&se=1&ep=1&resolution=480
```

Vercel is suitable for metadata and JSON endpoints. Large video proxy responses may be limited by the selected Vercel plan and function limits.

### Railway and Render

Both platforms can run the portable Node adapter with the `npm start` command. The adapter reads the platform-provided `PORT` environment variable. `railway.json` and `render.yaml` are included for platform detection and deployment defaults.

### VPS

```bash
npm ci
PORT=8787 npm start
```

The Node adapter binds to `0.0.0.0` and supports the same routes without Wrangler.
