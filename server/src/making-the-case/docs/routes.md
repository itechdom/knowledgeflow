router                                                                                                         
 ├── query                                         *                                                           
 ├── expressInit                                   *                                                           
 ├── session                                       *                                                           
 ├── <anonymous>                                   *                                                           
 ├── urlencodedParser                              *                                                           
 ├── jsonParser                                    *                                                           
 ├── logger                                        *                                                           
 ├── router                                        *                                                           
 │   router                                                                                                    
 │    ├── initialize                               *                                                           
 │    ├── authenticate                             *                                                           
 │    ├── bound dispatch                           /auth/resend-email-confirmation                             POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /auth/email-confirmation                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /auth/change-password                                       POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /auth/forgot-password-confirm                               GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /auth/forgot-password                                       POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /auth/register                                              POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /auth                                                       POST
 │    │    ├── authenticate                        /                                                           POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /error                                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /auth/google                                                GET
 │    │    └── authenticate                        /                                                           GET
 │    │   
 │    ├── bound dispatch                           /auth/google/callback                                       GET
 │    │    ├── authenticate                        /                                                           GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /auth/twitter                                               GET
 │    │    └── authenticate                        /                                                           GET
 │    │   
 │    ├── bound dispatch                           /auth/twitter/callback                                      GET
 │    │    ├── authenticate                        /                                                           GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /auth/facebook                                              GET
 │    │    └── authenticate                        /                                                           GET
 │    │   
 │    └── bound dispatch                           /auth/facebook/callback                                     GET
 │         ├── authenticate                        /                                                           GET
 │         └── <anonymous>                         /                                                           GET
 │        
 │   
 ├── router                                        /^\/jwt\/?(?=\/|$)/                                         
 │   router                                                                                                    
 │    ├── <anonymous>                              *                                                           
 │    └── bound dispatch                           /                                                           POST
 │         └── <anonymous>                         /                                                           POST
 │        
 │   
 ├── router                                        /^\/users\/?(?=\/|$)/                                       
 │   router                                                                                                    
 │    ├── <anonymous>                              *                                                           
 │    └── bound dispatch                           /                                                           POST
 │         └── <anonymous>                         /                                                           POST
 │        
 │   
 ├── router                                        /^\/users\/?(?=\/|$)/                                       
 │   router                                                                                                    
 │    ├── bound dispatch                           /                                                           GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /paginate/:page/:limit                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /create                                                     POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    ├── bound dispatch                           /:_id                                                       DELETE
 │    │    └── <anonymous>                         /                                                           DELETE
 │    │   
 │    └── bound dispatch                           /search                                                     POST
 │         └── <anonymous>                         /                                                           POST
 │        
 │   
 ├── router                                        /^\/users\/?(?=\/|$)/                                       
 │   router                                                                                                    
 │    ├── serveStatic                              /^\/file\/?(?=\/|$)/                                        
 │    ├── bound dispatch                           /media                                                      POST
 │    │    ├── multerMiddleware                    /                                                           POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /gallery                                                    POST
 │    │    ├── multerMiddleware                    /                                                           POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /media                                                      PUT
 │    │    ├── multerMiddleware                    /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    ├── bound dispatch                           /gallery                                                    PUT
 │    │    ├── multerMiddleware                    /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    └── bound dispatch                           /remove/media                                               DELETE
 │         └── <anonymous>                         /                                                           DELETE
 │        
 │   
 ├── router                                        /^\/users\/?(?=\/|$)/                                       
 │   router                                                                                                    
 │    ├── bound dispatch                           /count                                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/:field                                               GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/time/:period                                         GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/:field/time/:period                                  GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /max/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /max/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /min/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /min/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /sum/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /sum/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /average/:field                                             GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /average/:field/time/:period                                GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /distinct/:field                                            GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    └── bound dispatch                           /aggregate/:op/:fn/:fields                                  GET
 │         └── <anonymous>                         /                                                           GET
 │        
 │   
 ├── router                                        /^\/users\/?(?=\/|$)/                                       
 │   router                                                                                                    
 │    └── bound dispatch                           /forms                                                      GET
 │         └── <anonymous>                         /                                                           GET
 │        
 │   
 ├── router                                        /^\/hash\/?(?=\/|$)/                                        
 │   router                                                                                                    
 │    ├── bound dispatch                           /                                                           GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /paginate/:page/:limit                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /create                                                     POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    ├── bound dispatch                           /:_id                                                       DELETE
 │    │    └── <anonymous>                         /                                                           DELETE
 │    │   
 │    └── bound dispatch                           /search                                                     POST
 │         └── <anonymous>                         /                                                           POST
 │        
 │   
 ├── router                                        /^\/hash\/?(?=\/|$)/                                        
 │   router                                                                                                    
 │    ├── serveStatic                              /^\/file\/?(?=\/|$)/                                        
 │    ├── bound dispatch                           /media                                                      POST
 │    │    ├── multerMiddleware                    /                                                           POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /gallery                                                    POST
 │    │    ├── multerMiddleware                    /                                                           POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /media                                                      PUT
 │    │    ├── multerMiddleware                    /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    ├── bound dispatch                           /gallery                                                    PUT
 │    │    ├── multerMiddleware                    /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    └── bound dispatch                           /remove/media                                               DELETE
 │         └── <anonymous>                         /                                                           DELETE
 │        
 │   
 ├── router                                        /^\/hash\/?(?=\/|$)/                                        
 │   router                                                                                                    
 │    ├── bound dispatch                           /count                                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/:field                                               GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/time/:period                                         GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/:field/time/:period                                  GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /max/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /max/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /min/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /min/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /sum/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /sum/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /average/:field                                             GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /average/:field/time/:period                                GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /distinct/:field                                            GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    └── bound dispatch                           /aggregate/:op/:fn/:fields                                  GET
 │         └── <anonymous>                         /                                                           GET
 │        
 │   
 ├── router                                        /^\/hash\/?(?=\/|$)/                                        
 │   router                                                                                                    
 │    └── bound dispatch                           /forms                                                      GET
 │         └── <anonymous>                         /                                                           GET
 │        
 │   
 ├── router                                        /^\/contacts\/?(?=\/|$)/                                    
 │   router                                                                                                    
 │    ├── bound dispatch                           /                                                           GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /paginate/:page/:limit                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /create                                                     POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    ├── bound dispatch                           /:_id                                                       DELETE
 │    │    └── <anonymous>                         /                                                           DELETE
 │    │   
 │    └── bound dispatch                           /search                                                     POST
 │         └── <anonymous>                         /                                                           POST
 │        
 │   
 ├── router                                        /^\/contacts\/?(?=\/|$)/                                    
 │   router                                                                                                    
 │    ├── bound dispatch                           /count                                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/:field                                               GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/time/:period                                         GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /count/:field/time/:period                                  GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /max/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /max/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /min/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /min/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /sum/:field                                                 GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /sum/:field/time/:period                                    GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /average/:field                                             GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /average/:field/time/:period                                GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /distinct/:field                                            GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    └── bound dispatch                           /aggregate/:op/:fn/:fields                                  GET
 │         └── <anonymous>                         /                                                           GET
 │        
 │   
 ├── router                                        /^\/contacts\/?(?=\/|$)/                                    
 │   router                                                                                                    
 │    └── bound dispatch                           /forms                                                      GET
 │         └── <anonymous>                         /                                                           GET
 │        
 │   
 ├── router                                        /^\/acl\/?(?=\/|$)/                                         
 │   router                                                                                                    
 │    ├── <anonymous>                              *                                                           
 │    └── bound dispatch                           /                                                           POST
 │         └── <anonymous>                         /                                                           POST
 │        
 │   
 ├── router                                        /^\/acl\/?(?=\/|$)/                                         
 │   router                                                                                                    
 │    ├── bound dispatch                           /                                                           GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /paginate/:page/:limit                                      GET
 │    │    └── <anonymous>                         /                                                           GET
 │    │   
 │    ├── bound dispatch                           /create                                                     POST
 │    │    └── <anonymous>                         /                                                           POST
 │    │   
 │    ├── bound dispatch                           /                                                           PUT
 │    │    └── <anonymous>                         /                                                           PUT
 │    │   
 │    ├── bound dispatch                           /:_id                                                       DELETE
 │    │    └── <anonymous>                         /                                                           DELETE
 │    │   
 │    └── bound dispatch                           /search                                                     POST
 │         └── <anonymous>                         /                                                           POST
 │        
 │   
 ├── router                                        /^\/acl\/?(?=\/|$)/                                         
 │   router                                                                                                    
 │   
 └── <anonymous>                                   /^\/schemas\/?(?=\/|$)/                                     
