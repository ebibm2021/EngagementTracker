FROM postgres:14-alpine

# Create the needed temp file before the first postgreSQL execution

# RUN mkdir temp

# Create group and user

# RUN groupadd postgres
# RUN useradd postgres --group postgres

# Set user rights to allow the on-root-postgres-user 
# to access the temp folder

# RUN chown -R postgres:postgres /temp
# RUN chmod 777 /temp

# Change to non-root privilege

USER postgres
RUN echo "host all  all    0.0.0.0/0  md5" >> /var/lib/postgresql/data/pg_hba.conf
RUN echo "listen_addresses='*'" >> /var/lib/postgresql/data/postgresql.conf
EXPOSE 5432
