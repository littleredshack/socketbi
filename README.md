# socketbi
I have been building BI solutions for years and never found one that works the way I do. So I decided to have a go at writing one.

So SOCKETBI is a BI server and websocket client.  The two are totally separate (seperate?) code. 

The server runs on nodeJS. Start it by running 'node app.js'. It can be configured to connect to multiple datasources, SQL and NoSQL. The idea then is that a client connects to the server over a socket and receives a list of available datasources. The datasources can be either something like a MySQL or Mongo database for example. The client can then specify a query to run against that datasource. Or a datasource could be a preconfigured query that the client then just requests and gets the data back. So lots of flexibility and control there.

The idea here is that the socket api from the server can be accessed from any client. So you can go ahead and write your own and I can write others for mobile etc.

The 'Panels' client that I provide here loads from a web server (I use apache running on Windows). It is written in angularjs and can be configured with multiple data panels to display data from any of the server's datasources. Data panels can be positioned anywhere on the workspace and can be styled to create dashboards in a freeform layout. They can even contain custom HTML and javascript so you can stick whatever you like in a Panel and build up a whole dashboard in a workspace. Then you can have multiple workspaces.

Panels will also be able to communicate with each other. So an event in one Panel can trigger an action in another Panel. This means you could have filters being passed between Panels so you can filter a whole dashboard or provide drilldown functionality to display summary in one Panel and detail in another. etc. etc.

All good fun and pretty useful too I think.

Further details on project WIKI page

## Copyright & Licence (MIT License)

socketbi.js is © 2012-2013 Little Red Shack Limited

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
