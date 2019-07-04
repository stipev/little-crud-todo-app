echo "Configuring database..."

export PGPASSWORD='node_password'

dropdb -U node_user todoappdb
createdb -U node_user todoappdb

psql -U node_user todoappdb < ./bin/sql/user.sql

echo "database configured"

