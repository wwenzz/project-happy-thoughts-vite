import { useState, useEffect } from "react";
import ThoughtCard from "./ThoughtCard";
import CreateThought from "./CreateThought";
import styles from "./ThoughtsCollection.module.css";

const ThoughtsCollection = () => {
  const [thoughts, setThoughts] = useState(null);
  const [message, setMessage] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [validated, setValidated] = useState(true);

  const recordLikedPosts = thoughtID => {
    if (likedPosts.includes(thoughtID)) return;
    setLikedPosts([...likedPosts, thoughtID]);
  };

  const handleInputChange = event => {
    setValidated(true);
    const userInput = event.target.value;
    setMessage(userInput);
  };

  useEffect(() => {
    fetch("https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts")
      .then(res => res.json())
      .then(data => {
        console.log("useEffect is performed");
        console.log(data);
        setThoughts(data);
      });
  }, []);

  const createThought = event => {
    event.preventDefault();
    console.log(message);
    if (message.length >= 5 && message.length <= 140) {
      fetch("https://happy-thoughts-ux7hkzgmwa-uc.a.run.app/thoughts", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ message: message }),
      })
        .then(res => res.json())
        .then(newThought => {
          console.log("New thought:", newThought);
          setThoughts(prevThoughts => [newThought, ...prevThoughts]);
          setMessage("");
        });
    } else {
      setValidated(false);
    }
    // add some validation to prevent the message to be empty and from 5-140 letters
  };

  return (
    <div>
      <CreateThought
        onSubmit={createThought}
        value={message}
        onChange={handleInputChange}
      />

      <ul className={styles.items}>
        <li className={styles.item}>
          <div className={styles.inner}>
            <h2 className={styles.name}>{likedPosts.length}</h2>
            <p className={styles.descr}>Liked Thoughts</p>
          </div>
        </li>
        <li className={styles.item}>
          <div className={styles.inner}>
            <h2 className={styles.name}>0</h2>
            <p className={styles.descr}>Posted Thoughts</p>
          </div>
        </li>
        {/* <li className={styles.item}>
          <div className={styles.inner}>
            <h2 className={styles.name}>0</h2>
            <p className={styles.descr}>Total Thoughts</p>
          </div>
        </li> */}
      </ul>
      {!validated && <p>You should type within 5 to 140 words</p>}
      <div className={styles.thoughts}>
        {thoughts ? (
          thoughts.map((thought, index) => (
            <ThoughtCard
              key={thought._id}
              message={thought.message}
              likes={thought.hearts}
              time={thought.createdAt}
              thoughtID={thought._id}
              cardIndex={index}
              recordLikes={recordLikedPosts}
            />
          ))
        ) : (
          <p>Loading</p>
        )}
      </div>
    </div>
  );
};

export default ThoughtsCollection;
