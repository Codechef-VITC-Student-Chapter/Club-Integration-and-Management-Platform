FROM golang:1.24.7-alpine3.22

WORKDIR /app

COPY go.* ./

RUN go mod download

COPY . .

RUN go build -o main ./cmd/main.go

EXPOSE 3000

CMD ["./main"]
