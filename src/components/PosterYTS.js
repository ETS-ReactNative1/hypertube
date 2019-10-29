import React from "react";
import Rating from "react-rating";
import ProgressBar from "components/ProgressBar";
import { ReactComponent as StarFull } from "svg/star-full.svg";
import { ReactComponent as StarEmpty } from "svg/star-empty.svg";

const Poster = ({ movie, language, from }) => (
  <div className="poster-container">
    <img
      className="movie-poster"
      src={
        from === "yst"
          ? `https://yst.am${movie.large_cover_image}`
          : movie.large_cover_image
      }
      onError={ e => { e.target.onerror = null; e.target.src="http://underscoremusic.co.uk/site/wp-content/uploads/2014/05/no-poster.jpg" }}
      alt={movie.title}
    />
    <ProgressBar progress={movie.watchPercent ? movie.watchPercent : 0} />
    <div className="poster-overlay">
      <div className="poster-content">
        <h3>{movie.title} ({movie.year})</h3>
        <p>{movie.summary}</p>
        <div className="row center">
          <span style={{ marginTop: 2.75 }}>
            <Rating
              readonly={true}
              initialRating={movie.ratingAverage ? movie.ratingAverage : 0}
              emptySymbol={
                <StarEmpty width="15" height="15" fill="#FFD700" />
              }
              fullSymbol={<StarFull width="15" height="15" fill="#FFD700" />}
              fractions={2}
            />
          </span>
          <span style={{ marginLeft: 5 }}>({movie.ratingCount ? movie.ratingCount : 0})</span>
        </div>
      </div>
    </div>
  </div>
);

export default Poster;
