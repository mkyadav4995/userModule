global.server = new Hapi.server({
    host: process.env.NODE_HOST,
    port: process.env.NODE_PORT,
    routes: {
      cors: {
        origin: ['*'],
        headers: ['accept', 'authorization', 'Content-Type', 'If-None-Match',"language","utcoffset"],
        additionalHeaders: ["Access-Control-Allow-Origin","Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type"]
      }
    }
  });
init=async()=>{
    const swaggerOptions = {
        info: {
          title: process.env.SITE_NAME,
          version:process.env.API_VERSION
        },
        securityDefinitions: {
          Bearer: {
            type: "apiKey",
            name: "Authorization",
            in: "header"
          }
        },
        grouping: "tags",
        sortEndpoints: "ordered",
        consumes: ["application/json"],
        produces: ["application/json"]
      };
      
      await server.register([auth_jwt],{
        once: true  //critical so that you don't re-init your plugins
      });

      await server.auth.strategy("jwt", "jwt", {
        complete: true,
        key: Common.privateKey, // secret key
        validate: Common.validateToken, // validate function defined in common function for timestamp check
        verifyOptions: { algorithms: ["HS256"] } // algorithm
      });
      server.auth.default("jwt");
      console.log({info : server.info})

      await server.register(
          [
              Inert,
              Vision,
              {plugin: HapiSwagger,options: swaggerOptions},
              {plugin: i18n,options: {locales: process.env.VALID_LANGUANGE_CODES.split(','),directory: __dirname + "/locales",languageHeaderField: "language",defaultLocale:process.env.DEFAULT_LANGUANGE_CODE}},
              {plugin: Routes,options:{routes_dir: Path.join(__dirname, 'routes')}},
              {plugin: Cron,options: { jobs: Constants.CRON }}
            ], {
              once: true  //critical so that you don't re-init your plugins
            }
      );
  server.route({

    method: "GET",

    path: "/",

    options:

    {

      auth: false,

      handler: (request, h) => {

        return h.response({ success: true, message: request.i18n.__("API ENDPOINT FOR ONLINE SCHULE"), responseData: {} }).code(200);

      }

    }

  });
      await Models.sequelize.authenticate();
      Models.sequelize.sync().then(() => {
        server.start(() => {
          console.log("Server initialized at :", server.info.uri)
        });
      });
}