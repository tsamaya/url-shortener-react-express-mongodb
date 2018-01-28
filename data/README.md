### docker standalone
From the project's root folder :
docker run --rm -ti --name mongo -p 27017:27017 -v `pwd`/data/db/:/data/db mongo
