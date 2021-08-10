import redis


client = redis.Redis(host="redis", port=6379, db=1)
