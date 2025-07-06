package platform

import (
	"context"
	"go-image-api/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var commentCollection *mongo.Collection

func NewCommentsDB(client *mongo.Client) {
	commentCollection = client.Database("myDB").Collection("comments")
}

// contains functionality of commenting, deleting and getting all the comments on a post

func NewComment(ctx context.Context, comment models.Comment) error {
	_, err := commentCollection.InsertOne(ctx, comment)
	if err != nil {
		return err
	}
	return nil
}

func DeleteComment(ctx context.Context, id string) error {
	_, err := commentCollection.DeleteOne(ctx, bson.M{"_id": id})
	if err != nil {
		return err
	}
	return nil
}

func CommentsOnPost(ctx context.Context, postID string) ([]models.Comment, error) {
	cursor, err := commentCollection.Find(ctx, bson.M{"postID": postID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var comments []models.Comment
	for cursor.Next(ctx) {
		var comment models.Comment
		if err := cursor.Decode(&comment); err != nil {
			continue
		}
		comments = append(comments, comment)
	}
	return comments, nil
}
