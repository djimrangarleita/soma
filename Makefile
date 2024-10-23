# Variables
SERVER_REPO=https://github.com/djimrangarleita/soma.git
CLIENT_REPO=https://github.com/djimrangarleita/soma-client.git
SERVER_DIR=soma
CLIENT_DIR=soma-client

# Commands
DOCKER_CHECK := $(shell command -v docker 2> /dev/null)

.PHONY: all api-init client-init install-docker check-docker fixtures start

all: check-docker api-init client-init

# Clone and setup the API server
api-init:
	git clone $(SERVER_REPO)
	cp $(SERVER_DIR)/.env $(SERVER_DIR)/.env.local
	cd $(SERVER_DIR) && npm install
	make fixtures
	make start

# Clone and setup the client server
client-init:
	git clone $(CLIENT_REPO)
	cd $(CLIENT_DIR) && npm install

# Check if Docker is installed
check-docker:
	@if [ -z "$(DOCKER_CHECK)" ]; then \
		echo "Docker is not installed. Please install Docker or manually install Redis and PostgreSQL."; \
	else \
		./bin/start.sh; \
	fi

# Load fixture data
fixtures:
	cd $(SERVER_DIR) && npm run fixtures:load

# Start the API server
start:
	cd $(SERVER_DIR) && npm run start:dev
