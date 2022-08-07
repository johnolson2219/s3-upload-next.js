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
        const { fileName, partNumber, uploadId } = req.query;

        const keyName = `${process.env.S3_BUCKET_FOLDER_NAME}/${fileName}`
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: keyName,
            PartNumber: partNumber,
            UploadId: uploadId,
        }
        const presignedUrl = s3.getSignedUrl('uploadPart', params)

        res.status(200).json({ presignedUrl });
    } catch (err) {
        res.status(400).json({ message: err });
    }
}