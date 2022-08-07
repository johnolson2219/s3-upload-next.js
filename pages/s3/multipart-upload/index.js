import React, { useState } from 'react';
import Head from "next/head";
import axios from 'axios';
import nProgress from 'nprogress';
import InputFile from '../../../component/InputFile';
import ImagesList from '../../../component/ImagesList';
import Message from '../../../component/Message';



const MultiPartUpload = () => {

    //local state
    const [listFiles, setListFiles] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedFile, setSelectedFile] = useState({});
    const [message, setMessage] = useState({
        status: false,
        type: '',
        content: ''
    });


    //Upload File in S3 Bucket
    const uploadFileOnS3 = async (e) => {
        if (e.target.files.length) {
            nProgress.start();
            setLoader(true)
            const file = e.target.files?.[0];
            setSelectedFile(file)
            const filename = file.name;
            const fileType = file.type;
            const uploadNameKey = await `${Date.now()}*-*${filename}`

            try {
                const { data } = await axios.post("/api/multi-part/createPart", {
                    name: uploadNameKey,
                    type: fileType,
                    file: e.target.files
                });

                //Devide File into multipart
                uploadMultipartFile(data?.multipartCreateResult, file, uploadNameKey);

            }
            catch (err) {
                setMessage({
                    status: true,
                    type: 'error',
                    content: err.message
                })
            }
            finally {
                setSelectedFile({})
            }
        }
    }

    //Create Multipart
    const uploadMultipartFile = async (data, file, uploadNameKey) => {
        const UploadId = data.UploadId;
        try {

            const FILE_CHUNK_SIZE = 10000000 // 10MB
            const fileSize = file.size;
            const NUM_CHUNKS = Math.floor(fileSize / FILE_CHUNK_SIZE) + 1
            let promisesArray = []
            let start, end, blob;

            for (let index = 1; index < NUM_CHUNKS + 1; index++) {
                start = (index - 1) * FILE_CHUNK_SIZE;
                end = (index) * FILE_CHUNK_SIZE;
                // Conver file to miltipart
                blob = (index < NUM_CHUNKS) ? file.slice(start, end) : file.slice(start);

                // (1) Generate presigned URL for each part
                const presignedUrl = await axios.get(`/api/multi-part/uploadPart`, {
                    params: {
                        fileName: uploadNameKey,
                        partNumber: index,
                        uploadId: UploadId,
                    }
                })

                const uploadResp = axios.put(
                    presignedUrl?.data?.presignedUrl,
                    blob,
                    { headers: { 'Content-Type': file.type } }
                )
                promisesArray.push(uploadResp)
            }

            const resolvedArray = await Promise.all(promisesArray)


            let uploadPartsArray = []
            resolvedArray.forEach((resolvedPromise, index) => {
                uploadPartsArray.push({
                    ETag: resolvedPromise.headers.etag,
                    PartNumber: index + 1
                })
            })

            // (3) Calls the CompleteMultipartUpload endpoint in the backend server

            const completeUploadResp = await axios.post("/api/multi-part/completePart", {
                fileName: uploadNameKey,
                parts: uploadPartsArray,
                UploadId: UploadId
            });

            listFiles.splice(0, 0, completeUploadResp?.data?.newFile)
            //Display Message
            setMessage({
                status: true,
                type: 'success',
                content: 'Image Uploaded Successfully'
            })

        }
        catch (err) {
            setMessage({
                status: true,
                type: 'error',
                content: err.message
            })
        }
        finally {
            nProgress.done();
            setLoader(false);
            setSelectedFile({})
        }
    }

    //Close Snackbar
    const closeSnackbar = () => {
        setMessage({
            ...message,
            status: false,
        })
    }

    return (
        <>
            <div className="container">
                <Head>
                    <title>Upload File on S3</title>
                    <meta name="description" content="Upload Filein Multipart on S3" />
                </Head>
                <InputFile
                    loader={loader}
                    uploadFileOnS3={uploadFileOnS3}
                />
            </div>

            {/* Getting Image from S3 and render in UI */}
            <ImagesList
                listFiles={listFiles}
                loader={loader}
                setSelectedFile={setSelectedFile}
                setMessage={setMessage}
                closeSnackbar={closeSnackbar}
                selectedFile={selectedFile}
                setLoader={setLoader}
                setListFiles={setListFiles}
            />

            {/* Display Success & Error messages */}
            <Message
                message={message}
                closeSnackbar={closeSnackbar} />
        </>
    );
}

export default MultiPartUpload;