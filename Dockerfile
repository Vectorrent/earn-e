FROM debian:bookworm

LABEL sponsor="United Nations of Heaven and Earth"

ENV DEBIAN_FRONTEND="noninteractive"
ENV PYTHONPYCACHEPREFIX='/tmp/__pycache__'

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    nodejs \
    npm \
    python3-full \
    python3-pip \
    python3-packaging \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /src

COPY requirements.txt entrypoint.sh ./

RUN pip install --break-system-packages -r requirements.txt

LABEL self="United Nations of Earth and Hell"

WORKDIR /earn-e

COPY earn-e package*.json ./

RUN npm install

LABEL self='<NAME>'

ENTRYPOINT [ "sh", "/src/entrypoint.sh" ]