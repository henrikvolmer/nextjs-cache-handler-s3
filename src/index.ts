import { createHash } from "crypto";
import { S3 } from "@aws-sdk/client-s3";
import { CacheHandler } from "@neshca/cache-handler";

CacheHandler.onCreation(async ({ buildId }) => {
    const client = new S3({ region: process.env.AWS_REGION });
    const bucketName = process.env.CACHE_BUCKET_NAME;
    const prefix = process.env.CACHE_PREFIX + buildId;
    const tagPrefix = `TAG${prefix}`;
    const cacheExtension = "json";
    const s3NotFoundErrors = ["NotFound", "NoSuchKey"];

    function md5(data: string) {
        return createHash("md5").update(data).digest("hex");
    }

    function buildTagKeys(tags: Readonly<Array<string>>) {
        if (!tags?.length) return "";
        return tags
            .map((tag, index) => `${tagPrefix}${index}=${md5(tag)}`)
            .join("&");
    }

    return {
        handlers: [
            {
                name: "aws-s3-handler",
                async get(key) {
                    if (!client) {
                        return null;
                    }

                    const data = await client
                        .getObject({
                            Bucket: bucketName,
                            Key: `${prefix}-${key}.${cacheExtension}`,
                        })
                        .catch((error) => {
                            if (s3NotFoundErrors.includes(error.name))
                                return null;
                            throw error;
                        });

                    if (!data?.Body) return null;

                    return JSON.parse(
                        await data.Body.transformToString("utf-8"),
                    );
                },
                async set(key, value) {
                    const expireAt = value.lifespan.expireAt;

                    await client.putObject({
                        Bucket: bucketName,
                        Key: `${prefix}-${key}.${cacheExtension}`,
                        Body: JSON.stringify(value),
                        CacheControl: `max-age=${Math.floor(
                            expireAt - Date.now() / 1000,
                        )}`,
                        Tagging: buildTagKeys(value.tags),
                    });
                },
                async revalidateTag(tag) {
                    const keysToDelete = [];
                    let nextContinuationToken = undefined;
                    do {
                        const {
                            Contents: contents = [],
                            NextContinuationToken: token,
                        } = await client.listObjectsV2({
                            Bucket: bucketName,
                            ContinuationToken: nextContinuationToken,
                        });
                        nextContinuationToken = token;

                        keysToDelete.push(
                            ...(await contents.reduce(
                                async (acc, { Key: key }) => {
                                    if (!key || !key.startsWith(prefix))
                                        return acc;

                                    const { TagSet = [] } =
                                        await client.getObjectTagging({
                                            Bucket: bucketName,
                                            Key: key,
                                        });
                                    const tags = TagSet.filter(({ Key: key }) =>
                                        key?.startsWith(tagPrefix),
                                    ).map(({ Value: tags }) => tags || "");

                                    if (tags.includes(md5(tag))) {
                                        return [...(await acc), key];
                                    }
                                    return acc;
                                },
                                Promise.resolve([]),
                            )),
                        );
                    } while (nextContinuationToken);

                    await client.deleteObjects({
                        Bucket: bucketName,
                        Delete: {
                            Objects: keysToDelete.map((Key) => ({ Key })),
                        },
                    });
                },
                async delete(key) {
                    await client.deleteObjects({
                        Bucket: bucketName,
                        Delete: {
                            Objects: [
                                {
                                    Key: `${prefix}-${key}.${cacheExtension}`,
                                },
                            ],
                        },
                    });
                },
            },
        ],
    };
});

export default CacheHandler;
