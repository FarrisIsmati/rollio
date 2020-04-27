# Base image
FROM ubuntu:18.04

# Required deb packages
RUN apt-get update \
    && apt-get install -y -q --no-install-recommends python3.6 python3-pip python3-wheel python3-setuptools

# upgrade pip.  we must from here forward run `python3 -m pip` vs `pip3`
# https://stackoverflow.com/a/51846054
RUN python3 -m pip install --upgrade pip

# We copy just the requirements.txt first to leverage Docker cache
COPY ./requirements.txt /app/requirements.txt

WORKDIR /app

RUN python3 -m pip install -r requirements.txt

COPY . /app

ENV LC_ALL=C.UTF-8
ENV LANG=C.UTF-8
ENV FLASK_APP=app.py

EXPOSE 5000

CMD [ "python3", "-m", "flask", "run", "--host=0.0.0.0" ]
