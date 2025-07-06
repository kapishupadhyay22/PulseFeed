package controllers

import (
	"context"
	"encoding/json"
	"go-image-api/models"
	"go-image-api/platform"
	"net/http"
	"time"
)

func CreateComment(w http.ResponseWriter, r *http.Request) {
	var comment models.Comment
	err := json.NewDecoder(r.Body).Decode(&comment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = platform.NewComment(ctx, comment)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func DeleteComment(w http.ResponseWriter, r *http.Request) {
	id := r.URL.Query().Get("id")
	if id == "" {
		http.Error(w, "Comment ID required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := platform.DeleteComment(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetCommentsByPostID(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postID")
	if postID == "" {
		http.Error(w, "postID is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	comments, err := platform.CommentsOnPost(ctx, postID)

	// cursor, err := commentCollection.Find(ctx, bson.M{"postID": postID})
	if err != nil {
		http.Error(w, "Error retrieving comments: "+err.Error(), http.StatusInternalServerError)
		return
	}
	// defer cursor.Close(ctx)

	// var comments []models.Comment
	// for cursor.Next(ctx) {
	// 	var comment models.Comment
	// 	if err := cursor.Decode(&comment); err != nil {
	// 		continue
	// 	}
	// 	comments = append(comments, comment)
	// }

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}
