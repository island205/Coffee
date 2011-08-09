(function() {
  _.extend(Backbone.View.prototype, {
    template: Mustache.to_html
  });
  $(function() {
    var Editors, File, FileView, Files, FilesView, edtiors, files, filesView;
    File = Backbone.Model.extend({
      "default": {
        name: "newfile.coffee",
        date: new Date()
      },
      collection: files
    });
    Files = Backbone.Collection.extend({
      model: File,
      localStorage: new Store("Coffees")
    });
    FileView = Backbone.View.extend({
      tagName: 'li',
      events: {
        "click .del": "delFile"
      },
      initialize: function() {
        return this.model.view = this;
      },
      render: function() {
        $(this.el).html(this.template($("#file-template").html(), this.model.toJSON()));
        return this;
      },
      delFile: function() {
        var model;
        model = this.model;
        return this.model.destroy({
          success: function() {
            return $(model.view.el).remove();
          }
        });
      }
    });
    files = new Files;
    FilesView = Backbone.View.extend({
      el: $("#files-view"),
      events: {
        "click #new-file": "newFile"
      },
      initialize: function() {
        files.bind("reset", this.resetFiles, this);
        files.bind("add", this.addFile, this);
        return files.fetch();
      },
      resetFiles: function() {
        return files.each(this.addFile);
      },
      addFile: function(file) {
        var fileView;
        fileView = new FileView({
          model: file
        });
        return (this.$("#files-panel")).append(fileView.render().el);
      },
      newFile: function() {
        var name;
        name = prompt("file name please!");
        return files.create({
          name: name
        });
      }
    });
    filesView = new FilesView();
    Editors = Backbone.View.extend({
      el: '#ditors',
      events: {
        "click #btn-save": "saveFile"
      },
      initialize: function() {
        this.coffeeEditor = this.makeEditor("coffee-editor", "twilight", 'coffee');
        this.scriptEditor = this.makeEditor("script-editor", "twilight", 'javascript');
        return this;
      },
      makeEditor: function(id, theme, mode) {
        var Mode, editor;
        editor = ace.edit(id);
        editor.setTheme("ace/theme/" + theme);
        Mode = (require("ace/mode/" + mode)).Mode;
        (editor.getSession()).setMode(new Mode);
        return editor;
      },
      saveFile: function() {
        return console.log("save file");
      }
    });
    return edtiors = new Editors;
  });
}).call(this);
