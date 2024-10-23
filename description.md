# Initialization process

## API Server

1. Clone the server source at `git clone https://github.com/djimrangarleita/soma.git`
1. The server root name is `soma`
1. Copy the `.env` file into `.env.local` and provide the necessary values
1. Check if docker is installed and run `./bin/start.sh` to start a `redis` and `postgresql` container
1. If docker not install, you may need to install it or install redis and postgres on your host machine
1. Install the project dependencies with `npm install`
1. Run `npm run fixtures:load` to create fixture data and push them to the database
1. Run `npm run start:dev` to start the express server on port `3000`, the url is expected to be `localhost:3000/api` to allow the client to communicate with it;

## Client Server

1. In the same folder that contains the `soma` repository, clone the client repository with `git clone https://github.com/djimrangarleita/soma-client.git`
1. Run `npm install` to install the dependencies
1. It expects the server to be up and running on port `localhost:3000/api/*`
1. Go to your browser with the url provided in your terminal and enjoy
