FROM ruby:2.5.3
#FROM ruby:2.5.3-alpine3.8 #once things are working
RUN apt-get update -qq && apt-get install -y build-essential apt-utils nodejs libpq-dev wget curl apt-transport-https\
  vim
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y yarn

# Install node
RUN apt-get install -y python python-dev python-pip python-virtualenv
RUN rm -rf /var/lib/apt/lists/*

RUN \
  cd /tmp && \
  wget http://nodejs.org/dist/v10.0.0/node-v10.0.0-linux-x64.tar.gz && \
  tar xzf node-v10.0.0-linux-x64.tar.gz && \
  rm -f node-v10.0.0-linux-x64.tar.gz && \
  cd node-v* && \
  cp bin/node /usr/bin && \
  ./bin/npm install -g npm && \
  cd /tmp && \
  rm -rf /tmp/node-v*

# Install yarn
RUN apt-get update -qq && apt-get install -y build-essential apt-utils apt-transport-https
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y yarn

#RUN useradd -m app
#USER app

ENV APP_HOME /myapp
RUN mkdir -p $APP_HOME
WORKDIR $APP_HOME
#COPY --chown=app:app . $APP_HOME
COPY . $APP_HOME

RUN bundle install
RUN yarn install

CMD echo "Hello web"

CMD bundle exec rails s -p $PORT -b 0.0.0.0
