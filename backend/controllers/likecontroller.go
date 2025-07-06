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
func GetLikersByPostID(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postID")
	if postID == "" {
		http.Error(w, "postID is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := likeCollection.Find(ctx, bson.M{"postID": postID})
	if err != nil {
		http.Error(w, "Error retrieving likes: "+err.Error(), http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var likers []models.CreatedBy
	for cursor.Next(ctx) {
		var like models.Likes
		if err := cursor.Decode(&like); err != nil {
			continue
		}
		likers = append(likers, like.CreatorInfo)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(likers)
}
func GetLikeCountByPostID(w http.ResponseWriter, r *http.Request) {
	postID := r.URL.Query().Get("postID")
	if postID == "" {
		http.Error(w, "postID is required", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	count, err := likeCollection.CountDocuments(ctx, bson.M{"postID": postID})
	if err != nil {
		http.Error(w, "Error counting likes: "+err.Error(), http.StatusInternalServerError)
		return
	}

	response := map[string]int64{"likeCount": count}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

