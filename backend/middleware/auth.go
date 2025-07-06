package middleware

import (
	"context"
	"fmt"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

var JwtKey = []byte("your-secret-key")

type contextKey string

const UserEmailKey = contextKey("userEmail")

func AuthMiddleware(next http.Handler) http.Handler {
	fmt.Println("getting hre1")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("getting hre2")
		auth := r.Header.Get("Authorization")
		if auth == "" {
			http.Error(w, "Missing auth header", http.StatusUnauthorized)
			return
		}

		parts := strings.Split(auth, "Bearer ")
		if len(parts) != 2 {
			http.Error(w, "Invalid auth format", http.StatusUnauthorized)
			return
		}

		tokenStr := parts[1]
		claims := jwt.MapClaims{}	
		fmt.Println("token string :", tokenStr)
		_, err := jwt.ParseWithClaims(tokenStr, claims, func(token *jwt.Token) (interface{}, error) {
			return JwtKey, nil
		})
		if err != nil {
			fmt.Println("sorry invalid" , err)
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		email := claims["email"].(string)
		fmt.Println("here is email", email)
		ctx := context.WithValue(r.Context(), UserEmailKey, email)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
