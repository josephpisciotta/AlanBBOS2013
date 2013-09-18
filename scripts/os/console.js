/* ------------
   Console.js

   Requires globals.js

   The OS Console - stdIn and stdOut by default.
   Note: This is not the Shell.  The Shell is the "command line interface" (CLI) or interpreter for this console.
   ------------ */

function CLIconsole() {
    // Properties
    this.CurrentFont      = _DefaultFontFamily;
    this.CurrentFontSize  = _DefaultFontSize;
    this.CurrentXPosition = 0;
    this.CurrentYPosition = _DefaultFontSize;
    this.buffer = "";
    this.listIndex = 0;
    this.firstUp = true;
    this.firstDown = true;
    
    // Methods
    this.init = function() {
       this.clearScreen();
       this.resetXY();
       this.initTaskbar();
    };
    
    this.initTaskbar = function() {
    	_Date = new Date();
		this.drawTaskbar();        

        // redraw section every second
        window.setInterval(function() {
            _Date = new Date();
            _Console.drawTaskbar();
        }, 500);
    };
    
    this.drawTaskbar = function() {
	    _TaskbarContext.fillStyle = "#BEC4C4";
        _TaskbarContext.fillRect(0,0,500,20);
        
        _TaskbarContext.fillStyle = "#000000";
        _TaskbarContext.font = "12px Helvetica";
        _TaskbarContext.fillText(_Date.toLocaleString(), 16, 16);
        _TaskbarContext.fillText(_SystemStatus, 200, 16);
    }

    this.clearScreen = function() {
       _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
    };
    
    this.clearLine = function() {
	    _DrawingContext.clearRect(0, this.CurrentYPosition - this.CurrentFontSize, _Canvas.width, _Canvas.height);
    }

    this.resetXY = function() {
       this.CurrentXPosition = 0;
       this.CurrentYPosition = this.CurrentFontSize + 20;
    };

    this.handleInput = function() {
       while (_KernelInputQueue.getSize() > 0)
       {
           // Get the next character from the kernel input queue.
           var chr = _KernelInputQueue.dequeue();
           // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
           if (chr == String.fromCharCode(13))  //     Enter key
           {
               // The enter key marks the end of a console command, so ...
               // ... tell the shell ...
               _OsShell.handleInput(this.buffer);
               this.listIndex = 0;
               this.firstUp = true;
               // ... and reset our buffer.
               this.buffer = "";
           }
           else if (chr == String.fromCharCode(8))
           {
           	   var newline = this.buffer.substring(0, this.buffer.length - 1);
           	   this.deleteText(newline);
	           this.buffer = newline;
           }
           // TODO: Write a case for Ctrl-C.
		   else if (chr == "UP"){
		   	if(this.listIndex <= _ShellList.length - 1){

		   		this.firstUp = false;
			   this.buffer = _ShellList[_ShellList.length - this.listIndex - 1];
			   this.clearLine();
			   this.CurrentXPosition = 0;
			   this.putText(_OsShell.promptStr);
			   this.putText(this.buffer);
			   this.listIndex++;
			   krnTrace(this.listIndex);
		   	}
		   	else{
			   	
		   	}
			   
		   }
           else
           {
               // This is a "normal" character, so ...
               // ... draw it on the screen...
               this.putText(chr);
               // ... and add it to our buffer.
               this.buffer += chr;
           }
       }
    };

    this.putText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.
       if (text !== "")
       {
           // Draw the text at the current X and Y coordinates.
           _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, this.CurrentXPosition, this.CurrentYPosition, text);
         // Move the current X position.
           var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, text);
           this.CurrentXPosition = this.CurrentXPosition + offset;
       }
    };
    this.deleteText = function(text) {
       // My first inclination here was to write two functions: putChar() and putString().
       // Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
       // between the two.  So rather than be like PHP and write two (or more) functions that
       // do the same thing, thereby encouraging confusion and decreasing readability, I
       // decided to write one function and use the term "text" to connote string or char.

           // Draw the text at the current X and Y coordinates.
           this.clearLine();
           _DrawingContext.drawText(this.CurrentFont, this.CurrentFontSize, 0, this.CurrentYPosition, _OsShell.promptStr + text);
         // Move the current X position.
           var offset = _DrawingContext.measureText(this.CurrentFont, this.CurrentFontSize, _OsShell.promptStr + text);
           this.CurrentXPosition = offset;
       
    };

    this.advanceLine = function() {
       	
       // TODO: Handle scrolling.
       	if ((this.CurrentYPosition + (this.CurrentFontSize * 4)) > _Canvas.height) {


            var buffer = _DrawingContext.getImageData(0, 0, _Canvas.width, _Canvas.height);
			this.clearScreen();
			
            // draw current canvas image on buffer
            _DrawingContext.putImageData(buffer, 0, -(_DefaultFontSize + _FontHeightMargin));
			this.CurrentXPosition = 0;
			_Date = new Date();
			_Console.drawTaskbar();
            
        }
        else{
	        this.CurrentXPosition = 0;
			this.CurrentYPosition += _DefaultFontSize + _FontHeightMargin;
        }
    };
}
