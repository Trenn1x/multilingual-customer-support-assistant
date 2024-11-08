import React, { useState } from 'react';
import axios from 'axios';

function Translation() {
    const [text, setText] = useState("");
    const [targetLang, setTargetLang] = useState("de");
    const [translatedText, setTranslatedText] = useState("");
    const [messages, setMessages] = useState([]);  // Array to hold conversation history

    const handleTranslate = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/translate', {
                text,
                lang: targetLang
            });
            const translation = response.data.translation;
            setTranslatedText(translation);

            // Add the new message to the history
            setMessages(prevMessages => [
                ...prevMessages,
                { text, translation, lang: targetLang }
            ]);

            setText("");  // Clear the input field after translation
        } catch (error) {
            console.error("Translation error:", error);
        }
    };

    const handlePlayAudio = async (message) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/tts', {
                text: message.translation,
                lang: message.lang
            }, { responseType: 'blob' });
            const audioUrl = URL.createObjectURL(response.data);
            const audio = new Audio(audioUrl);
            audio.play();
        } catch (error) {
            console.error("Audio error:", error);
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '40px auto', padding: '30px', fontFamily: 'Arial, sans-serif', backgroundColor: '#FFFAF0', borderRadius: '10px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)' }}>
            <select
                onChange={(e) => setTargetLang(e.target.value)}
                value={targetLang}
                style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '2px solid #FFB6C1', fontSize: '16px', color: '#333', backgroundColor: '#FFE4E1' }}
            >
                <option value="de">German</option>
                <option value="es">Spanish</option>
            </select>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter text to translate"
                style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '2px solid #FFB6C1', marginBottom: '20px', fontSize: '16px', color: '#333', backgroundColor: '#FFF0F5', resize: 'none', minHeight: '80px' }}
            />
            <button
                onClick={handleTranslate}
                style={{
                    display: 'block',
                    width: '100%',
                    padding: '12px',
                    marginBottom: '20px',  // Increased margin here
                    backgroundColor: '#FFA07A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)'
                }}
            >
                Translate
            </button>

            <div style={{ maxHeight: '400px', overflowY: 'scroll', padding: '20px', border: '2px solid #FFB6C1', borderRadius: '10px', backgroundColor: '#FFF8DC', marginTop: '20px' }}>
                {messages.map((message, index) => (
                    <div key={index} style={{ marginBottom: '20px' }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '8px' }}>
                            <div style={{ backgroundColor: '#ADD8E6', padding: '12px', borderRadius: '10px', maxWidth: '80%', fontSize: '16px' }}>
                                <p style={{ margin: '0', color: '#005073', fontWeight: 'bold' }}>You:</p>
                                <p style={{ margin: '0', color: '#005073' }}>{message.text}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <div style={{ backgroundColor: '#FFB6C1', padding: '12px', borderRadius: '10px', maxWidth: '80%', fontSize: '16px' }}>
                                <p style={{ margin: '0', color: '#8B0000', fontWeight: 'bold' }}>Translation:</p>
                                <p style={{ margin: '0', color: '#8B0000' }}>{message.translation}</p>
                                <button
                                    onClick={() => handlePlayAudio(message)}
                                    style={{
                                        marginTop: '8px',
                                        padding: '6px 12px',
                                        backgroundColor: '#8B0000',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)'
                                    }}
                                >
                                    Play Audio
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Translation;
