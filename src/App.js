import React, { useState,useEffect } from "react";
import './App.css';
import Posts from './Posts';
import {db, auth} from "./firebase";
import { Button, Input, makeStyles, Modal } from "@material-ui/core";
import ImageUpload from "./ImageUpload";
// import InstagramEmbed from 'react-instagram-embed';

//modal styling
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
//modal styling
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
  const classes=useStyles();
  const [modalStyle] = useState(getModalStyle);
  const[posts,setPosts]=useState([]);
  const[open,setOpen]=useState(false);
  const[openSignIn,setOpenSignIn]=useState(false);
  const[email,setEmail]=useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("")
  const [user, setUser] = useState("")

  // Authentication listener in useEffect dependent on user and username so when one of them changes it will run
  useEffect(() => {
    //this authentic listener will not signout the user even if page is reloaded
    const unsubscribe = auth.onAuthStateChanged((authUser)=>{
      if(authUser){
        // user has logged in
        console.log(authUser);
        setUser(authUser)
      }
      else{
        //user has been logged out
        setUser(null)
      }
    })
    //cleanup function
    return ()=> {
      //perform a cleanup before useeffect refires
      //so, we are depending on user or username and we dont want useeffect to open more listener everytime user or username changes
      //instead, we will run the same listener again and again when something changes by clean up function
      // first, we are setting up the user and unsubscribe listener will start running and then the username is changed,
      //instead of opening a new unsubscribe listener, we are firing the listener again below which will close the existing listener
      //and will open it newly again. So, we will run only one listener for user/username change
      unsubscribe();
    }

  }, [user,username])

  //to get all the posts from db
  useEffect(() => {
    db.collection('posts').orderBy('timeStamp','desc').onSnapshot(snapshot=>{
      setPosts(snapshot.docs.map(doc=>({id:doc.id,post:doc.data()})))
    })
  }, [])

  //sign up function to connect with firebase auth
  const signUp = (e)=>{
    e.preventDefault();
    auth
    .createUserWithEmailAndPassword(email,password)
    .then((authUser)=>{
      //its a promise, it will run after we get response from the above api connect to create the username and password
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch((error)=>alert(error.message))
    setOpen(false);
  }

  //sign in function to connect with firebase auth
  const signIn = (e) => {
    e.preventDefault();
    auth
    .signInWithEmailAndPassword(email,password)
    .catch((err)=>alert(err.message))

    setOpenSignIn(false)
  }

  return (
    <div className="app">

      {/* Modal box for sign in */}
      <Modal
        open={openSignIn}
        onClose={()=>setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage" 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                alt="Instagram logo"
              />
            </center>
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      {/* Modal box for sign up */}
      <Modal
        open={open}
        onClose={()=>setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signUp">
            <center>
              <img className="app__headerImage" 
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
                alt="Instagram logo"
              />
            </center>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
            />
            <Button type="submit" onClick={signUp}>Sign up</Button>
          </form>
        </div>
      </Modal>

      {/* App header to display logo */}
      <div className="app__header">
        <img className="app__headerImage" 
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" 
            alt="Instagram logo"
         />
        {/* button based on user signed in or not */}
        {user ?
          <Button onClick={()=>auth.signOut()}>Logout</Button> 
        :
        <div className="app__loginContainer">
          <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
          <Button onClick={()=>setOpen(true)}>Signup</Button>
        </div>
        }
      </div>

      {/* posts */}
      <div className="app__posts">
        <div className="app_postsLeft">
          {posts.map(({id,post}) => (
              <Posts 
                    key={post.id}
                    postId={id}
                    username={post.username }
                    imageURL={post.imageURL}
                    caption={post.caption}
                    user ={user}
              />
            ))
          }
        </div>
        <div className="app__postsRight">
           {/* Instagram embed
            <InstagramEmbed
              url='https://www.instagram.com/p/B_uf9dmAGPw/'
              clientAccessToken='123|456'
              maxWidth={320}
              hideCaption={false}
              containerTagName='div'
              protocol=''
              injectScript
              onLoading={() => {}}
              onSuccess={() => {}}
              onAfterRender={() => {}}
              onFailure={() => {}}
            /> */}
            {/* instead of insta embed i ll display a post */}
            <Posts 
                  username="Instagram"
                  imageURL="https://images.unsplash.com/photo-1505156868547-9b49f4df4e04?ixid=MXwxMjA3fDB8MHxzZWFyY2h8MTF8fGluc3RhZ3JhbSUyMGxvZ298ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
                  caption="Connect with us"
            />  
        </div>
      </div>

      {/* we use a javascript feature called optional, you are checking for user.displayname but user maybe null, that time eventhough
        there is no user it will still search for displayname and there will be nthng and javascript will freak out and start
        throwing error. This may happen when the user is not signed in. So, to prevent we are using optional
        user.displayNama ===> user?.displayName
      */}
      {user?.displayName?
        <ImageUpload username={user.displayName}/>
      :
        <h3>Sorry, you need to login to upload</h3>
      }
    </div>
  );
}

export default App;
