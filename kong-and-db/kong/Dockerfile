# syntax=docker/dockerfile:1.4
FROM --platform=linux/amd64 kong:3.9.0

# Switch to root to install packages
USER root

# Install curl and clean up
# RUN apt-get update && \
#     apt-get install -y curl && \
#     apt-get clean && \
#     rm -rf /var/lib/apt/lists/*

# Switch back to kong user
USER kong

# Set environment variables for Kong
ENV KONG_DATABASE="off" \
    KONG_DECLARATIVE_CONFIG="/usr/local/kong/declarative/kong.yml" \
    KONG_PROXY_ACCESS_LOG="/dev/stdout" \
    KONG_ADMIN_ACCESS_LOG="/dev/stdout" \
    KONG_PROXY_ERROR_LOG="/dev/stderr" \
    KONG_ADMIN_ERROR_LOG="/dev/stderr" \
    KONG_ADMIN_LISTEN="0.0.0.0:8001, 0.0.0.0:8444 ssl" \
    KONG_PROXY_LISTEN="0.0.0.0:8000, 0.0.0.0:8443 ssl" \
    KONG_LOG_LEVEL="debug" \
    # KONG_PLUGINS="bundled,custom-auth" \
    KONG_LUA_PACKAGE_PATH="/usr/local/share/lua/5.1/?.lua;;" \
    KONG_NGINX_WORKER_PROCESSES="1" \
    KONG_NGINX_USER="kong kong" \
    KONG_NGINX_DAEMON="off"

# Create required plugin and config directories
RUN mkdir -p /usr/local/kong/declarative

# Copy declarative Kong config
COPY --chown=kong:kong config/kong.yml /usr/local/kong/declarative/kong.yml

# Expose required ports
EXPOSE 8000 8443 8001 8444

# Start Kong
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["kong", "docker-start"]