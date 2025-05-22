FROM ubuntu:22.04

WORKDIR /

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \ 
    curl build-essential\
    python3 python3-pip python3-venv 

COPY  requirements.txt requirements.txt

RUN pip3 install --no-cache-dir -r requirements.txt

COPY ./home-lab /home-lab

EXPOSE 3000

CMD [ "python3", "/home-lab/app.py" ]
