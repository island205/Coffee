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
		initialize:()->
			@model.view=@
		render:()->
			$(@el).html @template $("#file-template").html(),@model.toJSON()
			@
		delFile:()->
			model=@model
			@model.destroy {success:()->
						$(model.view.el).remove()
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

	Editors=Backbone.View.extend {
		el:'#ditors'
		events:{
			"click #btn-save":"saveFile"
		}
		initialize:()->
			@coffeeEditor=@makeEditor "coffee-editor","twilight",'coffee'
			@scriptEditor=@makeEditor "script-editor","twilight",'javascript'
			@
		makeEditor:(id,theme,mode)->
			editor=ace.edit id
			editor.setTheme "ace/theme/#{theme}"
			Mode=(require "ace/mode/#{mode}").Mode
			(editor.getSession()).setMode new Mode
			editor
		saveFile:()->
			console.log "save file"
	}

	edtiors=new Editors
