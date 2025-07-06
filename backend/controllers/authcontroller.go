package controllers

import (
	"context"
	"encoding/json"
	"go-image-api/middleware"
	"go-image-api/models"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

// var jwtKey = []byte("cloudSEK-intern-assignment")
var authUserCollection *mongo.Collection

func InitAuthController(client *mongo.Client) {
	authUserCollection = client.Database("mediaDB").Collection("users")
}

func Register(w http.ResponseWriter, r *http.Request) {
	var user models.User
	json.NewDecoder(r.Body).Decode(&user)

	hash, _ := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	user.Password = string(hash)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := authUserCollection.InsertOne(ctx, user)
	if err != nil {
		http.Error(w, "Email already registered", http.StatusConflict)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func Login(w http.ResponseWriter, r *http.Request) {
	var creds models.User
	json.NewDecoder(r.Body).Decode(&creds)

	var foundUser models.User
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	err := authUserCollection.FindOne(ctx, bson.M{"email": creds.Email}).Decode(&foundUser)
	if err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	err = bcrypt.CompareHashAndPassword([]byte(foundUser.Password), []byte(creds.Password))
	if err != nil {
		http.Error(w, "Invalid password", http.StatusUnauthorized)
		return
	}

	// Generate JWT token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"email": foundUser.Email,
		"name":  foundUser.Name,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	tokenStr, _ := token.SignedString(middleware.JwtKey)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"token": tokenStr})
}
