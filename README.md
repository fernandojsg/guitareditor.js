GUITK Editor
============

GUITK Editor is a Guitar Tablature Editor written in Javascript.
You can try it at http://fernandojsg.github.io/guitareditor.js/

![Screenshot](http://www.guitk.com/editor/gh/screenshot.png)

# Main features
* Import/Export from custom JSON file format
* Two rendering modes:
 * Traditional text (ASCII) (http://en.wikipedia.org/wiki/ASCII_tab)
 * "Pretty" print using HTML5 Canvas
* Many tablature symbols: hammen-on, pull-off, slide up/down, vibrato, rasgueado, etc.
* Include youtube videos, text or tabs sections
* Full of keyboard shortcuts
* Easy to integrate on your own webapp using an iframe

# Tutorial
* [Example of use (youtube)](http://www.youtube.com/watch?v=gqs-jm9423M&hd=1)

# Shortcuts for TAB section
* **cursors**: Move cursor
* **[0..9]**: Insert fret number at cursor
* **ins**: Insert empty cell
* **del**: Delete current cell
* **shift+ins**: Insert empty column
* **shift+del**: Delete column
* **s**: Slide
* **h**: Hammer on/Pull off
* **v**: Vibrato
* **g**: Accents
* **t**: Add/Modify text layer
* **p,m,i,a**: Select right hand finger
* **shift+[1,2,3,4]**: Select left hand finger

# API

You can easy integrate this editor in your website using an iframe:

`````html
<iframe 
      id="guitk-editor" 
      scrolling="no" 
      src="www.guitk.com/editor?api-mode=editor&show-song-info=false" 
      name="guitk-editor" 
      width="880" 
      height="500" 
      scrolling="auto" 
      frameborder="1">
</iframe>
`````

Once you have the iframe working, you need to communicate with the editor using ```postMessage``` and ```receiveMessage```:
* **postMessage**
 * *load-tabs*: We will send the tablature in JSON format and the editor will load and show it.
 * *get-tabs*: We ask for the current tablature in JSON format.
* **receiveMesasge**
 * *return-tabs*: It's the answer from the editor to the ```get-tabs``` message
 * *on-resize*: It's called everytime that the editor height is modified, in case that we want to modify the iframe size too.

## Load tabs in editor
To load a tablature in the editor we just need to send the JSON structure using the ```load-tabs``` message:

`````javascript
  var win = document.getElementById( "guitk-editor" ).contentWindow;
  win.postMessage( { action: "load-tabs", tabs: myTablatureInJSON }, "www.guitk.com/editor" );
`````

It's a good practise to wait until the editor is already loaded before send this message, so we could wait until the editor ´´´onload´´´ event is triggered to send our message:

`````javascript
  document.getElementById( "guitk-editor" ).onload= function() {
  
    var win = document.getElementById( "guitk-editor" ).contentWindow;
    win.postMessage( { action: "load-tabs", tabs: myTablatureInJSON }, "www.guitk.com/editor" );
    
  };
`````

## Retrieve tabs from the editor
Once we're done editing a tablature we would like to save it in our application. So in that case we could query the editor to send us the tablature in JSON format to do whatever we want in our webapp.
To do this we should send a ```get-tabs``` message:

First we define a callback that will receive the answer when we'll query the tabs:
`````javascript
  window.addEventListener("message", receiveMessage, false);  
  
  function receiveMessage(event)
  {
      if (event.data.action=="return-tabs") {
  
          var da a = JSON.parse( event.data.tabs );
          
      }
  }
`````

Now we can ask for the tablature and wait for the answer to the previous callback:
`````javascript
  win.postMessage({action:"get-tabs"}, "www.guitk.com/editor" );
`````

## Editor resize

Everytime the editor changes its height a message is sent to your web, so you could change the size of the iframe for example, or just ignored it.
We just need add a new handler to our ```receiveMessage``` function:

`````javascript
function receiveMessage( event )
{
    if ( event.data.action == "return-tabs" ) {
        // This will contains the tablature data in json format
        var data = event.data.tabs;
    }
    else if ( event.data.action == "on-resize" ) {
        // event.data.height will return the size in pixels of the editor height
        document.getElementById( "guitk-editor" ).height = ( 50 + event.data.height ) + "px";
    }
}
`````

# Used in
* www.flamencochords.com
