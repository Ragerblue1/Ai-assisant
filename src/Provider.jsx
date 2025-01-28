// import { DataContext } from "./context/UserContext";

// function DataProvider({ children }) {
//     // function speak(text) {
//     //     if ("speechSynthesis" in window) {
//     //         let text_Speak = new SpeechSynthesisUtterance(text);
//     //         text_Speak.volume = 1;
//     //         text_Speak.rate = 1;
//     //         text_Speak.pitch = 1;
//     //         text_Speak.lang = "en-GB";
//     //         window.speechSynthesis.speak(text_Speak);
//     //     } else {
//     //         console.warn("Speech synthesis not supported in this browser.");
//     //     }
//     // }
// let speechRecogination=window.SpeechRecognition || window.webkitSpeechRecogination

// let reco=new speechRecogination()
// reco.onresult=(e)=>{
// console.log(e);

// }
//     let value = {
//       reco
//     };

//     return (
//         <DataContext.Provider value={value}>
//             {children}
//         </DataContext.Provider>
//     );
// }

// export default DataProvider;
import { useState} from "react";
import { DataContext } from "./context/UserContext";
import run from "./Gemini";

function DataProvider({ children }) {
  let [speaking, setSpeaking] = useState(false);
  let [recoginationtext, setRecoginationtext] = useState("listening!!");
  const [response, setResponse] = useState(false)

  function speak(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      let text_Speak = new SpeechSynthesisUtterance(text);
      text_Speak.volume = 1;
      text_Speak.rate = 1;
      text_Speak.pitch = 1;
      text_Speak.lang = "en-GB";
      window.speechSynthesis.speak(text_Speak);
    } else {
      console.warn("Speech synthesis not supported in this browser.");
    }
  }

  async function aiResponse(prompt) {
    try {
      let text = await run(prompt); // Call the AI service

      let newText=text.split("**")&&text.split("*")&&text.replace("google","Ashish") && text.replace("Google","Ashish")
      setRecoginationtext(newText);
      speak(newText); // Speak the AI response
      setResponse(true);
      setTimeout(()=>{
        setSpeaking(false);
      },5000)
     
      console.log("AI Response:", text);
    } catch (error) {
      console.error("Error in AI response:", error);
    }
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  let reco = null;
  if (SpeechRecognition) {
    try {
      reco = new SpeechRecognition();
      reco.onresult = (event) => {
        let transcript = event.results[0][0].transcript;
        setRecoginationtext(transcript);
        aiResponse(transcript);
        takeCommand(transcript.toLowerCase())
      };
      reco.onerror = (error) => {
        console.error("Speech recognition error:", error);
      };
    } catch (error) {
      console.error("Error initializing SpeechRecognition:", error);
    }
  } else {
    console.warn("Speech recognition is not supported in this browser.");
  }

  function takeCommand(command) {
    if (command.includes("open") && command.includes("youtube")) {
      window.open("https://www.youtube.com/", "_blank");
      speak("Got it! Opening YouTube");
      setResponse(true);
      setRecoginationtext("Got it! Opening YouTube");
      setTimeout(() => {
        setSpeaking(false);
      }, 5000);
    } 
    else if (command.includes("open") && command.includes("google")) {
      window.open("https://www.google.com/", "_blank");
      speak("Got it! Opening Google");
      setResponse(true);
      setRecoginationtext("Got it! Opening Google");
      setTimeout(() => {
        setSpeaking(false);
      }, 5000);
    } 
    else if (command.includes("open") && command.includes("gemini")) {
      window.open("https://gemini.google.com/app?hl=en-IN", "_blank");
      speak("Got it! Opening Gemini");
      setResponse(true);
      setRecoginationtext("Got it! Opening Gemini");
      setTimeout(() => {
        setSpeaking(false);
      }, 5000);
    } 
    else if (command.includes("time")) {
      let localTime = new Date().toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
      aiResponse("What is the current time?").then((response) => {
        // Fallback to local time if Gemini's response doesn't make sense
        if (!response || !response.match(/\d{1,2}:\d{2}/)) {
          response = `The time is ${localTime}`;
        }
        speak(response);
        setResponse(true);
        setRecoginationtext(response);
        setTimeout(() => {
          setSpeaking(false);
        }, 5000);
      });
    } 
    else if (command.includes("date")) {
      let localDate = new Date().toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      aiResponse("What is today's date?").then((response) => {
        // Fallback to local date if Gemini's response doesn't make sense
        if (!response || !response.match(/\d{1,2}\s\w+/)) {
          response = `Today's date is ${localDate}`;
        }
        speak(response);
        setResponse(true);
        setRecoginationtext(response);
        setTimeout(() => {
          setSpeaking(false);
        }, 5000);
      });
    } else {
      aiResponse(command);
    }
  }
  
  
  const value = {
    reco, // Provide the recognition object
    speaking,
    setSpeaking,
    recoginationtext,
    setRecoginationtext,
    response,
    setResponse,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export default DataProvider;
