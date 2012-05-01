(function() {
  var app, coffee, getClientHeight, gist, queryString;
  queryString = function(key, default_) {
    var qs, regex;
    if (default_ === null) {
      default_ = "";
    }
    key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
    qs = regex.exec(window.location.href);
    if (qs === null) {
      return default_;
    } else {
      return qs[1];
    }
  };
  getClientHeight = function() {
    var div;
    div = $("<div>").css({
      position: "fixed",
      bottom: 0,
      right: 0
    });
    div.appendTo($(document.body));
    return div.offset();
  };
  coffee = {
    cache: {},
    init: function() {
      this.coffeeEditor = this.makeEditor('coffee-editor', 'twilight', 'coffee');
      this.scriptEditor = this.makeEditor('script-editor', 'twilight', 'javascript');
      this.bindEvent();
    },
    clear: function() {
      this.coffeeEditor.getSession().setValue("");
    },
    run: function() {
      var coffeeCode;
      coffeeCode = this.coffeeEditor.getSession().getValue();
      CoffeeScript.eval(coffeeCode);
    },
    bindEvent: function() {
      var that;
      that = this;
      this.coffeeEditor.getSession().on('change', function() {
        var coffeeCode, scriptCode;
        coffeeCode = that.coffeeEditor.getSession().getValue();
        that.cache["hisScriptCode"] = scriptCode;
        try {
          scriptCode = CoffeeScript.compile(coffeeCode);
        } catch (e) {
          scriptCode = that.cache['hisScriptCode'];
        }
        if (scriptCode !== that.cache['hisScriptCode']) {
          that.refreshScript(scriptCode);
        }
      });
    },
    makeEditor: function(id, theme, mode) {
      var Mode, editor;
      editor = ace.edit(id);
      editor.setTheme("ace/theme/" + theme);
      Mode = (require("ace/mode/" + mode)).Mode;
      (editor.getSession()).setMode(new Mode);
      return editor;
    },
    refreshScript: function(code) {
      this.scriptEditor.getSession().setValue(code);
    }
  };
  gist = {
    accessToken: null,
    init: function() {
      this.accessToken = this.getAccessToken();
      if (this.accessToken) {
        return this._init(this.accessToken);
      } else {
        this.oauth();
        return console.log("oauth");
      }
    },
    _init: function() {
      return console.log(this.accessToken);
    },
    getAccessToken: function() {
      var accessToken;
      return accessToken = window.localStorage.getItem("access_token");
    },
    STATIC: {
      clientId: '26ce4cc610c5d6b6a20a',
      authorizeUrl: 'https://github.com/login/oauth/authorize',
      accessTokenUrl: "https://github.com/login/oauth/access_token",
      redirectUri: window.location.href,
      clientSecret: '2e73952571d438607742882af0d2445f5597ef70'
    },
    oauth: function() {
      var S, code, url;
      S = this.STATIC;
      code = queryString("code", null);
      debugger;
      if (code) {
        return $.ajax({
          url: "/getaccesstoken",
          method: "POST",
          data: {
            code: code,
            clientId: S.clientId,
            clientSecret: S.clientSecret
          },
          success: function(data) {
            return console.log(data);
          }
        });
      } else {
        url = "" + S.authorizeUrl + "?client_id=" + S.clientId + "&redirect_uri=" + S.redirectUri;
        return window.location.href = url;
      }
    }
  };
  app = {
    init: function() {
      this.adjustSize();
      coffee.init();
      gist.init();
      return this.bindCommands();
    },
    adjustSize: function() {
      var editors, offset;
      offset = getClientHeight();
      editors = $(".editors").css({
        height: offset.top - 120 + "px"
      });
      return $("#coffee-editor,#script-editor").css({
        height: offset.top - 120 + "px",
        width: editors.width() / 2 + "px"
      });
    },
    bindCommands: function() {
      $(".clear").click(function() {
        coffee.clear();
        return false;
      });
      $(".run").click(function() {
        coffee.run();
        return false;
      });
      return $(".gist").click(function() {
        return gist.oauth();
      });
    }
  };
  $(function() {
    app.init();
  });
}).call(this);
