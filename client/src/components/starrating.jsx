import PropTypes from "prop-types";
import { useState } from "react";

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex space-x-1">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <label key={ratingValue}>
            <input
              type="radio"
              name="rating"
              value={ratingValue}
              onClick={() => onRatingChange(ratingValue)}
              className="hidden"
            />
            <svg
              className={`w-10 h-8 cursor-pointer ${
                ratingValue <= (hover || rating)
                  ? "text-yellow-500"
                  : "text-gray-300"
              }`}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(0)}
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.555 4.794a1 1 0 00.95.69h5.045c.969 0 1.371 1.24.588 1.81l-4.087 2.962a1 1 0 00-.364 1.118l1.555 4.794c.3.921-.755 1.688-1.539 1.118L10 14.25l-4.087 2.962c-.784.57-1.839-.197-1.539-1.118l1.555-4.794a1 1 0 00-.364-1.118L1.478 10.22c-.783-.57-.381-1.81.588-1.81h5.045a1 1 0 00.95-.69l1.555-4.794z" />
            </svg>
          </label>
        );
      })}
    </div>
  );
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

export default StarRating;
