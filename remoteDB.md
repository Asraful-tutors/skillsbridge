# Steps taken to connect Skillsbridge (skillsbridge.eu) remotely to Postgres on Plesk

## Creating the Postgres database

- Logged in to Plesk and selected Databases from the left side menu (you may need to switch to Power User view if 'Databases' option is not visible in the menu).

- Selected happyhelpline.eu and added a new database (note that the database is not connected to happyhelpline site but a domain name had to be selected first in order to create a database in Plesk. It can be any domain name and the database does not have to be connected to it). 

### The db configuration is as follows:

- Add database name. In this case, 'skillsbridge_rmtdb'

- Database server - select Postgres

- Create a database user, in this case, 'skillsbridge_owner'.

- Add password for the user, in this case 'D4broNS7yhl0efFG8uQSfnmP'.

- Allowed remote access with system firewall rules.

## Enabling remote connection in Postgres (This has been done already but good to know)

- Select 'Tools & Settings' in Plesk left side menu.

- Under 'Tools & Resources', click on SSH Terminal.

- nano /var/lib/pgsql/data/postgresql.conf

- The following line was added to the end of the file to enable remote access:
```
listen_addresses = '*'
```

## Allowing remote access to Postgres from specific IP addresses

- A dig command in the terminal (dig skillsbridge.eu) reveals that skillsbridge uses the following IP addresses:
```
skillsbridge.eu.	100	IN	A	18.165.122.99
skillsbridge.eu.	100	IN	A	18.165.122.66
skillsbridge.eu.	100	IN	A	18.165.122.58
skillsbridge.eu.	100	IN	A	18.165.122.9
```

- The following lines where added to allow connection from those ip addresses only
```
host samerole all 18.165.122.99/32 md5
host samerole all 18.165.122.66/32 md5
host samerole all 18.165.122.58/32 md5
host samerole all 18.165.122.9/32 md5
```

- service postgresql restart

- By now, you would be able to connect remotely to the database but the connection would not use SSL and it is necessary to implement SSL for security. To address this, a temporary domain name (admiring-colden.95.217-200-167.plesk.page) was created in Plesk and the generated letsencrypt SSL cert and key for the domain are copied to Postgres data folder.

### Copying the SSL cert and key

- Open SSH Terminal again if it isn't open

- cd /usr/local/psa/var/modules/letsencrypt/etc/archive/admiring-colden.95-217-200-167.plesk.page

- cp fullchain1.pem and privkey1.pem /var/lib/pgsql/data

- cd /var/lib/pgsql/data

- chown postgres:postgres fullchain1.pem privkey1.pem

**Securing the key file**: Allow read access only to the user PostgreSQL runs as (typically `postgres`):

- chmod 400 privkey1.pem

### Configuring Postgres to use SSL

- cd /var/lib/pgsql/data

- nano posgresql.conf

- 'ssl-on' was added to the file

### Next the earlier lines are modified by changing 'host' to 'hostssl' as follows:

```
hostssl samerole all 18.165.122.99/32 md5
hostssl samerole all 18.165.122.66/32 md5
hostssl samerole all 18.165.122.58/32 md5
hostssl samerole all 18.165.122.9/32 md5

```

- service postgresql restart

You should now be able to connect to the database remotely with SSL.

To use the newly created database, the following line was added to skillsbridge dot env file to replace the previous db connection string (the one from Neon):

```
DATABASE_URL="postgresql://skillsbridge_owner:D4broNS7yhl0efFG8uQSfnmP@host.tutors.fi/skillsbridge_rmtdb"
```