install:
	cd api && npm install && cd ..
	cd app && npm install && cd ..

build:	buildapp

buildapp:
	cd app && npm run build && cd ..

run:
	docker-compose up --build

stop:
	docker-compose down

clean:
	cd api && rm -rf node_modules/ && cd ..
	cd app && rm -rf node_modules/ build/ && cd ..
	cd db && rm -rf data/
