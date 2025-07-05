package main

import (
	"context"
	"fmt"
	"go-image-api/controllers"
	"go-image-api/middleware"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func connectMongoDB() *mongo.Client {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}
	return client
}
func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Allow requests from all origins (for development)
		w.Header().Set("Access-Control-Allow-Origin", "*")
		// Allow specific headers
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		// Allow specific methods
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, DELETE")

		// Handle preflight OPTIONS request
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Continue to next handler
		next.ServeHTTP(w, r)
	})
}

func main() {
	client := connectMongoDB()
	controllers.InitUserController(client)
	controllers.InitCommentController(client)
	controllers.InitLikeController(client)
	controllers.InitImageController(client)
	controllers.InitAuthController(client)
	
	router := mux.NewRouter()
	protected := router.PathPrefix("/").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	router.HandleFunc("/register", controllers.Register).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")
	router.HandleFunc("/post", controllers.GetAllImages).Methods("GET")
	router.HandleFunc("/comments", controllers.GetCommentsByPostID).Methods("GET")
	router.HandleFunc("/likes/count", controllers.GetLikeCountByPostID).Methods("GET")
	router.HandleFunc("/likes/users", controllers.GetLikersByPostID).Methods("GET")
	router.HandleFunc("/user", controllers.CreateUser).Methods("POST")
	router.HandleFunc("/user", controllers.DeleteUser).Methods("DELETE")

	protected.HandleFunc("/user", controllers.CreateUser).Methods("POST", "OPTIONS")
	protected.HandleFunc("/user", controllers.DeleteUser).Methods("DELETE", "OPTIONS")

	protected.HandleFunc("/comment", controllers.CreateComment).Methods("POST", "OPTIONS")
	protected.HandleFunc("/comment", controllers.DeleteComment).Methods("DELETE", "OPTIONS")

	protected.HandleFunc("/like", controllers.CreateLike).Methods("POST", "OPTIONS")
	protected.HandleFunc("/like", controllers.DeleteLike).Methods("DELETE", "OPTIONS")

	protected.HandleFunc("/upload", controllers.UploadImage).Methods("POST", "OPTIONS")

	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(router)))
}
