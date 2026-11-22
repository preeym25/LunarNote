import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPost,
  deletePost,
  getCategories,
  getPostById,
  getPosts,
  getTags,
  updatePost,
} from '../api/posts.js'

export function usePosts(params = {}) {
  return useQuery({
    queryKey: ['posts', params],
    queryFn: () => getPosts(params),
    placeholderData: (previousData) => previousData,
  })
}

export function usePost(id) {
  return useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
    enabled: Boolean(id),
  })
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: getTags,
  })
}

export function useCreatePost({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      if (onSuccess) onSuccess(newPost)
    },
    onError: (err) => {
      if (onError) onError(err)
    },
  })
}

export function useUpdatePost({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updatePost,
    onSuccess: (updatedPost, variables) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['post', variables.id] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      if (onSuccess) onSuccess(updatedPost)
    },
    onError: (err) => {
      if (onError) onError(err)
    },
  })
}

export function useDeletePost({ onSuccess, onError } = {}) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deletePost,
    onSuccess: (_, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ['posts'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.removeQueries({ queryKey: ['post', deletedId] })
      if (onSuccess) onSuccess(deletedId)
    },
    onError: (err) => {
      if (onError) onError(err)
    },
  })
}
