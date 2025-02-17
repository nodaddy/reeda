import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const quotes = [
    "Let's go!",
    "Adding dictionary",
    "Almost done!",
    "Almost done!",
    "Almost done!",
    "Almost done!",
    "Almost done!",
];

const UploadingScanLoader = () => {
    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
        }, 800); // Change quote every 0.8 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            justifyContent: "center", 
            minHeight: "240px", 
            padding: "10px", 
            width:'100%',
            margin: 'auto',
            // background: "linear-gradient(to bottom right, #f0f0f0, #d1d1d1)",
            // boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
            borderRadius: "16px",
            textAlign: "center"
        }}>
            {/* Animated Premium Spinner */}
            <motion.div
                style={{
                    width: "50px", 
                    height: "50px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    background: "linear-gradient(to right, #3b82f6, #9333ea)",
                    padding: "8px", 
                    borderRadius: "50%", 
                    boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
                }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            >
                <Loader2 style={{ color: "white", width: "32px", height: "32px", animation: "spin 1s linear infinite" }} />
            </motion.div>
            
            {/* Animated Quote */}
            <motion.p
                key={quoteIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                style={{ 
                    marginTop: "30px", 
                    fontSize: "18px", 
                    fontWeight: "500", 
                    color: "#333", 
                    padding: "0 16px" 
                }}
            >
                {quotes[quoteIndex]}
            </motion.p>
        </div>
    );
};

export default UploadingScanLoader;
