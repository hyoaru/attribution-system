FROM nginx:1.27.3-alpine

RUN apk update && apk add --no-cache \
  curl \
  bash \
  vim \
  && mkdir -p \
    /var/log/nginx/client \
    /var/log/nginx/api/core \
    /var/log/nginx/api/ml \
    /var/log/nginx/infrastructures/pocketbase \
  && touch \
    /var/log/nginx/client/error.log /var/log/nginx/client/access.log \
    /var/log/nginx/api/core/error.log /var/log/nginx/api/core/access.log \
    /var/log/nginx/api/ml/error.log /var/log/nginx/api/ml/access.log \
    /var/log/nginx/infrastructures/pocketbase/error.log /var/log/nginx/infrastructures/pocketbase/access.log \
  && chown -R nginx:nginx /var/log/nginx

CMD ["nginx", "-g", "daemon off;"]
