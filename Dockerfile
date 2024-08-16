# Use an official Nginx image as a base
FROM nginx:alpine

# Copy the static site files to the default Nginx public folder
COPY . /usr/share/nginx/html

# Expose port 80 for the web server
EXPOSE 80
