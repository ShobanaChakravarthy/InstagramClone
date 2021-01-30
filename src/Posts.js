import React, { useEffect, useState } from 'react'
import "./Posts.css";
import Avatar from '@material-ui/core/Avatar';
import { db } from './firebase';
import firebase from "firebase";

function Posts({username,postId,user,imageURL,caption}) {
    const [comments, setComments] = useState([])
    const [comment, setComment] = useState("")

    useEffect(() => {
        let unsubscribe;
        if(postId){
            unsubscribe=db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timeStamp","desc")
                .onSnapshot(
                    (snapshot)=>{
                        setComments(snapshot.docs.map((doc)=>doc.data()))
                    }
                )
        }
        return () =>{
            unsubscribe();
        }

    }, [postId])

    const postComment = (e) => {
        e.preventDefault();
        db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .add({
            text: comment,
            username: user.displayName,
            timeStamp:  firebase.firestore.FieldValue.serverTimestamp()
        })
        setComment('')
    }

    return (
        <div className="posts">
            {/*header = avatar+username*/}
            <div className="posts__header">
                <Avatar className="posts__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            {/* image */}
            <img className="posts__image" src={imageURL} alt=""/>
            {/* Username + caption*/}
            <h4 className="posts__text"><strong>{`${username}: `}</strong>{caption}</h4>

            {
                <div className="posts__comments">
                    {comments.map((comment)=>(
                        <p>
                            <b>{comment.username} </b>
                            {comment.text}
                        </p>
                    ))

                    }
                </div>
            }
            {user && (
                <form className="posts__commentBox">
                <input 
                    type="text"
                    className="posts__input"
                    placeholder="Enter a comment"
                    value={comment}
                    onChange={(e)=>setComment(e.target.value)}
                />
                <button
                    className="posts__button"
                    disable={!comment}
                    type="submit"
                    onClick={postComment}
                >
                Post
                </button>
            </form>
            )}
        </div>
    )
}

export default Posts
