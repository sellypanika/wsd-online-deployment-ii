FROM denoland/deno:alpine-1.42.2
RUN apk add --no-cache bash curl
# Install Flyway
RUN curl -LO https://repo.flywaydb.org/flyway-commandline-8.5.0-linux-x64.tar.gz && \
    tar -xzf flyway-commandline-8.5.0-linux-x64.tar.gz && \
    mv flyway-8.5.0 /flyway && \
    ln -s /flyway/flyway /usr/local/bin/flyway

EXPOSE 7777

WORKDIR /app

COPY deps.js .

RUN deno cache deps.js

COPY . .
# Run Flyway migrations before starting the Deno application
# Assuming that environment variables like DATABASE_URL are set in Render
RUN flyway -url=${DATABASE_URL} migrate

CMD [ "run", "--allow-env", "--allow-net", "--allow-read", "--watch", "--unstable", "app.js" ] 