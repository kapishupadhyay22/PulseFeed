package controllers

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

func UploadImage(w http.ResponseWriter, r *http.Request) {
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

func GetAllImages(w http.ResponseWriter, r *http.Request) {
	// var images []models.Post

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	posts, err := platform.GetAllPosts(ctx)

	// cursor, err := imageCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	// defer cursor.Close(ctx)

	// for cursor.Next(ctx) {
	// 	var img models.Post
	// 	err := cursor.Decode(&img)
	// 	if err != nil {
	// 		log.Println("Decode error:", err)
	// 		continue
	// 	}
	// 	images = append(images, img)
	// }

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("id")
	userEmail := r.Context().Value(middleware.UserEmailKey).(string)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := platform.DeletePost(ctx, postID, userEmail)
	// Check post owner
	// var post models.Post
	// objID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return
	}
	// err = imageCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&post)

	// if err != nil || post.CreatorInfo.Email != userEmail {
	// 	http.Error(w, "Unauthorized or post not found", http.StatusUnauthorized)
	// 	return
	// }

	// _, err = imageCollection.DeleteOne(ctx, bson.M{"_id": objID})
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	w.WriteHeader(http.StatusOK)
}
