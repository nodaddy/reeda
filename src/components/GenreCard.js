"use client";

import React from "react";
import styles from "../app/page.module.css";

/**
 * GenreCard component for displaying a book genre with an icon
 * @param {Object} props - Component props
 * @param {Object} props.genre - Genre object with name and icon
 * @param {string} props.selectedGenre - Currently selected genre name
 * @param {Function} props.onSelect - Function to call when genre is selected
 */
const GenreCard = ({ genre, selectedGenre, onSelect }) => {
  const isSelected = selectedGenre === genre.name;

  return (
    <div
      className={`${styles.genreCard} ${
        isSelected ? styles.selectedGenre : ""
      }`}
      onClick={() => onSelect(genre.name)}
      style={{
        borderColor: genre.color,
        background: isSelected
          ? `linear-gradient(135deg, ${genre.color}80, ${genre.color}40)`
          : undefined,
      }}
    >
      <div className={styles.genreIcon}>{genre.icon}</div>
      <div className={styles.genreName}>{genre.name}</div>
      <div
        className={styles.genreCardBackground}
        style={{
          backgroundColor: `${genre.color}10`,
          borderColor: genre.color,
        }}
      />
    </div>
  );
};

export default GenreCard;
