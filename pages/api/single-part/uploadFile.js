
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
        let { name, type } = req.body;
        const keyName = `${process.env.S3_BUCKET_FOLDER_NAME}/${name}`
        const fileParams = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: keyName,
            Expires: 600,
            ContentType: type,
        };
        const url = await s3.getSignedUrlPromise("putObject", fileParams);

        const newFile = {
            name: keyName,
            'image': await s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: keyName })
        }
        res.status(200).json({ url, newFile });

    } catch (err) {
        res.status(400).json({ message: err });
    }
}
