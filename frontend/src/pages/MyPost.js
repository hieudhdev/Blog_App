import Post from "../Post";
import { useEffect, useState, useContext } from "react";
import {UserContext} from "../UserContext";

export default function MyPost({ _id }) {

  const [posts,setPosts] = useState([]);
  const {userInfo} = useContext(UserContext);
//   console.log(userInfo);

  const userId = userInfo.id;
  useEffect(() => {
    fetch(`http://localhost:4000/mypost/${userId}`).then(response => {
      response.json().then(posts => {
        setPosts(posts);
        console.log(posts);
      });
    });
  }, []);


  return (
    <>
      {posts.length > 0 && posts.map(post => (
        <Post {...post} />
      ))}
    </>
  );
}