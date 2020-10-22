import React, { useState, useEffect } from "react";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input } from "@material-ui/core";

import "./App.css";

import { Post } from "./components/post/Post";
import { db, auth } from "./firebase";

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
		db.collection("posts").onSnapshot((snapshot) => {
			setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
		});
	}, []);

	// for authentication
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				// if user logged in
				console.log(authUser);
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
			</div>
			{user ? (
				<Button onClick={() => auth.signOut()}>Logout</Button>
			) : (
				<div className="app__loginContainer">
					<Button onClick={() => setOpen(true)}>Sign Up</Button>
					<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
				</div>
			)}
			<h1>Instagram Clone</h1>
			{posts.map(({ id, post }) => (
				<Post
					key={id}
					username={post.username}
					caption={post.caption}
					imageUrl={post.imageUrl}
				/>
			))}
		</div>
	);
}

export default App;
