# Use OpenJDK base image
FROM amazoncorretto:21

# Set working directory
WORKDIR /app/src

# Copy the jar file
COPY build/libs/donation-records-service-0.0.1-SNAPSHOT.jar app.jar

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
