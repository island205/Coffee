(function() {
  _.extend(Backbone.View.prototype, {
    template: Mustache.to_html
  });
  $(function() {
    var File, FileView, Files, FilesView, files, filesView;
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
      render: function() {
        $(this.el).html(this.template($("#file-template").html(), this.model.toJSON()));
        return this;
      },
      delFile: function() {
        var model;
        model = this.model;
        return this.model.destroy({
          success: function() {
            return model.collection.reset();
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
    return filesView = new FilesView();
  });
}).call(this);
