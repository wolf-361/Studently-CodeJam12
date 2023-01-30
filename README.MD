# Studently

A web application developed in 36 hours during the "Codejam" hackathon organized by McGill University. The goal is to help students with organization, mental health and mutual aid between peers.

## Features

 * Todolist
 * Chat by university subjects (Socket IO)
 * Relaxation sounds (Streaming via HTTP)

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

## How to setup the database ?

Use the prevoius command to get the project running and then access the database. Then type "USE codejam;" to use the codejam database.

Then copy paste the content of the file "database.sql" into the terminal to create the tables.

You can check by typing "SHOW TABLES;" and you should see the tables like that :

```
+-------------------+
| Tables_in_codejam |
+-------------------+
| Account           |
| Event             |
| Todo              |
+-------------------+
```
