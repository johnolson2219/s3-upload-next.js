
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    signatureVersion: "v4",
});

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    const { name } = req.body;

    try {
        const response = await s3.deleteObject({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: name,
        }).promise();
        res.status(200).json({ response });
    }
    catch (err) {
        res.status(400).json({ message: err });
    }
}