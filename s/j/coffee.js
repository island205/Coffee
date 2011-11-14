(function() {
  var coffee;

  coffee = {
    cache: {},
    init: function() {
      this.coffeeEditor = this.makeEditor('coffee-editor', 'twilight', 'coffee');
      this.scriptEditor = this.makeEditor('script-editor', 'twilight', 'javascript');
      this.bindEvent();
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

  $(function() {
    coffee.init();
  });

}).call(this);
