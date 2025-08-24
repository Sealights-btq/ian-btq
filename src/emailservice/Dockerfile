FROM --platform=linux/amd64 python:3.10.8-slim@sha256:49749648f4426b31b20fca55ad854caa55ff59dc604f2f76b57d814e0a47c181 as base
FROM base as builder

ARG SEALIGHTS_TOKEN=eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL1BST0QtUE9DLmF1dGguc2VhbGlnaHRzLmlvLyIsImp3dGlkIjoiUFJPRC1QT0MsbmVlZFRvUmVtb3ZlLEFQSUdXLWQ2Zjk2YzRkLTQ4NjYtNDVmNy1hMjhhLTI0MGZlYzdiNjAzMSwxNzU0NDg2OTQ0MDU4Iiwic3ViamVjdCI6ImlhbkBhZ2VudCIsImF1ZGllbmNlIjpbImFnZW50cyJdLCJ4LXNsLXJvbGUiOiJhZ2VudCIsIngtc2wtc2VydmVyIjoiaHR0cHM6Ly9pYW4uc2VhbGlnaHRzLmNvL2FwaSIsInNsX2ltcGVyX3N1YmplY3QiOiIiLCJpYXQiOjE3NTQ0ODY5NDR9.Io6Ho8SKzwyU3zHp3ymWjjDdeNCGZLbUBP7ric15kDUtYxIviQFpOeaaREqzl8dGYkIvvu2Qog-AhVzMEcId8lSTsxx9h2y97yDnXBcitQ7bLVQZY1oGg77De5S2TqFoiuc2S3GJji2SeZm9SoztSrsHjqG5nUnrEka4n3higx1uZKoKVeNkQFLxv_lnmcSQfq2Y-zjS1cKozo152ILfkoAgksAel9e6CfjelqSM3uBKmRbhUiNDVLWUb_78OyVE-1Oh7Fbb5af2KJklDoORXgDuW-WN8XZwCYgjiG968VLMozukVgJ6t_nThWPA0putmso6wiMZNdyFZHSw86yOx9rHX14_y2K2ZaPD1c63LQVFR_Fbh0Bvd1vRATz0g1pcgYVtsi3f6BEXK9YHSR0SWQ6fktEAoHSKh75fNONH-IcJMF2YQfRYKRF0oNtjAnih1GHs4za2-TrhSZ5wqbVY9xw0w1-cpiWArT0sJoC9uK5ugvoqsazyJYchhFoSEEKJKdYtFhmEX4RwBwg7yEM0g9ZdXCq_O1jTEe4hKrmJLIFqbhWZEMPJr7slny1oLp7QblQznnhnjX5Ns4bMPmDPFBbGq7svi8_Hv_ppjvYu3u4MZ2TSMS7lLOkkdo6ZWWtIoLA8f6YfK9LIF1qhy5Rek9zgekWnVSL5zBTEIa3PWcQ
ARG BRANCH=main
ARG BUILD_NAME=scmtest5
ENV SEALIGHTS_PYTHON=sealights-python-agent
#Don't forget to add git
RUN apt-get -qq update \
    && apt-get install -y --no-install-recommends \
        wget g++ git \
    && rm -rf /var/lib/apt/lists/*

# get packages
COPY requirements.txt .
RUN pip install -r requirements.txt
#Installing sealights (Not a url)
RUN pip install ${SEALIGHTS_PYTHON}

FROM builder
# Enable unbuffered logging
ENV PYTHONUNBUFFERED=1
ENV ENABLE_PROFILER=1

COPY --from=builder /usr/local/lib/python3.10/ /usr/local/lib/python3.10/
WORKDIR /email_server
#Important to copy code here before running the scan, otherwise it won't scan the code
COPY ../../ .
#run config to get build session id
RUN sl-python config --appname emailservice --branchname ${BRANCH} --buildname ${BUILD_NAME} --workspacepath ./src/emailservice --token ${SEALIGHTS_TOKEN} --exclude "*grpc*"
#scan the code
RUN sl-python scan --scm git --scmProvider github --scmBaseUrl "https://github.com/Sealights-btq/ian-btq/" --token ${SEALIGHTS_TOKEN}
ENV SL_DEBUG=true

# Add the application
ENV PORT "8080"
EXPOSE 8080
#use sl-python to run the code
CMD sl-python run python email_server.py --labid ${SL_LAB_ID} --token ${SL_TOKEN}
