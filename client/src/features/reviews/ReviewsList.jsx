import React, { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { initializeReviews } from "./reviewsSlice"

export const ReviewsList = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeReviews())
  }, [])
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
