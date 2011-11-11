(function() {
  var coffeeChangeCb, coffeeCode, coffeeEditor, historyScriptCode, makeEditor, refreshScript, scriptCode, scriptEditor;
  coffeeEditor = null;
  scriptEditor = null;
  historyScriptCode = "";
  scriptCode = "";
  coffeeCode = "";
  $(function() {
    coffeeEditor = makeEditor('coffee-editor', 'twilight', 'coffee');
    scriptEditor = makeEditor('script-editor', 'twilight', 'javascript');
    return (coffeeEditor.getSession()).on('change', coffeeChangeCb);
  });
  makeEditor = function(id, theme, mode) {
    var Mode, editor;
    editor = ace.edit(id);
    editor.setTheme("ace/theme/" + theme);
    Mode = (require("ace/mode/" + mode)).Mode;
    (editor.getSession()).setMode(new Mode);
    return editor;
  };
  coffeeChangeCb = function() {
    coffeeCode = (coffeeEditor.getSession()).getValue();
    historyScriptCode = scriptCode;
    try {
      scriptCode = CoffeeScript.compile(coffeeCode);
    } catch (e) {
      scriptCode = historyScriptCode;
    }
    if (scriptCode !== historyScriptCode) {
      return refreshScript(scriptCode);
    }
  };
  refreshScript = function(scriptCode) {
    return (scriptEditor.getSession()).setValue(scriptCode);
  };
}).call(this);
