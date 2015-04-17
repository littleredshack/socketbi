# socketbi
I have been building BI solutions for years and never found one that works the way I do. So I decided to have a go at writing one.

SOCKETBI is a BI server and websocket client.  The two are totally separate code. 

The idea behind the server is to provide an open data server that provides one place to access multiple data sources. The server runs on nodeJS. Start it by running 'node app.js'. The server can be configured to connect to any number of datasources. These can be SQL, NoSQL or even a bit of custom javascript. The idea then is that a client connects to the server over a socket and receives a list of available datasource names. 

Datasource names can either refer to something like a MySQL or Mongo database - the client can then specify a query to run against that datasource - or a name in the list could refer to a prebuilt query on the server. In this case the client just requests that datasource name and gets the data back. So lots of flexibility and control there.

The 'Panels' client that I provide here loads from a web server (I use apache running on Windows). It is written in angularjs and can be configured with multiple data panels to display data from any of the server's datasources. Data panels can be positioned anywhere on the workspace and can be styled to create dashboards in a freeform layout. They can even contain custom HTML and javascript so you can stick whatever you like in a Panel and build up a whole dashboard in a workspace. Then you can have multiple workspaces. 

Each Panel has a config screen available to style it and to define its content. The most basic configuration for a Panel typically involves selecting a datasource query from the list and choosing a renderer. The first renderer will just be a table display and then I will do one to display Highcharts in Panels. 

Panels will also be able to communicate with each other. So an event in one Panel can change a variable which another Panel is watching for. This means you could have filters being passed between Panels, you can filter a whole dashboard or provide drilldown functionality to display summary in one Panel and detail in another. etc. etc. 

From a design point of view my approach is to secure the data access through the socket api and then leave all the display stuff to be done on the client. So I can write clients for mobile or you can go ahead and write your own client using the socketbi library in this code.

The socket api from the server can be accessed from any client - that's what sockets are good at. Each api request is authenticated and the server can run on SSL. There is also authorisation functionality at the data level so you can configure which users/roles can access which datasources.

All good fun and pretty useful too I think.

Further details on project WIKI page

## Copyright & Licence (MIT License)

socketbi.js is © 2012-2013 Little Red Shack Limited

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
