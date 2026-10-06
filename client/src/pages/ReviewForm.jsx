import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { api } from '../api'

// TODO: build the Write Review page — see README.md "Your task".
// This page is already routed at /reviews/new (write) and /reviews/:id (edit),
// and both routes are wrapped in <ProtectedRoute>.

const defaults = { courseCode: '', rating: 5, comment: '' }

export default function ReviewForm() {
  const nav = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(defaults)
  const [error, setError] = useState('')

  // TODO (edit mode): when there is an `id`, load the review and fill the form.
  useEffect(() => {
  if (!id) return

  async function loadReview() {
    try {
      const res = await api.get(`/reviews/${id}`)

      setForm({
        courseCode: res.data.review.courseCode,
        rating: res.data.review.rating,
        comment: res.data.review.comment || ''
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load review')
    }
  }

  loadReview()
}, [id])

  // TODO: update `form` when an input changes (rating should be a number).
  function onChange(e) {
    const { name, value } = e.target

    setForm({
      ...form,
      [name]: name === 'rating' ? Number(value) : value,
    })
  }

  // Create a new review OR update an existing review.
  async function onSubmit(e) {
  e.preventDefault()
  setError('')

  try {
    const data = {
      courseCode: form.courseCode,
      rating: form.rating,
      comment: form.comment
    }

    if (id) {
      await api.patch(`/reviews/${id}`, data)
    } else {
      await api.post('/reviews', data)
    }

    nav('/reviews')
  } catch (err) {
    setError(err.response?.data?.message || 'Something went wrong')
  }
}

  // TODO: POST a new review, or PATCH the existing one when editing,
  // then go back to /reviews. Show the server's error message on failure.
  
  return (
    <div className="max-w-lg mx-auto card">
      <h1 className="text-xl font-semibold mb-4">
        {id ? 'Edit' : 'Write'} Review
      </h1>

      <form onSubmit={onSubmit} className="space-y-3">

        <div>
          <label className="block text-sm font-medium mb-1">
            Course Code
          </label>

          <input
            type="text"
            name="courseCode"
            value={form.courseCode}
            onChange={onChange}
            placeholder="CS101"
            className="input w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Rating
          </label>

          <select
            name="rating"
            value={form.rating}
            onChange={onChange}
            className="input w-full"
          >
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Comment
          </label>

          <textarea
            name="comment"
            value={form.comment}
            onChange={onChange}
            placeholder="Write your comment..."
            className="input w-full"
            rows={4}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button className="btn" type="submit">
          Save
        </button>
      </form>
    </div>
  )
}
