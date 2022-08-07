import React from 'react';

const Message = ({ message, closeSnackbar }) => {
    return (
        <div className={message?.status ? `snackbar show message-${message?.type}` : "snackbar"} >
            {message?.content}
            <span className='close' onClick={() => { closeSnackbar() }}>&times;</span>
        </div>
    );
}


export default Message;