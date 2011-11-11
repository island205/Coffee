coffeeEditor=null
scriptEditor=null
historyScriptCode=""
scriptCode=""
coffeeCode=""

$ ->
    coffeeEditor=makeEditor 'coffee-editor','twilight','coffee'
    scriptEditor=makeEditor 'script-editor','twilight','javascript'
    (coffeeEditor.getSession()).on 'change',coffeeChangeCb

makeEditor=(id,theme,mode)->
    editor=ace.edit id
    editor.setTheme "ace/theme/#{theme}"
    Mode= (require "ace/mode/#{mode}").Mode
    (editor.getSession()).setMode new Mode
    editor

coffeeChangeCb=->
    coffeeCode=(coffeeEditor.getSession()).getValue()
    historyScriptCode=scriptCode
    try
        scriptCode=CoffeeScript.compile coffeeCode
    catch e
        scriptCode=historyScriptCode
    if scriptCode isnt historyScriptCode
        refreshScript scriptCode

refreshScript=(scriptCode)->
    (scriptEditor.getSession()).setValue scriptCode

