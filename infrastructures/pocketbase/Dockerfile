FROM alpine:latest

# Install necessary packages
RUN apk add --no-cache \
  unzip \
  ca-certificates \
  bash

# Set working directory
WORKDIR /pb

# Copy the rest of the application files
COPY ./pocketbase /pb/
COPY ./pb_migrations /pb/pb_migrations

# Ensure the correct ownership and permissions
RUN chown -R root:root ./* && chmod +x ./pocketbase

ENV PATH="/pb:$PATH"

# Run the superuser creation command
RUN pocketbase superuser upsert admin@email.com adminpassword

# Start the PocketBase server
CMD ["pocketbase", "serve", "--http=0.0.0.0:8001"]
