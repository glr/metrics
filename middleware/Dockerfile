FROM ruby:2.6.4

RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs postgresql-client yarn
# TODO: need to include this somewhere to add yarn
#    24  curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
#    25  echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
#    26  apt-get update
#    27  apt-get install yarn

RUN mkdir /middleware
WORKDIR /middleware

COPY Gemfile /middleware/Gemfile
COPY Gemfile.lock /middleware/Gemfile.lock

RUN gem update && gem install bundler && bundle install

COPY . /middleware