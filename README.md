# monitor
Monitor tool for important processes
This script will check if the status endpoints of all the api are responding well.

## running
- Copy and setup `.env` if you didn't do before: `cp .env.example .env`
- Ensure a valid SMTP server is available and configured
      - you can easliy use mailhog and docker for that (browse http://localhots:8025 to see emails):
        `docker run --name smtp -p 1025:1025 -p 8025:8025 mailhog/mailhog`
- Ensure all the listed endpoints are running: `cat .env`
- Run it! `yarn start`

## how it works?
The code is located in the folder `/home/ubuntu/db-scripts/monitor` at `ubuntu@utils.2cnnct.com`
There is a cron job executing the script each 5 min.
