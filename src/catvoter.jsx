import { useState, useEffect } from 'react'

function Catvoter() {
  const API_URL = "https://api.thecatapi.com/v1/";
  const API_KEY = "live_fCy0xiv0nQYf85XuPp5tTcI5LYMQnQOp2dQJWSs8WOawIcTYOG1A1DOH5pkGolLt"; 
  
  const [currentImage, setCurrentImage] = useState(null);
  const [votes, setVotes] = useState([]);
  const [view, setView] = useState("vote"); // 'vote' or 'history'

  // Fetch a new image to vote on
  const fetchImage = () => {
    fetch(`${API_URL}images/search`, {
      headers: { "x-api-key": API_KEY },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentImage(data[0]);
      })
      .catch(console.error);
  };

  // Fetch vote history
  const fetchVotes = () => {
    fetch(`${API_URL}votes?limit=10&order=DESC`, {
      headers: { "x-api-key": API_KEY },
    })
      .then((res) => res.json())
      .then(setVotes)
      .catch(console.error);
  };

  // On initial load or when switching to vote view, get new image
  useEffect(() => {
    if (view === "vote") {
      fetchImage();
    } else if (view === "history") {
      fetchVotes();
    }
  }, [view]);

  // Send vote
  const vote = (value) => {
    if (!currentImage) return;

    fetch(`${API_URL}votes/`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": API_KEY,
      },
      body: JSON.stringify({
        image_id: currentImage.id,
        value,
      }),
    })
      .then(() => fetchImage())
      .catch(console.error);

    
  }
  return (
    <>
      <h1>cat voter</h1>
      <div className="cat_box">
      <div className="cat">
      <header>
        <button onClick={() => setView("vote")}>Vote</button>
        <button onClick={() => setView("history")}>History</button>
      </header>
    
      {view === "vote" && currentImage && (
        <div id="vote-options">
          <img
            id="image-to-vote-on"
            src={currentImage.url}
            alt="Cat to vote on"
            width="300"
          />
          <div>
            <button onClick={() => vote(1)}>Upvote</button>
            <button onClick={() => vote(-1)}>Downvote</button>
          </div>
        </div>
      )}

      {view === "history" && (
        <div id="vote-results" style={{ display: "block" }}>
          <div id="grid" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {votes.map((voteData) => (
              <div
                key={voteData.id}
                className={`col-lg ${voteData.value < 0 ? "red" : "green"}`}
                style={{ border: "1px solid #ccc", padding: "10px" }}
              >
                <img
                  src={voteData.image?.url}
                  alt="Voted cat"
                  width="150"
                  style={{ display: "block" }}
                />
                <p>Vote: {voteData.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
    </>
  )
}

export default Catvoter
