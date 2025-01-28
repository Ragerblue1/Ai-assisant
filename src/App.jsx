import { useContext } from "react";
import "./App.css";
import aiImage from "./Images/ai.png";
import { IoMicOutline } from "react-icons/io5";
import { DataContext } from "./context/UserContext";
import speakimg from "./Images/speak.gif";
import aiVoice from "./Images/aiVoice.gif";
const App = () => {
  const { reco, speaking, setSpeaking, recoginationtext, response ,setRecoginationtext,setResponse} =
    useContext(DataContext);

  return (
    <div className="main">
      {/* AI Assistant Section */}

      <img src={aiImage} alt="AI" id="Virtualai" />
      <span>I am Your Virtual AI Assistant</span>
      {!speaking ? (
        <button
          onClick={() => {
            setRecoginationtext("listening!!")
            setSpeaking(true);
            setResponse(false)
            reco.start();
          }}
        >
          Click Here <IoMicOutline />
        </button>
      ) : (
        <div className="response">
          {!response ? (
            <img src={speakimg} alt="" id="speakimg" />
          ) : (
            <img src={aiVoice} alt="" id="aivoice" />
          )}

          <p>{recoginationtext}</p>
        </div>
      )}
    </div>
  );
};

export default App;
