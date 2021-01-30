import { Button, Input } from '@material-ui/core'
import React, { useState } from 'react'
import {db,storage} from "./firebase";
import firebase from "firebase";
import "./ImageUpload.css";

function ImageUpload({username}) {
    const[caption,setCaption]=useState("");
    const[progress,setProgress]=useState(0);
    const[image,setImage]=useState(null);

    const handleChange=(e)=>{
        //get the first file you select
        if(e.target.files[0]){
            setImage(e.target.files[0]);
        } 
    }

    const handleUpload=(e)=>{
        e.preventDefault();
        //uploading the image in new images folder, first we need a reference of the image on storage by stating the name which will be store in image state automatically
        //once we choose the image and we are putting the file from our local machine to the storage in firebase
        const uploadTask=storage.ref(`images/${image.name}`).put(image);
        // now for upload this in firebase
        uploadTask.on(
            "state changed",
            (snapshot)=>{
                // display progress function
                const progress=Math.round(
                    (snapshot.bytesTransferred/snapshot.totalBytes)*100
                );
                setProgress(progress);
            },
            (err)=>{
                //error function
                alert(err.message)
            },
            ()=>{
                //complete function upload
                //we are getting the download url after its stored in storage, so that we can add to the db to post the data
                storage
                .ref("images")
                .child(image.name)
                .getDownloadURL()
                .then(url=>{
                    db.collection("posts").add({
                        timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        imageURL: url,
                        username: username
                    })
                setProgress(0);
                setCaption("");
                setImage(null);
                })
            }
        )

    }
      
    return (
        <div className="imageupload">
            <progress className="imageupload__progress" value={progress} max="100"/>
            <Input 
                placeholder="Enter Caption"
                type="text"
                value={caption}
                onChange={(e)=>setCaption(e.target.value)}
            />
            <input 
                type="file"
                onChange={handleChange}
            />
            <Button type="submit" onClick={handleUpload}>Upload</Button>
        </div>
    )
}

export default ImageUpload
