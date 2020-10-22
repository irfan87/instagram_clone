import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import firebase from "firebase";

import "./Post.css";
import { db } from "../../firebase";

export const Post = ({ username, user, postId, caption, imageUrl }) => {
	const [comments, setComments] = useState([]);
	const [comment, setComment] = useState("");

	useEffect(() => {
		let unsubscribe;

		if (postId) {
			unsubscribe = db
				.collection("posts")
				.doc(postId)
				.collection("comments")
				.orderBy("timestamp", "desc")
				.onSnapshot((snapshot) =>
					setComments(snapshot.docs.map((doc) => doc.data()))
				);
		}

		return () => {
			unsubscribe();
		};
	}, [postId]);

	const postComment = (e) => {
		e.preventDefault();

		db.collection("posts").doc(postId).collection("comments").add({
			commentText: comment,
			username: user.displayName,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		});

		setComment("");
	};

	return (
		<div className="post">
			<div className="post__header">
				<Avatar
					className="post__avatar"
					alt="Ivy Ying"
					src="/static/images/avatar/1.jpg"
				/>
				<h3>{username}</h3>
			</div>
			<img src={imageUrl} alt="photographer" className="post__image" />
			<h4 className="post__text">
				<strong>{username}: </strong>
				{caption}
			</h4>
			<div className="post__coments">
				{comments.map((comment) => (
					<p>
						<strong>{comment.username}: </strong>
						{comment.commentText}
					</p>
				))}
			</div>
			{user && (
				<form className="post__commentBox">
					<input
						type="text"
						className="post__input"
						placeholder="Add comment"
						value={comment}
						onChange={(e) => setComment(e.target.value)}
					/>
					<button
						disabled={!comment}
						className="post__button"
						type="submit"
						onClick={postComment}
					>
						Post
					</button>
				</form>
			)}
		</div>
	);
};
