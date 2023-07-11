PWD = $(abspath ./)
CONTAINER_ID=$(shell docker ps -aqf "name=cosmos--8634de40cfbf4f33815d6b50dd5bfd80")

.DEFAULT_GOAL := all

.PHONY: run
run:
	@ echo ">>> Connect to Cosmos Chain " ; \
	npx ts-node connect.ts;

test:
	@ echo ">>> Connect to Cosmos Chain " ; \
	npx ts-node upload.ts;

token: 
	@ echo ">>> Connect to Cosmos Chain " ; \
	docker cp -a $(CONTAINER_ID):./root/.archway/config/genesis.json genesis/genesis.json ; \
	npx ts-node token.ts;

# Joker9045