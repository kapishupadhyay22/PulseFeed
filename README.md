# PulseFeed
An application for posts and comments



# To run this application follow the following steps 

## Navigate to the backend directory :

```
cd backend
```


## Spin up the mongoDB in Docker 

```
docker run -d --name mongodb -p 27017:27017 mongo:latest
```

In case if you do not have docker install it using the official resource as follows :

https://docs.docker.com/engine/install


## Install Golang (for running the backend)

### For Macos follows these commands :

1. Install Homebrew (if not already installed)

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. Install Go using Homebrew

```
brew install go
```

3. Add Go to your PATH 
Open the shell configuration zsh/bash etc (I am using zsh)
```
nano ~/.zshrc
```

add this to your shell profile 

```
export PATH="/opt/homebrew/bin:$PATH"
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

Then Save and Quit

Source your profile :

```
source ~/.zshrc
```

### For Linux (Ubuntu) follows these commands :

1. Download Latest Go Binary :
```
wget https://go.dev/dl/go1.22.3.linux-amd64.tar.gz
```
2. Extract and install Go :
```
sudo tar -C /usr/local -xzf go1.22.3.linux-amd64.tar.gz
```

3. Add Go to your PATH :
Open the shell configuration zsh/bash etc (I am using zsh)
```
nano ~/.zshrc
```

add this to your shell profile 

```
export PATH=$PATH:/usr/local/go/bin
export GOPATH=$HOME/go
export PATH=$PATH:$GOPATH/bin
```

Then Save and Quit

Source your profile :

```
source ~/.zshrc
```


## Install Packages and run the server 

Run the following command to install the dependencies:
```
go mod tidy
```

SPIN UP !! the server ..... 

```
go run main.go
```

# Run the frontend :

## Open a new terminal and navigate to the frontend directory :

```
cd frontend
```

## install NPM packages and run the frontend :

```
npm install
npm run dev
```

## Go to the browser and use the application !!

http://localhost:5173/