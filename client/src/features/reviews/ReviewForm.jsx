import React, { useState } from "react"
import { useDispatch } from "react-redux"

import { appendReview, saveReview } from "./reviewsSlice"

export const ReviewForm = () => {
  const [text, setText] = useState("")

  const dispatch = useDispatch()

  const onTextChange = (e) => setText(e.target.value)

  const onSaveReviewClicked = () => {
    if (text) {
      dispatch(saveReview())
    }
    setText("")
  }

  return (
    <section>
      <h2>Add New Review</h2>
      <form>
        <input type="text" name="text" />
        <button type="submit" onClick={onSaveReviewClicked}>
          Save Review
        </button>
      </form>
    </section>
  )
}
