FROM debian:bookworm

ENV DEBIAN_FRONTEND="noninteractive"

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    python3-full \
    python3-pip \
    python3-packaging \
    && rm -rf /var/lib/apt/lists/*

LABEL sponsor="United Nations of Heaven and Earth"

WORKDIR /src
# WORKDIR /i

COPY package*.json entrypoint.sh ./

RUN npm install

ENTRYPOINT [ "sh", "entrypoint.sh" ]