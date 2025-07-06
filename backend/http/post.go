package http

import (
	"context"
	"encoding/json"
	"go-image-api/middleware"
	"go-image-api/models"
	"go-image-api/platform"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// when user posts image and description
func UploadPost(w http.ResponseWriter, r *http.Request) {
	var post models.Post
	err := json.NewDecoder(r.Body).Decode(&post)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := platform.NewPost(ctx, post)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	post.ID = res.InsertedID.(primitive.ObjectID).Hex()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(post)
}

// for feeds page
func GetAllPosts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	posts, err := platform.GetAllPosts(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("id")
	userEmail := r.Context().Value(middleware.UserEmailKey).(string)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := platform.DeletePost(ctx, postID, userEmail)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}
	w.WriteHeader(http.StatusOK)
}
