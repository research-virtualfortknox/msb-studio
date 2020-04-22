# Build Docker Image:
#   docker build -t vfk_research/vfk_research_registry/vfk.msb/vfk.msb.studio:<new-version> .
# Run Docker Container:
#   docker run -d --restart always --name vfk.msb.studio -p 8080:80 vfk_research/vfk_research_registry/vfk.msb/vfk.msb.studio:<new-version>

# build stage
FROM node:lts-alpine as build-stage

# install git to get all node_module content
RUN apk add --update git

WORKDIR /app

# first install node_modules (take advantage of cached layers)
COPY package*.json ./
RUN npm install

# then copy project and build it
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]