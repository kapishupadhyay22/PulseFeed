package http

import (
	"context"
	"encoding/json"
	"go-image-api/models"
	"go-image-api/platform"
	"net/http"
	"time"
)

// user likes a post
func CreateLike(w http.ResponseWriter, r *http.Request) {
	var like models.Likes
	err := json.NewDecoder(r.Body).Decode(&like)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = platform.Like(ctx, like)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

// user unlikes a post
func DeleteLike(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postID")
	email := r.URL.Query().Get("email")

	if postID == "" || email == "" {
		http.Error(w, "postID and email are required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := platform.Unlike(ctx, postID, email)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetLikersByPostID(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postID")
	if postID == "" {
		http.Error(w, "postID is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	likers, err := platform.LikerOfPost(ctx, postID)
	if err != nil {
		http.Error(w, "Error retrieving likes: "+err.Error(), http.StatusInternalServerError)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(likers)
}

// to get the number of likes
func GetLikeCountByPostID(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postID")
	if postID == "" {
		http.Error(w, "postID is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	count, err := platform.LikesOnPost(ctx, postID)
	if err != nil {
		http.Error(w, "Error counting likes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]int64{"likeCount": count}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
