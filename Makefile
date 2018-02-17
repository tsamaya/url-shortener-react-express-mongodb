install:
	cd api && npm install && cd ..
	cd app && npm install && cd ..

build:
	cd app && npm run build && cd ..

start:
	docker-compose up --build

stop:
	docker-compose down

startdev:
	docker-compose -f docker-compose.dev.yml up --build

stopdev:
	docker-compose -f docker-compose.dev.yml down

clean:
	cd api && rm -rf node_modules/ && cd ..
	cd app && rm -rf node_modules/ build/ && cd ..
	cd data && rm -rf dd/ && cd ..
