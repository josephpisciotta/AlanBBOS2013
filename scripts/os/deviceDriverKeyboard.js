/* ----------------------------------
   DeviceDriverKeyboard.js
   
   Requires deviceDriver.js
   
   The Kernel Keyboard Device Driver.
   ---------------------------------- */

DeviceDriverKeyboard.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverKeyboard()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnKbdDriverEntry;
    this.isr = krnKbdDispatchKeyPress;
    // "Constructor" code.
}

function krnKbdDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
}

function krnKbdDispatchKeyPress(params)
{
    // Parse the params.    TODO: Check that they are valid and osTrapError if not.
    var keyCode = params[0];
    var isShifted = params[1];
    krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
    var chr = "";
    // Check to see if we even want to deal with the key that was pressed.
    if ( ((keyCode >= 65) && (keyCode <= 90)) ||   // A..Z
         ((keyCode >= 97) && (keyCode <= 123)) )   // a..z
    {
        // Determine the character we want to display.  
        // Assume it's lowercase...
        chr = String.fromCharCode(keyCode + 32);
        // ... then check the shift key and re-adjust if necessary.
        if (isShifted)
        {
            chr = String.fromCharCode(keyCode);
        }
        // TODO: Check for caps-lock and handle as shifted if so.
        _KernelInputQueue.enqueue(chr);        
    }
    else if (keyCode == 38){ // UP
	    _KernelInputQueue.enqueue("UP");
    }
    else if (keyCode == 40){ // DOWN
	    _KernelInputQueue.enqueue("DWN");
    }
    else if ((keyCode >= 48) && (keyCode <= 57)){
	    if (isShifted){
	    	var convCode = 0;
		    if (keyCode == 48)
		    	convCode = 41;
		    else if (keyCode == 49)
		    	convCode = 33;
		    else if (keyCode == 50)
		    	convCode = 64;
		    else if (keyCode == 51)
		    	convCode = 35;
		    else if (keyCode == 52)
		    	convCode = 36;
		    else if (keyCode == 53)
		    	convCode = 37;
		    else if (keyCode == 54)
		    	convCode = 94;
		    else if (keyCode == 55)
		    	convCode = 38;
		    else if (keyCode == 56)
		    	convCode = 42;
		    else
		    	convCode = 40;	
		    chr = String.fromCharCode(convCode);
			_KernelInputQueue.enqueue(chr); 	
	    }
	    else{
		    chr = String.fromCharCode(keyCode);
			_KernelInputQueue.enqueue(chr); 
	    }
    }
    else if (keyCode == 186){
    	if (isShifted){
	    	chr = String.fromCharCode(58);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(59);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }  
    else if (keyCode == 187){
    	if (isShifted){
	    	chr = String.fromCharCode(43);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(61);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }
    else if (keyCode == 188){
    	if (isShifted){
	    	chr = String.fromCharCode(60);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(44);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }
    else if (keyCode == 189){
    	if (isShifted){
	    	chr = String.fromCharCode(95);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(45);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }
    else if (keyCode == 190){
    	if (isShifted){
	    	chr = String.fromCharCode(62);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(46);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }
    else if (keyCode == 191){
    	if (isShifted){
	    	chr = String.fromCharCode(63);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(47);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }
    else if (keyCode == 192){
    	if (isShifted){
	    	chr = String.fromCharCode(126);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(96);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }
    else if (keyCode == 219){
    	if (isShifted){
	    	chr = String.fromCharCode(123);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(91);
			_KernelInputQueue.enqueue(chr); 
    	} 
    } 
    else if (keyCode == 220){
    	if (isShifted){
	    	chr = String.fromCharCode(124);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(92);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }
    else if (keyCode == 221){
    	if (isShifted){
	    	chr = String.fromCharCode(125);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(93);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }          
    else if (keyCode == 222){
    	if (isShifted){
	    	chr = String.fromCharCode(34);
			_KernelInputQueue.enqueue(chr);
    	}
    	else{
	    	chr = String.fromCharCode(39);
			_KernelInputQueue.enqueue(chr); 
    	} 
    }   
    else if ((keyCode == 32)                     ||   // space
               (keyCode == 13)|| (keyCode == 8) || (keyCode == 16) )                        // enter
    {
        chr = String.fromCharCode(keyCode);
        _KernelInputQueue.enqueue(chr); 
    }
    else
	{
        // throw an error but do not kill the OS
        krnTrapError("Invalid Key Entry");

    }
}
