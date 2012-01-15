queryString=(key)->
	items=window.location.search.slice(1).split("&").each (item)->
		item.split "="
	items[key]

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
	clear:->
		@coffeeEditor.getSession().setValue ""
		return
	run:->
		coffeeCode=@coffeeEditor.getSession().getValue()
		CoffeeScript.eval coffeeCode
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
gist=
	init:->
		accessToken=@getAccessToken()
		if accessToken
			@_init accessToken
	_init:(accessToken)->
		console.log accessToken
	getAccessToken:->
		code=queryString "code"
		if code
			window.localStorage.setItem "access_token",code
		accessToken=window.localStorage.getItem("access_token") or code
	STATIC:
		clientId:'26ce4cc610c5d6b6a20a'
		authorizeUrl:'https://github.com/login/oauth/authorize'
		redirectUri:'http://island205.com/coffee/'
		clientSecret:'2e73952571d438607742882af0d2445f5597ef70'
	oauth:->
		S=@STATIC
		url="#{S.authorizeUrl}?client_id=#{S.clientId}&redirect_uri=#{S.redirectUri}"
		window.location.href=url
app=
	init:->
		@adjustSize()
		coffee.init()
		@bindCommands()
	adjustSize:->
		offset=getClientHeight()
		editors=$(".editors").css {height:offset.top-120+"px"}
		
		$("#coffee-editor,#script-editor").css {
			height:offset.top-120+"px"
			width:editors.width()/2+"px"
		}
	bindCommands:->
		$(".clear").click ->
			coffee.clear()
			return false
		$(".run").click ->
			coffee.run()
			return false
		$(".gist").click ->
			gist.oauth()
			
$ ->
	app.init()
	return
