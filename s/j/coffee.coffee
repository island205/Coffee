_.extend Backbone.View::, {
	template:Mustache.to_html
}
$ ()->
	File=Backbone.Model.extend {
		default:{
			name:"newfile.coffee"
			date:new Date()
		}
		collection:files
	}

	Files=Backbone.Collection.extend {
		model:File
		localStorage:new Store "Coffees"
	}
	FileView=Backbone.View.extend {
		tagName:'li'
		events:{
			"click .del":"delFile"
		}
		render:()->
			$(@el).html @template $("#file-template").html(),@model.toJSON()
			@
		delFile:()->
			model=@model
			@model.destroy {success:()->
								model.collection.reset()
							}
	}
	files=new Files

	FilesView=Backbone.View.extend {
		el:$("#files-view")
		events:{
			"click #new-file":"newFile"
		}
		initialize:()->
			files.bind "reset",@resetFiles,@
			files.bind "add",@addFile,@
			files.fetch()
		resetFiles:()->
			files.each @addFile
		addFile:(file)->
			fileView=new FileView {model:file}
			(@$ "#files-panel").append fileView.render().el
		newFile:()->
			name=prompt("file name please!")
			files.create {
				name:name
			}
	}

	filesView=new FilesView()
