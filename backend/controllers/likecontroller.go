package controllers

import (
	"context"
	"encoding/json"
	"go-image-api/models"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var likeCollection *mongo.Collection

func InitLikeController(client *mongo.Client) {
	likeCollection = client.Database("mediaDB").Collection("likes")
}

func CreateLike(w http.ResponseWriter, r *http.Request) {
	var like models.Likes
	err := json.NewDecoder(r.Body).Decode(&like)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = likeCollection.InsertOne(ctx, like)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func DeleteLike(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postID")
	email := r.URL.Query().Get("email")

	if postID == "" || email == "" {
		http.Error(w, "postID and email are required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := likeCollection.DeleteOne(ctx, bson.M{
		"postID":            postID,
		"creatorInfo.email": email,
	})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
