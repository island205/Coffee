getClientHeight=->
	div=$("<div>").css {
		position:"fixed",
		bottom:0,
		right:0	
	}
	div.appendTo $(document.body)
	return div.offset()
coffee=
	cache:{}
	init:->
		@coffeeEditor=@makeEditor 'coffee-editor','twilight','coffee'
		@scriptEditor=@makeEditor 'script-editor','twilight','javascript'
		@bindEvent()
		return
	bindEvent:->
		that=@
		@coffeeEditor.getSession().on 'change',->
			coffeeCode=that.coffeeEditor.getSession().getValue()
			that.cache["hisScriptCode"]=scriptCode
			try
				scriptCode=CoffeeScript.compile coffeeCode
			catch	e
				scriptCode=that.cache['hisScriptCode']
			if scriptCode isnt that.cache['hisScriptCode']
				that.refreshScript scriptCode
				return
		return
	makeEditor:(id,theme,mode)->
		editor=ace.edit id
		editor.setTheme "ace/theme/#{theme}"
		Mode= (require "ace/mode/#{mode}").Mode
		(editor.getSession()).setMode new Mode
		editor
	refreshScript:(code)->
		@scriptEditor.getSession().setValue code
		return
app=
	init:->
		@adjustSize()
		coffee.init()
	adjustSize:->
		offset=getClientHeight()
		editors=$(".editors").css {height:offset.top-120+"px"}
		
		$("#coffee-editor,#script-editor").css {
			height:offset.top-120+"px"
			width:editors.width()/2+"px"
		}
$ ->
	app.init()
	return
