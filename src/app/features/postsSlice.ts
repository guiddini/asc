import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  currentPage: 0, // You can set a default value for currentPage here
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    nextPage: (state) => {
      state.currentPage = state.currentPage + 10;
    },

    prevPage: (state) => {
      if (state.currentPage > 10) {
        state.currentPage = state.currentPage - 10;
      }
    },

    resetCurrentPage: (state) => {
      state.currentPage = 1;
    },

    initMedia: (state, action) => {
      const { postId, media } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex].media = media;
      }
    },

    // Update media for a post
    updateMedia: (state, action) => {
      const { postId, newMedia } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex].media = newMedia;
      }
    },

    addPost: (state, action) => {
      const newPost = action.payload;
      state.posts.unshift(newPost);
    },
    loadMorePost: (state, action) => {
      const newPosts = action.payload;
      state.posts = [...state.posts, ...newPosts]; // Create a new array with new posts appended
    },
    updatePostId: (state, action) => {
      const { tempPostId, realPostId } = action.payload;
      const postIndex = state.posts.findIndex((post) => post.id === tempPostId);

      if (postIndex !== -1) {
        state.posts[postIndex].id = realPostId;
      }
    },
    initPosts: (state, action) => {
      state.posts = action.payload;
    },

    editPost: (state, action) => {
      const { postId, newContent } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          content: newContent,
        };
      }
    },

    updatePost: (state, action) => {
      const { postId, newPost } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex] = newPost;
      }
    },

    deletePost: (state, action) => {
      const postIdToDelete = action.payload;
      state.posts = state.posts.filter((post) => post.id !== postIdToDelete);
    },

    // likes reducers
    increaseLikes: (state, action) => {
      const { postId, userId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (
        postIndex !== -1 &&
        !state.posts[postIndex].likes.some((like) => like.liker_id === userId)
      ) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          likes: [
            ...state.posts[postIndex].likes,
            {
              id: state.posts[postIndex].likes.length + 1, // Assign a unique ID for the like
              liker_id: userId,
              liker_type: "App\\Models\\User",
              likable_id: postId,
              likable_type: "App\\Models\\Post",
              created_at: new Date().toISOString(), // Set the current date as the created_at value
              updated_at: new Date().toISOString(), // Set the current date as the updated_at value
            },
          ],
        };
      }
    },

    decreaseLikes: (state, action) => {
      const { postId, userId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          likes: state.posts[postIndex].likes.filter(
            (like) => like.liker_id !== userId
          ),
        };
      }
    },

    // comments reducers

    addComment: (state, action) => {
      const { postId, content, commenter, commentId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const newComment = {
          id: commentId,
          commenter_id: commenter.id,
          commenter_type: "App\\Models\\User",
          commentable_id: postId,
          commentable_type: "App\\Models\\Post",
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          commenter: {
            id: commenter.id,
            fname: commenter.fname,
            lname: commenter.lname,
            avatar: commenter.avatar,
          },
        };

        state.posts[postIndex] = {
          ...state.posts[postIndex],
          comments: [...state.posts[postIndex].comments, newComment],
        };
      }
    },

    addCommentAtIndex: (state, action) => {
      const { postId, comment, index } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        // Make a copy of the comments array
        const comments = state.posts[postIndex].comments.slice();

        // Insert the comment at the specified index
        comments.splice(index, 0, comment);

        // Update the post with the modified comments array
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          comments: comments,
        };
      }
    },

    editComment: (state, action) => {
      const { postId, commentId, newDescription } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const comments = state.posts[postIndex].comments.map((comment) =>
          comment.id === commentId
            ? { ...comment, content: newDescription }
            : comment
        );

        state.posts[postIndex] = {
          ...state.posts[postIndex],
          comments: comments,
        };
      }
    },

    updateCommentId: (state, action) => {
      const { postId, tempCommentId, realCommentId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const comments = state.posts[postIndex].comments.map((c) =>
          c.id === tempCommentId ? { ...c, id: realCommentId } : c
        );

        state.posts[postIndex] = {
          ...state.posts[postIndex],
          comments: comments,
        };
      }
    },

    deleteComment: (state, action) => {
      const { postId, commentId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        const updatedComments = state.posts[postIndex].comments.filter(
          (c) => c.id !== commentId
        );

        // Use the Immer draft function to modify the draft state
        state.posts = state.posts.map((post, index) =>
          index === postIndex ? { ...post, comments: updatedComments } : post
        );
      }
    },

    // replies reducers

    addReply: (state, action) => {
      const { postId, commentId, description, user } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          comments: state.posts[postIndex].comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: [
                    ...comment.replies,
                    {
                      description: description,
                      user: user,
                      created_at: new Date().toISOString(),
                      id: Math.random(),
                    },
                  ],
                }
              : comment
          ),
        };
      }
    },

    editReply: (state, action) => {
      const { postId, commentId, replyId, newDescription } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          comments: state.posts[postIndex].comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.map((reply) =>
                    reply.id === replyId
                      ? { ...reply, description: newDescription }
                      : reply
                  ),
                }
              : comment
          ),
        };
      }
    },

    deleteReply: (state, action) => {
      const { postId, commentId, replyId } = action.payload;
      const postIndex = state.posts.findIndex((p) => p.id === postId);

      if (postIndex !== -1) {
        state.posts[postIndex] = {
          ...state.posts[postIndex],
          comments: state.posts[postIndex].comments.map((comment) =>
            comment.id === commentId
              ? {
                  ...comment,
                  replies: comment.replies.filter((r) => r.id !== replyId),
                }
              : comment
          ),
        };
      }
    },
  },
});

export const {
  addPost,
  loadMorePost,
  updatePostId,
  editPost,
  updatePost,
  deletePost,
  initPosts,
  increaseLikes,
  decreaseLikes,
  addComment,
  addCommentAtIndex,
  updateCommentId,
  deleteComment,
  editComment,
  addReply,
  editReply,
  deleteReply,
  nextPage,
  prevPage,
  resetCurrentPage,
  initMedia,
  updateMedia,
} = postsSlice.actions;

export default postsSlice.reducer;
