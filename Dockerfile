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
     apt-get install -y curl netcat-traditional libmicrohttpd12 libjansson4 libsodium23 jq

ENV yq_sha256_amd64=c0eb42f6fbf928f0413422967983dcdf9806cc4dedc9394edc60c0dfb4a98529
ENV yq_sha256_arm64=4ab0b301059348d671fc1833e99903c1fecc7ca287ac131f72dca0eb9a6ba87a

ARG ARCH
ARG PLATFORM
RUN curl -sLo /usr/local/bin/yq https://github.com/mikefarah/yq/releases/download/v4.46.1/yq_linux_${PLATFORM}
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
