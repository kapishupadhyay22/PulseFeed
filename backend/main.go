package main

import (
	"context"
	"fmt"
	"go-image-api/controllers"
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
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")

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

	router := mux.NewRouter()
	router.HandleFunc("/user", controllers.CreateUser).Methods("POST")
	router.HandleFunc("/user", controllers.DeleteUser).Methods("DELETE")

	router.HandleFunc("/comment", controllers.CreateComment).Methods("POST")
	router.HandleFunc("/comment", controllers.DeleteComment).Methods("DELETE")

	router.HandleFunc("/like", controllers.CreateLike).Methods("POST")
	router.HandleFunc("/like", controllers.DeleteLike).Methods("DELETE")

	router.HandleFunc("/upload", controllers.UploadImage).Methods("POST")
	router.HandleFunc("/post", controllers.GetAllImages).Methods("GET")

	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(router)))
}
