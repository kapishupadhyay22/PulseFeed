package main

import (
	"context"
	"fmt"
	httpHandlers "go-image-api/http"
	"go-image-api/middleware"
	"go-image-api/platform"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Project made by => Kapish Upadhyay (SWE intern @keploy)

// this connects the mmongoDB in a docker container
func connectMongoDB() *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017") // local mongo in the docker
	client, err := mongo.Connect(ctx, clientOptions)

	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Successfully connected to mongoDB")
	return client
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173") // I am only allowing the frontend to interact with this api
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	client := connectMongoDB()
	platform.NewUserDB(client)
	platform.NewCommentsDB(client)
	platform.NewLikesDB(client)
	platform.NewPostDB(client)
	httpHandlers.InitAuthController(client)

	router := mux.NewRouter()

	router.HandleFunc("/register", httpHandlers.Register).Methods("POST")
	router.HandleFunc("/login", httpHandlers.Login).Methods("POST")
	router.HandleFunc("/post", httpHandlers.GetAllPosts).Methods("GET")
	router.HandleFunc("/comments", httpHandlers.GetCommentsByPostID).Methods("GET")
	router.HandleFunc("/likes/count", httpHandlers.GetLikeCountByPostID).Methods("GET")
	router.HandleFunc("/likes/users", httpHandlers.GetLikersByPostID).Methods("GET")
	router.HandleFunc("/user", httpHandlers.CreateUser).Methods("POST")
	router.HandleFunc("/like", httpHandlers.CreateLike).Methods("POST", "OPTIONS")
	router.HandleFunc("/like", httpHandlers.DeleteLike).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/comment", httpHandlers.CreateComment).Methods("POST", "OPTIONS")

	protected := router.PathPrefix("/").Subrouter()
	protected.Use(middleware.AuthMiddleware) // for authorisation

	protected.HandleFunc("/user", httpHandlers.GetAuthenticatedUser).Methods("GET", "OPTIONS")
	protected.HandleFunc("/user", httpHandlers.DeleteUser).Methods("DELETE", "OPTIONS")

	protected.HandleFunc("/comment", httpHandlers.DeleteComment).Methods("DELETE", "OPTIONS")
	protected.HandleFunc("/post", httpHandlers.UploadPost).Methods("POST", "OPTIONS")
	protected.HandleFunc("/post", httpHandlers.DeletePost).Methods("DELETE")
	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(router)))
}
