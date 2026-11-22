import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createPost } from '../api/posts.js'

export function CreatePost({ onCreated }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [contents, setContents] = useState('')
  const [category, setCategory] = useState('General')

  const queryClient = useQueryClient()

  const createPostMutation = useMutation({
    mutationFn: () =>
      createPost({
        title,
        author: author || 'Anonymous',
        contents,
        category,
      }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setTitle('')
      setAuthor('')
      setContents('')
      if (onCreated) onCreated(data)
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    createPostMutation.mutate()
  }

  return (
    <form onSubmit={handleSubmit} className="legacy-create-form">
      <div>
        <label htmlFor="create-title">Title: </label>
        <input
          type="text"
          name="create-title"
          id="create-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor="create-author">Author: </label>
        <input
          type="text"
          name="create-author"
          id="create-author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
      </div>

      <br />

      <div>
        <label htmlFor="create-category">Category: </label>
        <input
          type="text"
          name="create-category"
          id="create-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <br />

      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        placeholder="Write content..."
        rows={4}
      />

      <br />
      <br />

      <input
        type="submit"
        value={createPostMutation.isPending ? 'Creating...' : 'Create'}
        disabled={!title.trim() || createPostMutation.isPending}
      />

      {createPostMutation.isSuccess && (
        <p className="text-success">Post created successfully!</p>
      )}
    </form>
  )
}

CreatePost.propTypes = {
  onCreated: PropTypes.func,
}

export default CreatePost
