
# Take note that the image itself is already logged-in in the cloud CLI
FROM unnotechlottery/rico:latest as rico

FROM node:6.11.4

WORKDIR /usr/src/app
EXPOSE 8080

ARG AZURE_STORAGE_ACCOUNT
ARG AZURE_STORAGE_ACCESS_KEY
ARG ENV_CONTAINER
ARG CDN_PROFILE
ARG CDN_ENDPOINT
ARG HOST
ARG chatHost
ARG chatApi
ARG MAX_AGE
ARG HTTPS
ARG SITE_TITLE

# using multiple copies to continously keep the environment and avoid the maximum image layer error
COPY --from=rico /root /root

COPY --from=rico /usr/src/app/node_modules node_modules
COPY package.json package.json
RUN npm install

# To include everything
COPY . .

# Cannot be made into one line as it has a possibility that it will return a 'text file busy' making the shell script unexecutable
RUN chmod u+x cloud_deploy.sh
RUN ./cloud_deploy.sh

CMD npm run dev
