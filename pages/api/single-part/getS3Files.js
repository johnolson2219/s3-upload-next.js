
import S3 from "aws-sdk/clients/s3";

const s3 = new S3({
    region: process.env.S3_REGION,
    accessKeyId: process.env.S3_ACCESS_KEY,
    secretAccessKey: process.env.S3_SECRET_KEY,
    signatureVersion: "v4",
});

const fileParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Prefix: `${process.env.S3_BUCKET_FOLDER_NAME}/`,
};
// eslint-disable-next-line import/no-anonymous-default-export
export default async (req, res) => {
    s3.listObjectsV2(fileParams, (err, data) => {
        if (err) {
            res.status(400).json({ err });

        } else {
            const imagesUrl = data?.Contents.map((x) => {
                return {
                    name: x.Key,
                    'image': s3.getSignedUrl('getObject', { Bucket: process.env.S3_BUCKET_NAME, Key: x.Key })
                }
            })

            res.status(200).json({ imagesUrl });
        }
    });
}
