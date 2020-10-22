import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import InstagramEmbed from "react-instagram-embed";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";

import "./App.css";

import { Post } from "./components/post/Post";
import { db, auth } from "./firebase";
import { ImageUpload } from "./components/image_upload/ImageUpload";

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `${top}%`,
		left: `${left}%`,
		transform: `translate(-${top}%, -${left}%)`,
	};
}

const useStyles = makeStyles((theme) => ({
	paper: {
		position: "absolute",
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadows[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

function App() {
	const [posts, setPosts] = useState([]);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState("");
	const [user, setUser] = useState(null);

	const [open, setOpen] = useState(false);
	const [openSignIn, setOpenSignIn] = useState(false);

	const classes = useStyles();
	const [modalStyle] = useState(getModalStyle);

	// to display all the posts on photos to the app
	useEffect(() => {
		db.collection("posts")
			.orderBy("timestamp", "desc")
			.onSnapshot((snapshot) => {
				setPosts(
					snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() }))
				);
			});
	}, []);

	// for authentication
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// if user logged in
				setUser(authUser);
			} else {
				// if user logged out
				setUser(null);
			}
		});

		return () => {
			// perform some cleanup actions
			unsubscribe();
		};
	}, [user, username]);

	const signUp = (e) => {
		e.preventDefault();

		// display username after signup
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => {
				return authUser.user.updateProfile({
					displayName: username,
				});
			})
			.catch((error) => alert(error.message));

		setOpen(false);
	};

	const signIn = (e) => {
		e.preventDefault();

		// current user sign in
		auth
			.signInWithEmailAndPassword(email, password)
			.catch((error) => alert(error.message));

		setOpenSignIn(false);
	};

	return (
		<div className="app">
			{/* signup form  */}
			<Modal open={open} onClose={() => setOpen(false)}>
				<div style={modalStyle} className={classes.paper}>
					<h2 id="simple-modal-title">
						<form className="app__signup">
							<center>
								<img
									src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
									className="app__headerImage"
									alt=""
								/>
							</center>
							<Input
								placeholder="username"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							<Input
								placeholder="email"
								type="text"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								placeholder="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button onClick={signUp}>Sign Up</Button>
						</form>
					</h2>
				</div>
			</Modal>

			{/* sign in form  */}
			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div style={modalStyle} className={classes.paper}>
					<h2 id="simple-modal-title">
						<form className="app__signup">
							<center>
								<img
									src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
									className="app__headerImage"
									alt=""
								/>
							</center>
							<Input
								placeholder="email"
								type="text"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
							<Input
								placeholder="password"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							<Button onClick={signIn}>Sign In</Button>
						</form>
					</h2>
				</div>
			</Modal>
			<div className="app__header">
				<img
					src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
					className="app__headerImage"
					alt=""
				/>
				{user ? (
					<Button onClick={() => auth.signOut()}>Logout</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
						<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
					</div>
				)}
			</div>
			<div className="app__posts">
				<div className="app__postLeft">
					{posts.map(({ id, post }) => (
						<Post
							key={id}
							postId={id}
							user={user}
							username={post.username}
							caption={post.caption}
							imageUrl={post.imageUrl}
						/>
					))}
				</div>
				<div className="app__postRight">
					<InstagramEmbed
						url="https://instagr.am/p/Zw9o4/"
						maxWidth={320}
						hideCaption={false}
						containerTagName="div"
						protocol=""
						injectScript
						onLoading={() => {}}
						onSuccess={() => {}}
						onAfterRender={() => {}}
						onFailure={() => {}}
					/>
				</div>
			</div>
			{user?.displayName ? <ImageUpload username={user.displayName} /> : ""}
		</div>
	);
}

export default App;
