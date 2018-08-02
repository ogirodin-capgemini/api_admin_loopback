FROM node

WORKDIR /app
COPY ./package.json /app/package.json
RUN npm i npm@latest -g
RUN npm install

RUN apt-get update -y
RUN apt-get install net-tools -y
RUN apt-get install ssh -y
RUN apt-get install vim -y
RUN npm install -g loopback-cli

COPY ./id_rsa.pub /root/.ssh/authorized_keys
COPY ./server /app/server
COPY ./client /app/client
COPY ./entrypoint.sh /app/entrypoint.sh

RUN sed -i -E 's/\#(AuthorizedKeysFile.*)/\1/g' /etc/ssh/sshd_config

CMD ["ln", "-snf", "/usr/share/zoneinfo/$TZ", "/etc/localtime"]
CMD ["echo", "$TZ", ">", "/etc/timezone"]

ENTRYPOINT ["bash", "entrypoint.sh"]
