## INIT

init: # Init the entire project ready to run
	make build
	make up
	echo "SELECT 'CREATE DATABASE gift_cards_development' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gift_cards_development')\gexec" | docker-compose exec -T postgres psql -U postgres
	make db-migrate

build: # Build the backend
	docker-compose build

up: # Start the backend
	docker-compose up -d --remove-orphans

stop: # Stop the backend
	docker-compose stop

restart: # Restart the backend
	make stop up

down: # make the backend down and remove any orphaned containers, and all volumes
	docker-compose down --volumes --remove-orphans --rmi=all

tail: # Tail the docker compose logs for the backend
	docker-compose logs -f --tail="100"

## DB

psql: # Exec into the psql container for debugging
	docker-compose exec postgres psql -U postgres

migration-%: # Generate migration commands
	docker-compose run knex yarn knex migrate:make $*

db-migrate: # Run all migrations to the latest timestamp
	docker-compose run knex yarn knex migrate:latest

db-rollback: # Rollback the last migration
	docker-compose run knex yarn knex migrate:rollback

db-drop: # drop the database
	echo "DROP DATABASE gift_cards_development;" | docker-compose exec -T postgres psql -U postgres

## scrape

scrape: # Run cypress for scraping data
	yarn cypress run

seed: # Seed data from rail scraping to the database
	GRAPHQL_URL=http://localhost:8080/v1/graphql HASURA_GRAPHQL_ADMIN_SECRET=myadminsecretkey yarn seed

## hasura

hasura: # Exec into the hasura container
	docker-compose exec hasura sh

URL = http://localhost:8080

get-schema:
	yarn gq $(URL)/v1/graphql -H 'X-Hasura-Admin-Secret: myadminsecretkey' --introspect > ./backend/hasura/schema.gql

get-metadata: # Get the meta data from the hasura container
	curl -H 'x-hasura-admin-secret: myadminsecretkey' \
	-d'{"type": "export_metadata", "args": {}}' $(URL)/v1/query \
	| jq . > ./hasura/metadata.json

set-metadata: # Set the metadata for the hasura container
	curl -H 'x-hasura-admin-secret: myadminsecretkey' \
	-d'{"type":"replace_metadata", "args":$(shell cat ./hasura/metadata.json)}' $(URL)/v1/query
