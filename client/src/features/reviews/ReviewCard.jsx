import React from "react"
import { useSelector } from "react-redux"

export const ReviewCard = ({ match }) => {
  const { reviewId } = match.params

  const review = useSelector((state) =>
    state.reviews.find((review) => review.id === reviewId)
  )

  if (!review) {
    return (
      <section>
        <h2>Review not found!</h2>
      </section>
    )
  }

  return (
    <section>
      <article className="review">
        <h2>{review.title}</h2>
        <p className="review-content">{review.content}</p>
      </article>
    </section>
  )
}
