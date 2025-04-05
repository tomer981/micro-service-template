# micro-service template
#### note: the arc need to be linux/amd64 or linux/arm64/v8 (tested on m1)
## requirement
### .env file
## RUN

```bash
chmod +x setup_env.sh
./setup_env.sh
docker compose up --build
```

## how to use
* https://www.postman.com/devloperstomer/workspace/whalo-test/collection/15797626-4c3b863d-16c5-4d8d-aaa3-e1a28e82e40b?action=share&creator=15797626


## Note:
* Used MongoDB and RabbitMq
* Future Scale and improvement:
    * Can add cache for leaderboard - repeated action, possible to run every X min and update caching
    * Can improve each system will connect to rabbitmq and be producer for new logs
    * Can add check if playerId exist before adding to score and leaderboard
    * Depend on the load maybe it will be good to add replica for mongodb for game score
    * add security to rabbitmq and mongo
    * Don't want to do overkill but i probably use joi library for schema validation and put in on routes/index.ts before the request as a middleware
