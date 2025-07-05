package controllers

import (
	"context"
	"encoding/json"
	"go-image-api/middleware"
	"go-image-api/models"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var imageCollection *mongo.Collection

func InitImageController(client *mongo.Client) {
	imageCollection = client.Database("mediaDB").Collection("images")
}

func UploadImage(w http.ResponseWriter, r *http.Request) {
	var img models.Post
	err := json.NewDecoder(r.Body).Decode(&img)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	res, err := imageCollection.InsertOne(ctx, img)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	img.ID = res.InsertedID.(primitive.ObjectID).Hex()
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(img)
}

func GetAllImages(w http.ResponseWriter, r *http.Request) {
	var images []models.Post

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	cursor, err := imageCollection.Find(ctx, bson.M{})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var img models.Post
		err := cursor.Decode(&img)
		if err != nil {
			log.Println("Decode error:", err)
			continue
		}
		images = append(images, img)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(images)
}

func DeletePost(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("id")
	userEmail := r.Context().Value(middleware.UserEmailKey).(string)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Check post owner
	var post models.Post
	err := imageCollection.FindOne(ctx, bson.M{"_id": postID}).Decode(&post)
	if err != nil || post.CreatorInfo.Email != userEmail {
		http.Error(w, "Unauthorized or post not found", http.StatusUnauthorized)
		return
	}

	_, err = imageCollection.DeleteOne(ctx, bson.M{"_id": postID})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
