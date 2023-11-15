import axios from 'axios';

export async function createPost() {
    try {
      const user = this.$store.state.user;
      if (!user || !user.user_id) {
        this.errorMessage = "User information not available.";
      return;
      }

      const user_id = user.user_id;
      const token = this.$store.state.token;
      const formData = new FormData();
      formData.append("user_id", user_id);
      formData.append('textual_post', this.postContent);
      formData.append('image_url', this.selectedFile);

      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      };

      const response = await axios.post("/api/posts", formData, config);

      if (response.status === 201) {
        this.successMessage = response.data.message;
        this.postContent = '';
        this.errorMessage = "";
        this.selectedFile = null;
        this.previewUrl = null;

      await this.fetchPosts();
        setTimeout(() => {
          this.successMessage = '';
      }, 1500);
      } else {
          this.errorMessage = "Failed to create the post";
      }
    } catch (error) {
      console.error('Error creating the post:', error);
      this.errorMessage = 'Error creating the post.';
    }
  }

  export async function fetchPosts() {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get('/api/posts', { headers });

      if (response.status === 200) {
        this.posts = response.data.posts
        .map(post => ({ ...post, comments: [], likes: 0 }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      } else {
          console.error('Failed to fetch posts. Please try again.');
          this.errorMessage = 'Failed to fetch posts. Please try again.';
      }
    } catch (error) {
        console.error('Error fetching posts:', error);
        this.errorMessage = 'Error fetching posts. Please try again.';
    }
  }

  export async function updatePostText(post) {
    try {
      const postId = post.post_id;
      const updatedText = this.newTextualPost;
      const token = localStorage.getItem('token');

      const response = await axios.put(`/api/posts/${postId}`, {
        textual_post: updatedText,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        this.successMessage = 'Post updated successfully';
        this.errorMessage = '';
        this.editingPostId = null;

        await this.fetchPosts();
        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      } else {
        this.successMessage = '';
        this.errorMessage = 'Failed to update the post';
      }
    } catch (error) {
      console.error('Error updating post:', error);
      this.successMessage = '';
      this.errorMessage = 'Error updating the post';
    }
  }

  export async function confirmDeletePost(post) {
    try {
      const confirmation = confirm('Are you sure you want to delete this post?');
  
      if (confirmation) {
        await deletePost.call(this, post);
      }
    } catch (error) {
      console.error('Error confirming delete:', error);
    }
  }
  
  export async function deletePost(post) {
    try {
      const token = this.$store.state.token || localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.delete(`/api/posts/${post.post_id}`, { headers });
  
      if (response.status === 200) {
        this.successMessage = 'Post deleted successfully';
        this.errorMessage = '';
        await fetchPosts.call(this);
        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      } else {
        this.errorMessage = 'Failed to delete the post';
      }
    } catch (error) {
      console.error('Error deleting the post:', error);
      this.errorMessage = 'Error deleting the post.';
    }
  }

  export async function addComment(post) {
    try {
      const postId = post.post_id;
        if (!post.newComment) {
          this.errorMessage = 'Please enter a comment.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 1500);
        return;
        }

      const commentText = post.newComment.trim();
        if (commentText === '') {
          this.errorMessage = 'Please enter a comment.';
          setTimeout(() => {
            this.errorMessage = '';
          }, 1500);
        return; 
        }

      const token = this.$store.state.token || localStorage.getItem('token');
      const userData = this.$store.state.user || JSON.parse(localStorage.getItem('user'));
      const userId = userData.user_id;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post(`/api/comments/${postId}`, {
        postId: postId,
        userId: userId,
        comment: commentText,
        firstname: userData.firstname,
        lastname: userData.lastname,
      }, { headers });

      if (response.status === 201) {
        const newComment = { ...response.data, firstname: userData.firstname, lastname: userData.lastname };
        post.comments.push(newComment);     
        await this.fetchComments(post);
        this.toggleCommentInput(post);
        this.successMessage = 'Comment added successfully';
        this.errorMessage = '';
        post.newComment = '';

        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      } else {
          this.errorMessage = 'Failed to add the comment. Please try again.';     
      }
    } catch (error) {
        console.error('Error adding comment:', error);
        this.errorMessage = 'An error occurred while adding the comment. Please try again later.';
    }
  }

  export async function toggleCommentInput(post) {
    post.showCommentInput = !post.showCommentInput;
    if (post.showCommentInput) {
      await this.fetchComments(post);
    }
  }

  export async function fetchComments(post) {
    try {
      const postId = post.post_id;
      const token = localStorage.getItem('token');

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`/api/comments/${postId}`, { headers });

      if (response.status === 200) {
        post.comments = response.data.comments;
        post.totalComments = response.data.comments.length;
      } else {
        console.error('Error fetching comments:', response.status);
        this.errorMessage = 'Failed to fetch comments. Please try again.';
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      this.errorMessage = 'An error occurred while fetching comments. Please try again.';
    }
  }

  export async function loadPostsAndComments() {
    await fetchPosts.call(this);
  
    for (const post of this.posts) {
      await fetchComments.call(this, post);
    }
  
    for (const post of this.posts) {
      await fetchLikes.call(this, post);
    }
  }

  export async function saveEditedComment(comment) {
    try {
      const token = this.$store.state.token || localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
  
      const response = await axios.put(`/api/comments/${comment.comment_id}`, {
        commentId: comment.comment_id,
        userId: comment.user_id,
        comment: this.editedComment,
      }, { headers });
  
      if (response.status === 200) {
        comment.comment = this.editedComment;
        this.editedComment = '';
        this.editingCommentId = null;
        this.successMessage = 'Comment updated successfully';
        this.errorMessage = '';
        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      } else {
        console.error('Error editing comment:', response.status);
        this.errorMessage = 'Failed to update the comment. Please try again.';
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      this.errorMessage = 'An error occurred while updating comment. Please try again.';
    }
  }

  export function confirmDeleteComment(comment) {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteComment.call(this, comment);
    }
  }
  
  export async function deleteComment(comment) {
    try {
      const token = this.$store.state.token || localStorage.getItem('token');
      const userId = this.userData.user_id;
      const commentId = comment.comment_id;
  
      const response = await axios.delete(`/api/comments/${commentId}`, {
        data: {
          userId,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.status === 200) {
        const postContainingComment = this.posts.find(post => post.comments && post.comments.some(c => c.comment_id === comment.comment_id));
        postContainingComment.comments = postContainingComment.comments.filter(c => c.comment_id !== comment.comment_id);
  
        this.successMessage = 'Comment deleted successfully';
        this.errorMessage = '';
        await fetchComments.call(this, postContainingComment);
        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      } else {
        console.error('Error deleting comment:', response);
        this.errorMessage = 'Failed to delete comment. Please try again.';
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      this.errorMessage = 'An error occurred while deleting the comment. Please try again.';
    }
  }

  export async function handleLikeAction(post, action) {
    try {
      const token = this.$store.state.token || localStorage.getItem('token');
      const userData = this.$store.state.user || JSON.parse(localStorage.getItem('user'));
      const userId = userData.user_id;

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.post('/api/likes', {
        post_id: post.post_id,
        user_id: userId,
        like: action === 'like' ? 1 : 0,
      }, { headers });

      if (response.status === 200) {
        this.successMessage = response.data.action === 'add' ? 'Like added successfully' : 'Like removed successfully';
        this.errorMessage = '';
        await this.fetchLikes(post);
        setTimeout(() => {
          this.successMessage = '';
        }, 1500);
      } else {
          console.error('Error adding like:', response);
          this.errorMessage = 'Failed to add like. Please try again.';
      }
    } catch (error) {
      console.error('Error handling like action:', error);
      this.errorMessage = 'An error occurred while adding the like. Please try again.';
    }
  }

  export async function fetchLikes(post) {
    try {
      const postId = post.post_id;
      const token = this.$store.state.token || localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(`/api/likes/${postId}`, { headers });

      if (response.status === 200) {
        post.likes = response.data;
        post.totalLikes = response.data.length;
      } else {
        console.error('Failed to fetch likes:', response);
        this.errorMessage = 'Failed to fetch likes. Please try again.';
      }
    } catch (error) {
        console.error('Error fetching likes:', error);
        this.errorMessage = 'An error occurred while fetching the like. Please try again.';
    }
  }
