import React, { useState } from "react";
import "./App.css";
import { Post } from "./components/post/Post";

function App() {
	const [posts, setPosts] = useState([
		{
			username: "Ahmad Irfan",
			caption: "It is ReactJS time!",
			imageUrl:
				"https://cdn-media-1.freecodecamp.org/images/1*qUlxDdY3T-rDtJ4LhLGkEg.png",
		},
		{
			username: "Jone Doe",
			caption: "React!",
			imageUrl:
				"https://cdn-media-1.freecodecamp.org/images/1*qUlxDdY3T-rDtJ4LhLGkEg.png",
		},
	]);

	return (
		<div className="app">
			<div className="app__header">
				<img
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					className="app__headerImage"
					alt=""
				/>
			</div>
			<h1>Instagram Clone</h1>
			{posts.map((post) => (
				<Post
					username={post.username}
					caption={post.caption}
					imageUrl={post.imageUrl}
				/>
			))}
		</div>
	);
}

export default App;
