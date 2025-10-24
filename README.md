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

## Using with Alternative S3 Providers

This cache handler works with any S3-compatible storage provider. Here are configuration examples for popular alternatives:

### MinIO
```plaintext 
AWS_REGION=us-east-1 
AWS_ACCESS_KEY_ID=minioadmin 
AWS_SECRET_ACCESS_KEY=minioadmin 
CACHE_S3_ENDPOINT=http://localhost:9000
CACHE_S3_PATH_STYLE=true
CACHE_BUCKET_NAME=nextjs-cache 
```

### Google Cloud

```plaintext
AWS_REGION=auto
AWS_ACCESS_KEY_ID=your-gcs-hmac-access-key
AWS_SECRET_ACCESS_KEY=your-gcs-hmac-secret-key
CACHE_S3_ENDPOINT=https://storage.googleapis.com
```

### DigitalOcean Spaces

```plaintext 
AWS_REGION=nyc3 
AWS_ACCESS_KEY_ID=your-spaces-access-key 
AWS_SECRET_ACCESS_KEY=your-spaces-secret-key 
CACHE_S3_ENDPOINT=https://nyc3.digitaloceanspaces.com 
CACHE_BUCKET_NAME=your-space-name
```


### Hetzner Object Storage

```plaintext 
AWS_REGION=us-east-1 
AWS_ACCESS_KEY_ID=your-hetzner-access-key 
AWS_SECRET_ACCESS_KEY=your-hetzner-secret-key 
CACHE_S3_ENDPOINT=https://nbg1.your-project.hetzner.cloud
CACHE_S3_PATH_STYLE=true
CACHE_BUCKET_NAME=nextjs-cache 
```