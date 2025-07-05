package models

type User struct {
	ID    string `json:"id" bson:"_id,omitempty"`
	Name  string `json:"name" bson:"name"`
	Email string `json:"email" bson:"email"`
}

type Post struct {
	ID          string `json:"id" bson:"_id,omitempty"`
	Text        string `json:"text" bson:"text"`
	Data        string `json:"data" bson:"data"` // base64 encoded string
	CreatorInfo User   `json:"creatorInfo" bson:"creatorInfo"`
	Timestamp   int64  `json:"timestamp" json:"timestamp"`
}

type Comment struct {
	ID          string `json:"id" bson:"_id,omitempty"`
	PostID      string `json:"postID" bson:"postID"`
	Text        string `json:"text" bson:"text"`
	CreatorInfo User   `json:"creatorInfo" bson:"creatorInfo"`
}

type Likes struct {
	ID          string `json:"id" bson:"_id,omitempty"`
	PostID      string `json:"postID" bson:"postID"`
	CreatorInfo User   `json:"creatorInfo" bson:"creatorInfo"`
}
