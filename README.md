# Next.js Cache Handler with AWS S3

This library provides a cache handler for Next.js applications using AWS S3 as the storage backend. It leverages the `@aws-sdk/client-s3` for interacting with S3 and `@neshca/cache-handler` for cache management.

## Features

-   **AWS S3 Integration**: Store and retrieve cache data from AWS S3.
-   **MD5 Hashing**: Generate MD5 hashes for cache keys.
-   **Tagging Support**: Tag cache objects for efficient revalidation and deletion.
-   **Cache Expiration**: Set cache expiration using `CacheControl`.

## Installation

Install the package using npm:

```bash
npm install @henrikvolmer/nextjs-cache-handler-s3
```

## Configuration

next.config.js:

```javascript
module.exports = {
    cacheHandler:
        process.env.NODE_ENV === "production"
            ? require.resolve("@henrikvolmer/nextjs-cache-handler-s3")
            : undefined,
};
```

Necessary environment variables:

```plaintext
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
CACHE_BUCKET_NAME=your-s3-bucket
CACHE_PREFIX=some-prefix
```
