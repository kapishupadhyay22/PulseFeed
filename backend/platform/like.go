package platform

import (
	"context"
	"go-image-api/models"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var likeCollection *mongo.Collection

func NewLikesDB(client *mongo.Client) {
	likeCollection = client.Database("myDB").Collection("likes")
}

func Like(ctx context.Context, like models.Likes) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := likeCollection.InsertOne(ctx, like)
	if err != nil {
		return nil
	}
	return nil
}

func Unlike(ctx context.Context, postID string, email string) error {
	_, err := likeCollection.DeleteOne(ctx, bson.M{
		"postID":            postID,
		"creatorInfo.email": email,
	})
	if err != nil {
		return err
	}
	return nil
}

func LikerOfPost(ctx context.Context, postID string) ([]models.CreatedBy, error) {
	cursor, err := likeCollection.Find(ctx, bson.M{"postID": postID})
	if err != nil {
		return nil, err
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
	return likers, nil
}

func LikesOnPost(ctx context.Context, postID string) (int64, error) {
	count, err := likeCollection.CountDocuments(ctx, bson.M{"postID": postID})
	if err != nil {
		return 0, err
	}
	return count, nil
}
