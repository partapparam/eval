import React from "react"
import { useSelector } from "react-redux"

export const ReviewsList = () => {
  const reviews = useSelector((state) => state.reviews)

  const renderedReviews = reviews.map((review) => (
    <div className="reviewBlock" key={review.id}>
      <h3>{review.text}</h3>
    </div>
  ))
  console.log(reviews)

  return (
    <section className="reviewsList">
      <h2>Reviews</h2>
      {renderedReviews}
    </section>
  )
}
