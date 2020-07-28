import React, { useState, useEffect } from 'react'
import firebase from 'firebase'
import { db } from '../firebase';
import Avatar from "@material-ui/core/Avatar";
import '../styles/Post.css';

function Post({ postId, username, caption, imageUrl, user }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unsubscribe
        if (postId) {
            unsubscribe = db
                .collection('posts')
                .doc(postId)
                .collection('comments')
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }
        return () => {
            unsubscribe()
        }
    }, [postId])


    const postComment = (event) => {
        event.preventDefault();

        db.collection('posts').doc(postId).collection('comments').add({
            text: comment,
            username: user.displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
    }


    return (
        <div className="post">
            {/* header => avatar + username */}
            <div className="post__header">
                <Avatar
                    className="post__avatar"
                    alt={username}
                    src="/static/images/avatar/1.jpg"
                />
                <h3>{username}</h3>
            </div>

            {/* image */}
            <img
                className="post__image"
                src={imageUrl}
                alt="postImage"
            />

            {/* username + caption */}
            <h4 className="post__text"><strong>{username} </strong>{caption}</h4>

            {/* comments */}
            <div class="post__comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))
                }
            </div>

            {user && (
                <form className="post__commentBox">
                    <input
                        type="text"
                        className="post__input"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        disabled={!comment}
                        className="post__button"
                        type="submit"
                        onClick={postComment}
                    >Post
                    </button>
                </form>
            )}

        </div >
    )
}

export default Post
