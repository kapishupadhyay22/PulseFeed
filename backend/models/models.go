package models

type User struct {
	ID          string `json:"id" bson:"_id,omitempty"`
	Name        string `json:"name" bson:"name"`
	Email       string `json:"email" bson:"email"`
	Password    string `json:"password,omitempty" bson:"password"`
	Bio         string `json:"bio" bson:"bio"`
	JoiningDate string `json:"joining" bson:"joining"`
}

// to track the owner of posts, comments and likes
type CreatedBy struct {
	ID    string `json:"id" bson:"_id,omitempty"`
	Name  string `json:"name" bson:"name"`
	Email string `json:"email" bson:"email"`
}

// the posts (text + image)
type Post struct {
	ID          string    `json:"id" bson:"_id,omitempty"`
	Text        string    `json:"text" bson:"text"`
	Data        string    `json:"data" bson:"data"` // base64 encoded string
	CreatorInfo CreatedBy `json:"creatorInfo" bson:"creatorInfo"`
	Timestamp   int64     `json:"timestamp" json:"timestamp"`
}

// PostID defines which post has the comment
type Comment struct {
	ID          string    `json:"id" bson:"_id,omitempty"`
	PostID      string    `json:"postID" bson:"postID"`
	Text        string    `json:"text" bson:"text"`
	CreatorInfo CreatedBy `json:"creatorInfo" bson:"creatorInfo"`
}

type Likes struct {
	ID          string    `json:"id" bson:"_id,omitempty"`
	PostID      string    `json:"postID" bson:"postID"`
	CreatorInfo CreatedBy `json:"creatorInfo" bson:"creatorInfo"`
}
