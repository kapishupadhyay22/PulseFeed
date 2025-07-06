package controllers

import (
	"context"
	"encoding/json"
	"go-image-api/middleware"
	"go-image-api/models"
	"go-image-api/platform"
	"net/http"
	"time"
)

// var userCollection *mongo.Collection

// func NewUserDB(client *mongo.Client) {
// 	userCollection = client.Database("myDB").Collection("users")
// }

func CreateUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	err := json.NewDecoder(r.Body).Decode(&user)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err = platform.NewUser(ctx, user)
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
	err := platform.DeleteUser(ctx, authenticatedEmail)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func GetAuthenticatedUser(w http.ResponseWriter, r *http.Request) {
	authenticatedEmail, ok := r.Context().Value(middleware.UserEmailKey).(string)
	if !ok || authenticatedEmail == "" {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	user, err := platform.UserByID(ctx, authenticatedEmail)
	if err != nil {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	user.Password = "" // Hide password in response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}
