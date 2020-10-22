import { Button } from "@material-ui/core";
import React, { useState } from "react";
import firebase from "firebase";

import { db, storage } from "../../firebase";

import "./ImageUpload.css";

export const ImageUpload = ({ username }) => {
	const [caption, setCaption] = useState("");
	const [image, setImage] = useState(null);
	const [progress, setProgress] = useState(0);

	const handleChange = (e) => {
		if (e.target.files[0]) {
			setImage(e.target.files[0]);
		}
	};

	const handleUpload = () => {
		const uploadImage = storage.ref(`images/${image.name}`).put(image);

		uploadImage.on(
			"state_changed",
			(snapshot) => {
				// progress function
				const progress =
					Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;

				setProgress(progress);
			},
			(error) => {
				// error function
				alert(error.message);
			},
			() => {
				// complete function
				storage
					.ref("images")
					.child(image.name)
					.getDownloadURL()
					.then((url) => {
						// post the image to the firebase db
						db.collection("posts").add({
							timestamp: firebase.firestore.FieldValue.serverTimestamp(),
							caption: caption,
							imageUrl: url,
							username: username,
						});

						setProgress(0);
						setCaption("");
						setImage(null);
					});
			}
		);
	};

	return (
		<div className="imageUpload__container">
			<progress value={progress} max="100" className="imageUpload__progress" />
			<input
				type="text"
				placeholder="Enter your image"
				onChange={(e) => setCaption(e.target.value)}
				value={caption}
			/>
			<input type="file" onChange={handleChange} />
			<Button onClick={handleUpload}>Upload</Button>
		</div>
	);
};
