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
	Editors=Backbone.View.extend {
		el:'#editors'
		events:{
		}
		initialize:()->
			@coffeeEditor=@makeEditor "coffee-editor","twilight",'coffee'
			@scriptEditor=@makeEditor "script-editor","twilight",'javascript'
			@historyScriptCode=""
			@_bind()
		makeEditor:(id,theme,mode)->
			editor=ace.edit id
			editor.setTheme "ace/theme/#{theme}"
			Mode=(require "ace/mode/#{mode}").Mode
			(editor.getSession()).setMode new Mode
			editor
		edit:(@model)->
			@coffeeEditor.getSession().setValue @model.get("code")
		scriptCodeChange:()->
			editors=@
			if !@model
				editors.scriptEditor.getSession().setValue editors.scriptCode
				return
			@model.save({code:@coffeeCode},{success:()->
				editors.scriptEditor.getSession().setValue editors.scriptCode
			})
		_bind:()->
			editors=@
			@coffeeEditor.getSession().on "change",()->
				editors._onCoffeeChanged()
			@
		_onCoffeeChanged:()->
			@coffeeCode=@coffeeEditor.getSession().getValue()
			@histroyScriptCode=@scriptCode
			try
				@scriptCode=CoffeeScript.compile @coffeeCode
			catch e
				console.log e.message
				@scriptCode=@historyScriptCode
			if @scriptCode isnt @historyScriptCode
				@scriptCodeChange()

	}

	editors=new Editors
	FileView=Backbone.View.extend {
		tagName:'li'
		events:{
			"click .del":"delFile"
			"click .file":"editFile"
		}
		initialize:()->
			@model.view=@
		render:()->
			$(@el).html @template $("#file-template").html(),@model.toJSON()
			@
		editFile:()->
			editors.edit @model
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
				code:"""# #{name}.coffee
						# create time:#{new Date}"""
			}
	}

	filesView=new FilesView()

