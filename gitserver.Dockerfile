# gitserver.Dockerfile
FROM node:alpine

# Install dependencies
RUN apk add --no-cache tini git \
    && npm install -g git-http-server \
    && adduser -D -g git git

USER git
WORKDIR /home/git

# Create bare repo
RUN git init --bare repository.git

# Start git server on port 3000
ENTRYPOINT ["tini", "--", "git-http-server", "-p", "3000", "/home/git"]
