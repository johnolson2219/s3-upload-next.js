import React from 'react';


const InputFile = ({
    loader,
    uploadFileOnS3
}) => {
    return (
        <form className="form">
            <div
                className="file-upload-wrapper"
                data-text="Select your file!"
                disabled={loader}>
                <input
                    name="file-upload-field"
                    type="file"
                    className="file-upload-field"
                    onChange={uploadFileOnS3}
                    accept="image/*"
                    disabled={loader}
                    key={Date.now()}
                />
            </div>
        </form>
    );
}



export default InputFile;