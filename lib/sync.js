var colors = require('colors');
var exec = require('ssh-exec');

module.exports = {

  /**
   * Executes script on remote server using various authentication methods.
   * @param  {string} script to be executed
   */
  exec: function(script) {
    if(script) {
      var auth = this.getAuthMethod();
      switch(auth) {
        case 0:
          console.log("No deployment servers are configured.".red);
          break;
        case 'rsa':
          this._execWithKey(script);
          break;
        case 'basic':
          this._execWithBasic(script);
          break;
      }
    }else{
      console.log("No script specified!".red);
    }
  },

  /**
   * Get the supported authentication method based on config.json in theme.
   * @return {string} the authentication method
   */
  getAuthMethod: function() {
    if(config.deploy && config.deploy.host) {
      if(config.deploy.username && config.deploy.password) {
        return 'basic';
      }else{
        return 'rsa';
      }
    }else{
      return 0;
    }
  },

  /**
   * Execute script with id_rsa authentication
   */
  _execWithKey: function(script) {
    var auth = config.deploy.user + "@" + config.deploy.host;
    exec(script, auth).pipe(process.stdout);
  },

  /**
   * Execute script with basic authentication
   */
  _execWithBasic: function(script) {
    var auth = {
      user: config.deploy.username,
      host: config.deploy.host,
      password: config.deploy.password
    };

    exec(script, auth).pipe(process.stdout);
  }

};
