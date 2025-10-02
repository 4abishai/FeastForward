FROM mysql:8.3.0

# Set timezone (optional)
ENV TZ=Asia/Kolkata

# Copy init script to Docker's special entrypoint directory
COPY init.sql /docker-entrypoint-initdb.d/
