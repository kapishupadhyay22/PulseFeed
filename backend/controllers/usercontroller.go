package controllers

import (
	"context"
	"encoding/json"
	"fmt"
	"go-image-api/middleware"
	"go-image-api/models"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection

func InitUserController(client *mongo.Client) {
	userCollection = client.Database("mediaDB").Collection("users")
}

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = userCollection.InsertOne(ctx, user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func DeleteUser(w http.ResponseWriter, r *http.Request) {
	authenticatedEmail, ok := r.Context().Value(middleware.UserEmailKey).(string)
	if !ok || authenticatedEmail == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Delete the authenticated user only
	_, err := userCollection.DeleteOne(ctx, bson.M{"email": authenticatedEmail})
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetAuthenticatedUser(w http.ResponseWriter, r *http.Request) {
	authenticatedEmail, ok := r.Context().Value(middleware.UserEmailKey).(string)
	fmt.Println("getting hre")
	if !ok || authenticatedEmail == "" {
		fmt.Println("here ")
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user models.User
	err := userCollection.FindOne(ctx, bson.M{"email": authenticatedEmail}).Decode(&user)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	user.Password = "" // Hide password in response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
