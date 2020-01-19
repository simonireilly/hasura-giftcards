## INIT

ENV=development

init: # Init the entire project ready to run
	make build
	make up
	make db-setup ENV=development
	make db-setup ENV=test
	make db-migrate ENV=development
	make db-migrate ENV=test

test:
	make up ENV=test
	docker-compose run --rm knex yarn jest --detectOpenHandles || true

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

#
# DB
#
# Commands for running the postgres database with the connection adapter

psql: # Exec into the psql container for debugging
	docker-compose exec postgres psql -U postgres

migration-%: # Generate migration commands
	docker-compose run --rm knex yarn knex migrate:make $*

db-migrate: # Run all migrations to the latest timestamp
	docker-compose run --rm knex yarn knex migrate:latest --env $(ENV)

db-rollback: # Rollback the last migration
	docker-compose run --rm knex yarn knex migrate:rollback --env $(ENV)

db-setup: # setup the database
	echo "SELECT 'CREATE DATABASE gift_cards_$(ENV)' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'gift_cards_$(ENV)')\gexec" | docker-compose exec -T postgres psql -U postgres

db-drop: # drop the database
	echo "DROP DATABASE gift_cards_$(ENV);" | docker-compose exec -T postgres psql -U postgres

#
# Hasura - GraphQL
#
# Control Hasura using the metadata, make changes in the console, then export your changes to the yml file
# This commits as code our changes

hasura-export-metadata: ## Export your configured meta data to the hasra-migrations folder
	docker-compose exec \
		--workdir /tmp/hasura-migrations hasura hasura-cli metadata export
	docker-compose exec hasura \
		cp /tmp/hasura-migrations/migrations/metadata.yaml /hasura-migrations/
hasura-apply-metadata: ## Apply your configured meta data to the hasra cli
	docker-compose exec \
		--workdir /tmp/hasura-migrations hasura hasura-cli metadata apply
hasura-clear-metadata: ## Apply your configured meta data to the hasra cli
	docker-compose exec \
		--workdir /tmp/hasura-migrations hasura hasura-cli metadata clear
