(function() {
  var app, coffee, getClientHeight;

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

  app = {
    init: function() {
      this.adjustSize();
      coffee.init();
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
      return $(".run").click(function() {
        coffee.run();
        return false;
      });
    }
  };

  $(function() {
    app.init();
  });

}).call(this);
