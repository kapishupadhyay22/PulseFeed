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
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
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
	controllers.InitUserController(client)
	controllers.InitCommentController(client)
	controllers.InitLikeController(client)
	controllers.InitImageController(client)
	controllers.InitAuthController(client)

	router := mux.NewRouter()

	router.HandleFunc("/register", controllers.Register).Methods("POST")
	router.HandleFunc("/login", controllers.Login).Methods("POST")
	router.HandleFunc("/post", controllers.GetAllImages).Methods("GET")
	router.HandleFunc("/comments", controllers.GetCommentsByPostID).Methods("GET")
	router.HandleFunc("/likes/count", controllers.GetLikeCountByPostID).Methods("GET")
	router.HandleFunc("/likes/users", controllers.GetLikersByPostID).Methods("GET")
	router.HandleFunc("/user", controllers.CreateUser).Methods("POST")
	router.HandleFunc("/like", controllers.CreateLike).Methods("POST", "OPTIONS")
	router.HandleFunc("/like", controllers.DeleteLike).Methods("DELETE", "OPTIONS")
	router.HandleFunc("/comment", controllers.CreateComment).Methods("POST", "OPTIONS")

	protected := router.PathPrefix("/").Subrouter()
	protected.Use(middleware.AuthMiddleware)

	protected.HandleFunc("/user", controllers.GetAuthenticatedUser).Methods("GET", "OPTIONS")
	protected.HandleFunc("/user", controllers.DeleteUser).Methods("DELETE", "OPTIONS")

	protected.HandleFunc("/comment", controllers.DeleteComment).Methods("DELETE", "OPTIONS")
	protected.HandleFunc("/post", controllers.UploadImage).Methods("POST", "OPTIONS")
	protected.HandleFunc("/post", controllers.DeletePost).Methods("DELETE")
	fmt.Println("Server started at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", enableCORS(router)))
}
