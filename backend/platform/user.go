package platform

import (
	"context"
	"go-image-api/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var userCollection *mongo.Collection

func NewUserDB(client *mongo.Client) {
	userCollection = client.Database("myDB").Collection("users")
}

func NewUser(ctx context.Context, user models.User) error {
	_, err := userCollection.InsertOne(ctx, user)
	if err != nil {
		return err
	}
	return nil
}

func DeleteUser(ctx context.Context, email string) error {
	_, err := userCollection.DeleteOne(ctx, bson.M{"email": email})
	if err != nil {
		return err
	}

	return nil
}

func UserByID(ctx context.Context, email string) (models.User, error) {
	var user models.User
	err := userCollection.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err != nil {
		return models.User{}, err
	}
	return user, nil
}
