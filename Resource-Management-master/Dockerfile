FROM devxci/mbtci-java17-node18

USER root

ARG DEBIAN_FRONTEND=noninteractive
# ARG TZ=Etc/UTC

RUN apt-get update && apt-get install -y gnupg2
RUN apt-get update && apt-get install -y procps


RUN apt-get install -y wget
RUN apt-get install -y unzip

# Set timezone:
# RUN ln -snf /usr/share/zoneinfo/$CONTAINER_TIMEZONE /etc/localtime && echo $CONTAINER_TIMEZONE > /etc/timezone

# Google Chrome
RUN echo "# Installing Google Chrome" \
    && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
	&& echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google-chrome.list \
	&& apt-get update -qqy \
	&& apt-get -qqy install google-chrome-stable \
	&& apt-get -qqy install google-chrome-unstable \
	&& rm /etc/apt/sources.list.d/google-chrome.list \
	&& rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
	&& sed -i 's/"$HERE\/chrome"/"$HERE\/chrome" --no-sandbox/g' /opt/google/chrome/google-chrome

# ChromeDriver
ARG CHROME_DRIVER_VERSION=2.40
RUN echo "# Installing ChromeDriver" \
    && wget --no-verbose -O /tmp/chromedriver_linux64.zip https://chromedriver.storage.googleapis.com/2.40/chromedriver_linux64.zip \
	&& rm -rf /opt/chromedriver \
	&& unzip /tmp/chromedriver_linux64.zip -d /opt \
	&& rm /tmp/chromedriver_linux64.zip \
	&& mv /opt/chromedriver /opt/chromedriver-$CHROME_DRIVER_VERSION \
	&& chmod 755 /opt/chromedriver-$CHROME_DRIVER_VERSION \
    && ln -fs /opt/chromedriver-$CHROME_DRIVER_VERSION /usr/bin/chromedriver

ENV CHROME_BIN=/usr/bin/google-chrome
