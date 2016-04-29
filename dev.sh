#!/usr/bin/env bash

docker build -t alternative-vote/ui .
docker run -ti --rm -p 8000:8000 -v `pwd`/src:/source alternative-vote/ui reactor