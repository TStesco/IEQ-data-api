# IEQ Data API

A Node.js Express app that provides a RESTful API for transforming, storing, and retrieving IEQ data. Part of the Atmena Indoor Environment Quality sensing and analysis system built by Andrew Gillies, Aayush Rajasekaran, Nathan Woltman, and Tom Stesco. Read more at https://tstesco.github.io/atmena-indoor-env-quality/.

### Setup

Clone the repo and install dependencies:

```sh
git clone https://github.com/TStesco/IEQ-data-api.git
cd IEQ-data-api
npm install
```

Install the Grunt CLI if it is not already installed on your machine:

```sh
npm install -g grunt-cli
```

**Note:** Mac/Linux users may need `sudo` when using `npm install`.

### Starting the Server

You can start the web server with the following command:

```sh
npm start
```

To make sure everything is working, navigate to http://localhost:3000 and check that you get a response that says "Cannot GET /" (this means that the server is working, but we haven't configured a response for the root URL `/`).


### Code

The best way to code is by opening the Sublime project (`data-api.sublime-project`) in Sublime Text 3. This way, the linters you installed when setting up Sublime will automatically lint your code as you type. If you don't want to use Sublime, you can lint your code by running the following command:

```sh
grunt lint
```

Some things to note about code style are:

+ All JavaScript files should have `'use strict';` near the top of the file
+ Indentation is 2 spaces
+ Strings are quoted using single quotes
+ Variable names should usually be descriptive (i.e. `length` is preferred over `len`)

### Live Development

While developing, you'll usually want to be navigating to URLs in your browser or using [Postman](https://chrome.google.com/webstore/detail/postman-rest-client/fdmmgilgnpjigdojojpjoooidkmcomcm?hl=en) to verify the functionality of the endpoints you are developing. You can use `npm start` to start the server and then test the endpoints you're working on. However, every time you update the server code, you'll need to restart the server for your changes to take effect. To automatically have the server restart when you change a file, start the server with:

```sh
grunt dev
```

### Test

To test everything (for now, linting and fast tests):

```sh
grunt
```

If you want to skip linting and just run the tests, you can do:

```sh
grunt test
```

> If tests are passing on your local machine but not the CI server, try running tests locally with `grunt test:slow` (since that's what the CI server runs, whereas tests on your local machine run `grunt test:fast` by default).
