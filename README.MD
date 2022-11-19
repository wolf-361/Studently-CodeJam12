# CodeJam 12

## How to run the project ?

To build the projet (Needed when docker files are updated) :

```bash
docker-compose build
```

To run the project (Live, so any changes in src folder will be seen immediatly) :

```bash
docker-compose up -d
```

-d stand for detached, so the docker processus will not be attached to the console

To access the database :

```bash
docker exec -it codejam_database_1 mysql -p
```

Then provide the database password
