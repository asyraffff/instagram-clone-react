import React, { useState } from 'react'
import { Button } from '@material-ui/core';
import { storage, db } from '../firebase';
import firebase from 'firebase';
import '../styles/ImageUpload.css';


function ImageUpload({ username }) {
    const [image, setImage] = useState('');
    const [progress, setProgress] = useState('');
    const [caption, setCaption] = useState('');

    const handleChange = (e) => {
        // get the first file
        // set that image to image state
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        // get to the storage and reference to that bracket
        // get the link of image file from storage
        // and put that image to storage
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                // wiill give a number from 0 => 100%
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                // Error function
                console.log(error);
                alert(error.message);
            },
            () => {
                // complete function
                // once it uploded at firebase storage
                // we need to  get back that images to bring it to this apps
                storage
                    .ref('images')
                    .child(image.name)
                    .getDownloadURL()
                    .then((url) => {
                        // post image inside db
                        db.collection('posts').add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            caption: caption,
                            imageUrl: url,
                            username: username
                        });

                        setProgress(0);
                        setCaption('');
                        setImage(null);
                    });
            }
        )
    };

    return (
        <div className="imageUpload">
            {/* I want to have.. */}
            {/* caption */}
            {/* File picker */}
            {/* Post button */}
            <h4 class="imageUpload__title">Add a Post</h4>
            <input
                className="imageUpload__caption"
                type="text"
                placeholder="Enter a caption..."
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
            />
            <input
                className="imageUpload__file"
                type="file"
                onChange={handleChange}
            />

            <progress
                className="imageUpload__progress"
                style={!progress ? { display: 'none' } : { display: 'block' }}
                value={progress}
                max="100"
            />

            <Button
                className="imageUpload__button"
                onClick={handleUpload}
            >
                Post
            </Button>
        </div>
    )
}

export default ImageUpload
