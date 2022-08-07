import S3 from "aws-sdk/clients/s3";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const s3 = new S3({
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
        signatureVersion: "v4",
    });

    try {
        const { fileName, UploadId, parts } = req.body;
        const keyName = `${process.env.S3_BUCKET_FOLDER_NAME}/${fileName}`
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: keyName,
            UploadId: UploadId,
            MultipartUpload: {
                Parts: parts
            },

        }
        const data = await s3.completeMultipartUpload(params).promise();

        const newFile = {
            name: data?.Key,
            'image': await s3.getSignedUrl(
                'getObject',
                {
                    Bucket: process.env.S3_BUCKET_NAME, Key: data?.Key
                })
        }
        res.status(200).json({ data, newFile });
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}