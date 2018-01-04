#!/bin/bash
set -e  # to stop script when error occurs

# NPM commands and Azure cli scripts to deploy our static VueJS in a CDN

export root_container=\$root  # is '\' is to escape the special character
export static_container=static

# Needed to avoid piling up of data in image and Azure file storage
rm -rf dist

npm install
npm run build

# Take note that the format URL for the storage account is {storage-url}/{blob-container} and $root is the only way to avoid the "blob container" format and the other static holders need to be declared as blobs to maintain the folder structure
/root/bin/az storage container create --public-access blob --name $root_container
/root/bin/az storage container create --public-access blob --name $static_container


# Upload the changes
/root/bin/az storage blob delete-batch --source $static_container
/root/bin/az storage blob upload-batch --content-cache-control "public, max-age=$MAX_AGE" --destination $static_container --source dist/static
/root/bin/az storage blob upload --file dist/index.html --container-name $root_container  --name index.html


# To start purging the CDN
# CDN is cached and will not reflect any change until purged
# '/*' value in the content path indicates a 'Purge all'
/root/bin/az cdn endpoint purge --resource-group dockercloud-bd6da6d7 --name $CDN_ENDPOINT --profile-name $CDN_PROFILE --content-paths '/index.html'
