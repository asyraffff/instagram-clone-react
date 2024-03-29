import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import Post from './components/Post';
import ImageUpload from './components/ImageUpload';
import InstagramEmbed from 'react-instagram-embed';

import Modal from '@material-ui/core/Modal';
import { Button, Input } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './App.css';

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
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const [modalStyle] = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // listen to any changes in authenticaton (login/signup/create new user)
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in...
        console.log(authUser);
        setUser(authUser);

        // if (authUser.displayName) {
        //   // don't update username
        // } else {
        //   // if we just created someone
        //   return authUser.updateProfile({
        //     displayName: username,
        //   });
        // }

      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions
      // user authenticaton => condition fire up => do some cleanup => back to normal
      unsubscribe();
    }
  }, [user, username]);


  useEffect(() => {
    db.collection('posts')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data()
        })));
      })
  }, [posts]);


  const signUp = (event) => {
    event.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))

    setOpen(false);
  };

  const signIn = (event) => {
    event.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
  };

  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
            </center>

            <Input
              className="app__input"
              placeholder="username"
              type="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>

      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt="logo"
              />
            </center>

            <Input
              className="app__input"
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              className="app__input"
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      {/* Header */}
      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
          alt="logo"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
              <Button onClick={() => setOpen(true)}>Sign Up</Button>
            </div>
          )}
      </div>

      {/* image upload */}
      {user && user?.displayName ? (
        <ImageUpload username={user.displayName} />

      ) : (
          <h3 style={{ textAlign: "center" }}>Sorry, you need to login to post😉</h3>
        )}



      {/* Posts */}
      <div className="app__posts">
        <div class="app__postsLeft">
          {
            posts.map(({ id, post }) => (
              <Post
                key={id}
                postId={id}
                user={user}
                username={post.username}
                caption={post.caption}
                imageUrl={post.imageUrl}
              />
            ))
          }
          {/* key => let every post not refresh everytime, if there have 20,000 post , it will refresh the newest one */}
        </div>
        <div class="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/CBf2nEeFvLt/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => { }}
            onSuccess={() => { }}
            onAfterRender={() => { }}
            onFailure={() => { }}
          />
        </div>
      </div>

    </div>
  );
}

export default App;
