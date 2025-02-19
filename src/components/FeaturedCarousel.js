import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, 
  BookOpen, 
  FileText, 
  Hourglass, 
  Library, 
  Sparkle, 
  Sparkles, 
  Target
} from 'lucide-react';

const FeatureCarousel = () => {
  const features = [
    {
        title: "Manage bookmarks",
        description: "Update bookmarks after your reading session",
        icon: <Sparkles size={48} />,
    },
    {
        title: "Track reading session summaries",
        description: "Add summary of your reading session",
        icon: <Sparkles size={48} />,
    },
    {
      title: "Digital Bookshelf",
      description: "Organize all your books in one place",
      icon: <Library size={48} />,
    },
    {
      title: "In-page Dictionary",
      description: "Tap on the word to see the meaning instantly",
      icon: <BookOpen size={48} />,
    },
    {
      title: "Summaries",
      description: "Get concise summaries of your pages",
      icon: <FileText size={48} />,
    },
    {
      title: "Track Goals",
      description: "Set reading goals and track your progress",
      icon: <Target size={48} />,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const carouselRef = useRef(null);

  // Auto-advance the carousel every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 1800);
    
    return () => clearInterval(interval);
  }, [features.length]);

  const goToSpecificSlide = (index) => {
    setCurrentIndex(index);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    // Minimum swipe distance (in pixels) to register as a swipe
    const minSwipeDistance = 50;
    const swipeDistance = touchEndX.current - touchStartX.current;
    
    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0) {
        // Swiped right - go to previous slide
        setCurrentIndex((prevIndex) => 
          prevIndex === 0 ? features.length - 1 : prevIndex - 1
        );
      } else {
        // Swiped left - go to next slide
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % features.length
        );
      }
    }
    
    // Reset touch coordinates
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  // Styles
  const styles = {
    carouselContainer: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '2rem 1rem',
      textAlign: 'center',
    },
    carouselTitle: {
      marginBottom: '2rem',
      fontSize: '2rem',
      color: '#333',
    },
    carouselContent: {
      padding: '0 2rem',
      marginBottom: '2rem',
      touchAction: 'pan-y', // Allow vertical scrolling but capture horizontal swipes
    },
    featureItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      animation: 'fadeIn 0.5s ease-in-out',
      minHeight: '250px',
    },
    featureIcon: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '80px',
      height: '80px',
      backgroundColor: '#f0f8ff',
      borderRadius: '50%',
      marginBottom: '1rem',
      color: '#4a90e2',
    },
    featureTitle: {
      fontSize: '1.5rem',
      marginBottom: '0.5rem',
      color: '#333',
    },
    featureDescription: {
      fontSize: '1rem',
      color: '#666',
      maxWidth: '300px',
    },
    carouselIndicators: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.75rem',
    },
    indicator: {
      width: '30px',
      height: '4px',
      backgroundColor: '#ddd',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    indicatorActive: {
      backgroundColor: '#4a90e2',
    },
  };

  return (
    <div style={styles.carouselContainer}>      
      <div 
        ref={carouselRef}
        style={styles.carouselContent}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div style={{
          ...styles.featureItem,
          animation: 'fadeIn 0.5s ease-in-out',
        }}>
          <div style={styles.featureIcon}>
            {features[currentIndex].icon}
          </div>
          <h3 style={styles.featureTitle}>{features[currentIndex].title}</h3>
          <p style={styles.featureDescription}>{features[currentIndex].description}</p>
        </div>
      </div>

      <br/>
      
      <div 
        style={styles.carouselIndicators}
        className="responsive-indicators"
      >
        {features.map((_, index) => (
          <button
            key={index}
            style={{
              ...styles.indicator,
              ...(index === currentIndex ? styles.indicatorActive : {}),
            }}
            onClick={() => goToSpecificSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default FeatureCarousel;