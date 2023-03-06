# Setup a new Postgres database

This setup a postgres database on Raspbian OS

## Create a db

`sudo -u postgres createdb estimator`

## Open your database to the network

`sudo nano /etc/postgresql/15/main/postgresql.conf`
change the following line : listen_addresses = '\*'

`sudo nano /etc/postgresql/15/main/pg_hba.conf`
host all all 0.0.0.0/0 scram-sha-256
ressource : https://www.netiq.com/documentation/identity-manager-47/setup_windows/data/connecting-to-a-remote-postgresql-database.html

## Manage users

### Protect your postgres user

1. Change the password : `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"`
2. Restart the server : `sudo service postgresql start`

### Create a dedicated user and grant permissions

`sudo -u postgres createuser guillaumep`

`sudo -u postgres psql estimator`
`postgres=# alter user guillaumep with encrypted password 'PASSWORD';`
`postgres=# grant all privileges on database estimator to guillaumep;`
`GRANT ALL ON SCHEMA public to guillaumep;`

ressource : https://medium.com/coding-blocks/creating-user-database-and-adding-access-on-postgresql-8bfcd2f4a91e

## Expose your local server to the world through your router

1. set a static ip four your raspi
   ressource : https://www.tomshardware.com/how-to/static-ip-raspberry-pi
2. use your router interface (http://mafreebox.freebox.fr/ for Freebox) to redirect the traffic to the static ip
3. Get you public ip thanks to the internet (what is my ip on Google)

## Build you database url :

`postgresql://username:password@public-ip-adress:5432/database-name`
