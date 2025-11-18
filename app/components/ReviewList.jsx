"use client";

import { useState } from "react";
import Image from "next/image";
import { FaStar } from "react-icons/fa";
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa6"; // Filled icons

const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "Darrell Steward",
    avatar: "/assets/images/Avthar1.png",
    rating: 5,
    title: "This is amazing product I have.",
    date: "July 2, 2020 03:29 PM",
    likes: 128,
    dislikes: 3,
    voted: null, // "like" | "dislike"
  },
  {
    id: 2,
    name: "Darlene Robertson",
    avatar: "/assets/images/Avthar2.png",
    rating: 5,
    title: "This is amazing product I have.",
    date: "July 2, 2020 1:04 PM",
    likes: 82,
    dislikes: 1,
    voted: null,
  },
];

export default function ReviewList() {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  const handleVote = (id, type) => {
    setReviews((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;

        let likes = r.likes;
        let dislikes = r.dislikes;

        // 🔥 Toggle Logic
        if (type === "like") {
          if (r.voted === "like") {
            // Already liked → remove like
            likes -= 1;
            return { ...r, likes, voted: null };
          } else {
            // If previously disliked → remove dislike
            if (r.voted === "dislike") dislikes -= 1;
            likes += 1;
            return { ...r, likes, dislikes, voted: "like" };
          }
        }

        if (type === "dislike") {
          if (r.voted === "dislike") {
            // Already disliked → remove dislike
            dislikes -= 1;
            return { ...r, dislikes, voted: null };
          } else {
            // If previously liked → remove like
            if (r.voted === "like") likes -= 1;
            dislikes += 1;
            return { ...r, likes, dislikes, voted: "dislike" };
          }
        }

        return r;
      })
    );
  };

  return (
    <section className="mt-12 rounded-2xl p-6 md:p-8">
      <h2 className="text-sm font-semibold text-[var(--dark-color)] mb-4">
        Review Lists
      </h2>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="pb-6 border-b last:border-b-0 border-[var(--bg-muted)]"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
              
              {/* LEFT */}
              <div className="flex-1">
                <div className="flex items-center gap-1 mb-2">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <FaStar key={i} className="text-yellow-400 text-sm" />
                  ))}
                </div>

                <p className="font-semibold text-[var(--dark-color)] text-sm md:text-base">
                  {review.title}
                </p>

                <p className="text-xs text-[var(--text-muted)] mt-1">
                  {review.date}
                </p>

                <div className="flex items-center gap-2 mt-3">
                  <div className="w-7 h-7 rounded-full overflow-hidden">
                    <Image
                      src={review.avatar}
                      alt={review.name}
                      width={28}
                      height={28}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--dark-color)]">
                    {review.name}
                  </span>
                </div>
              </div>

              {/* RIGHT: LIKE / DISLIKE */}
              <div className="flex items-center gap-3">

                {/* LIKE BUTTON */}
                <button
                  onClick={() => handleVote(review.id, "like")}
                  className="flex items-center gap-2 border border-[var(--bg-muted)] rounded-lg px-3 py-1 text-xs hover:bg-[var(--bg-muted)] transition"
                >
                  {review.voted === "like" ? (
                    <FaThumbsUp className="text-green-600" />
                  ) : (
                    <FiThumbsUp className="text-[var(--dark-color)]" />
                  )}
                  <span className="text-[var(--dark-color)]">{review.likes}</span>
                </button>

                {/* DISLIKE BUTTON */}
                <button
                  onClick={() => handleVote(review.id, "dislike")}
                  className="flex items-center gap-2 border border-[var(--bg-muted)] rounded-lg px-3 py-1 text-xs hover:bg-[var(--bg-muted)] transition"
                >
                  {review.voted === "dislike" ? (
                    <FaThumbsDown className="text-red-600" />
                  ) : (
                    <FiThumbsDown className="text-[var(--dark-color)]" />
                  )}
                  <span className="text-[var(--dark-color)]">{review.dislikes}</span>
                </button>

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
