import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import nProgress from 'nprogress';
import axios from 'axios';
const ImagesList = ({
    listFiles,
    setSelectedFile,
    loader,
    setMessage,
    selectedFile,
    setLoader,
    setListFiles,
}) => {
    const [isModal, setIsModal] = useState(false);

    //Get Images from s3
    const getIamges = async () => {
        try {
            const url = `/api/single-part/getS3Files`;
            const res = await axios.get(url);
            console.log("res", res?.data?.imagesUrl);
            setListFiles(res?.data?.imagesUrl)
        }
        catch (err) {
            setMessage({
                status: true,
                type: 'error',
                content: err?.message
            })
        }
    }

    useEffect(() => {
        getIamges()
    }, []);
    //Delete File
    const onDeleteS3File = async () => {
        const key = selectedFile?.name;

        setLoader(true);
        nProgress.start();
        try {
            const { data } = await axios.post("/api/single-part/deleteFile", {
                name: key,
            });

            if (data?.response?.DeleteMarker) {
                const finalList = listFiles.filter(function (obj) {
                    return obj.name !== key;
                });
                setListFiles(finalList);
                setMessage({
                    status: true,
                    type: 'success',
                    content: 'Image Deleted Successfully'
                })

            }
        }
        catch (err) {
            setMessage({
                status: true,
                type: 'error',
                content: err.message
            })
        }
        finally {
            setLoader(false);
            setIsModal(false);
            nProgress.done();
        }

    }

    return (
        <div>
            <div className='image-list-section'>
                <div className="wrapper">
                    <div className="gallery">
                        {
                            listFiles.length > 0 ?
                                listFiles?.map((img, i) => {

                                    return (
                                        <div key={i} className='img-card'>
                                            <ul>
                                                <li>
                                                    <Image
                                                        className='custom-img'
                                                        src={img?.image}
                                                        alt={img?.name}
                                                        width={200}
                                                        height={200}
                                                        quality={100}

                                                    />
                                                    <button
                                                        disabled={loader || isModal}
                                                        className='btn-primary'
                                                        onClick={() => {
                                                            setIsModal(true);
                                                            setSelectedFile(img)
                                                        }}>Delete</button>
                                                </li>
                                            </ul>
                                        </div>
                                    )
                                })

                                :
                                <div className='no-data'>
                                    <Image
                                        src={'/images/no-data.jpg'}
                                        alt="No-data"
                                        width={350}
                                        height={200}
                                        layout='responsive'
                                    />
                                </div>
                        }
                    </div>
                </div>
            </div>

            {/* Delete file Popup */}
            <div className={isModal ? 'modal show-modal' : 'modal'}>
                <div className="modal-content">
                    <div className='modal-header'>
                        <span
                            disabled={loader}
                            className="close-button"
                            onClick={() => { setIsModal(false) }}
                        >&times;
                        </span>
                    </div>

                    <div className='modal-body'>
                        <p>Are you sure you want to delete this images?</p>

                    </div>
                    <div className='modal-footer'>
                        <button
                            disabled={loader}
                            className='btn-primary confirm-btn'
                            onClick={() => { onDeleteS3File() }}>Delete</button>
                    </div>
                </div>
            </div>
        </div>
    );
}



export default ImagesList;