
  _.extend(Backbone.View.prototype, {
    template: Mustache.to_html
  });

  $(function() {
    var Editors, File, FileView, Files, FilesView, editors, files, filesView;
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
    Editors = Backbone.View.extend({
      el: '#editors',
      events: {},
      initialize: function() {
        this.coffeeEditor = this.makeEditor("coffee-editor", "twilight", 'coffee');
        this.scriptEditor = this.makeEditor("script-editor", "twilight", 'javascript');
        this.historyScriptCode = "";
        return this._bind();
      },
      makeEditor: function(id, theme, mode) {
        var Mode, editor;
        editor = ace.edit(id);
        editor.setTheme("ace/theme/" + theme);
        Mode = (require("ace/mode/" + mode)).Mode;
        (editor.getSession()).setMode(new Mode);
        return editor;
      },
      edit: function(model) {
        this.model = model;
        return this.coffeeEditor.getSession().setValue(this.model.get("code"));
      },
      scriptCodeChange: function() {
        var editors;
        editors = this;
        if (!this.model) {
          editors.scriptEditor.getSession().setValue(editors.scriptCode);
          return;
        }
        return this.model.save({
          code: this.coffeeCode
        }, {
          success: function() {
            return editors.scriptEditor.getSession().setValue(editors.scriptCode);
          }
        });
      },
      _bind: function() {
        var editors;
        editors = this;
        this.coffeeEditor.getSession().on("change", function() {
          return editors._onCoffeeChanged();
        });
        return this;
      },
      _onCoffeeChanged: function() {
        this.coffeeCode = this.coffeeEditor.getSession().getValue();
        this.histroyScriptCode = this.scriptCode;
        try {
          this.scriptCode = CoffeeScript.compile(this.coffeeCode);
        } catch (e) {
          console.log(e.message);
          this.scriptCode = this.historyScriptCode;
        }
        if (this.scriptCode !== this.historyScriptCode) {
          return this.scriptCodeChange();
        }
      }
    });
    editors = new Editors;
    FileView = Backbone.View.extend({
      tagName: 'li',
      events: {
        "click .del": "delFile",
        "click .file": "editFile"
      },
      initialize: function() {
        return this.model.view = this;
      },
      render: function() {
        $(this.el).html(this.template($("#file-template").html(), this.model.toJSON()));
        return this;
      },
      editFile: function() {
        editors.edit(this.model);
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
          name: name,
          code: "# " + name + ".coffee\n# create time:" + (new Date)
        });
      }
    });
    return filesView = new FilesView();
  });
