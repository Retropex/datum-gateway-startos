FROM debian:bookworm-slim AS build

RUN apt update && \
    apt-get install -y build-essential cmake curl libmicrohttpd-dev libjansson-dev \
                       libcurl4-openssl-dev libgcrypt20-dev libsodium-dev \
                       netcat-traditional pkg-config git

ARG ARCH
ARG PLATFORM

COPY /.git /parent_dir/.git

ADD ./datum_gateway /parent_dir/datum_gateway
WORKDIR /parent_dir/datum_gateway
RUN git status
RUN cmake . && make

FROM debian:bookworm-slim AS final

RUN apt update && \
     apt-get install -y curl netcat-traditional libmicrohttpd12 libjansson4 libsodium23

ENV yq_sha256_amd64=a2c097180dd884a8d50c956ee16a9cec070f30a7947cf4ebf87d5f36213e9ed7
ENV yq_sha256_arm64=0e7e1524f68d91b3ff9b089872d185940ab0fa020a5a9052046ef10547023156

ARG ARCH
ARG PLATFORM
RUN curl -sLo /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/v4.44.3/yq_linux_${PLATFORM}
RUN eval echo "\${yq_sha256_${PLATFORM}} */usr/local/bin/yq" | sha256sum -c
RUN chmod +x /usr/local/bin/yq

WORKDIR /root

COPY --from=build /parent_dir/datum_gateway/datum_gateway /usr/local/bin/datum_gateway

RUN chmod +x /usr/local/bin/datum_gateway
ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./check-stratum.sh /usr/local/bin/check-stratum.sh
RUN chmod a+x /usr/local/bin/check-stratum.sh
ADD ./check-bitcoin.sh /usr/local/bin/check-bitcoin.sh
RUN chmod a+x /usr/local/bin/check-bitcoin.sh
ADD ./check-dashboard.sh /usr/local/bin/check-dashboard.sh
RUN chmod a+x /usr/local/bin/check-dashboard.sh
ADD ./check-blocknotify.sh /usr/local/bin/check-blocknotify.sh
RUN chmod a+x /usr/local/bin/check-blocknotify.sh

WORKDIR /root
