package platform

import (
	"context"
	"go-image-api/models"
	"log"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

var postCollection *mongo.Collection

func NewPostDB(client *mongo.Client) {
	postCollection = client.Database("myDB").Collection("images")
}

func NewPost(ctx context.Context, post models.Post) (*mongo.InsertOneResult, error) {
	res, err := postCollection.InsertOne(ctx, post)
	if err != nil {
		// http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil, err
	}
	return res, nil

}

func GetAllPosts(ctx context.Context) ([]models.Post, error) {
	var posts []models.Post
	cursor, err := postCollection.Find(ctx, bson.M{})
	if err != nil {
		// http.Error(w, err.Error(), http.StatusInternalServerError)
		return nil, err
	}
	defer cursor.Close(ctx)

	for cursor.Next(ctx) {
		var post models.Post
		err := cursor.Decode(&post)
		if err != nil {
			log.Println("Decode error:", err)
			continue
		}
		posts = append(posts, post)
	}
	return posts, nil
}

func DeletePost(ctx context.Context, postID string, userEmail string) error {
	var post models.Post
	objID, err := primitive.ObjectIDFromHex(postID)
	if err != nil {
		// http.Error(w, "Invalid post ID", http.StatusBadRequest)
		return err
	}
	err = postCollection.FindOne(ctx, bson.M{"_id": objID}).Decode(&post)

	if err != nil || post.CreatorInfo.Email != userEmail {
		// http.Error(w, "Unauthorized or post not found", http.StatusUnauthorized)
		return err
	}

	_, err = postCollection.DeleteOne(ctx, bson.M{"_id": objID})
	if err != nil {
		// http.Error(w, err.Error(), http.StatusInternalServerError)
		return err
	}
	return nil
}
