/* ----------------------------------
   DeviceDriverFileSystem.js
   
   Requires deviceDriver.js
   
   The Kernel Filesystem Device Driver.
   ---------------------------------- */

DeviceDriverFileSystem.prototype = new DeviceDriver;  // "Inherit" from prototype DeviceDriver in deviceDriver.js.

function DeviceDriverFileSystem()                     // Add or override specific attributes and method pointers.
{
    // "subclass"-specific attributes.
    // this.buffer = "";    // TODO: Do we need this?
    // Override the base method pointers.
    this.driverEntry = krnFileSystemDriverEntry;
    this.isr = null;
    // "Constructor" code.
    this.format = krnFormat;
   
	this.create = krnCreate;
	/*
    this.write = krnWrite;
    this.read = krnRead;
    this.delete = krnDelete;
    this.listFiles = krnList;
*/
}

function krnFileSystemDriverEntry()
{
    // Initialization routine for this, the kernel-mode Keyboard Device Driver.
    this.status = "loaded";
    // More?
    krnFormat();
}

function systemKey(track,sect,block){
	return JSON.stringify([track,sect,block]);
}

function systemVal(occ,track,sect,block,data){
	return JSON.stringify([occ,track,sect,block,krnFillSpace(data)]);
}

function krnFormat(){
	try{
		localStorage.clear();
		
		var key = "";
		var val = "";
		
		for (var track = 0; track <= 3; track++){
			for(var sect = 0; sect <=7; sect++){
				for(var block = 0; block <= 7; block++){
					key = systemKey(track,sect,block);
					value = systemVal(0,-1,-1,-1,"");
					
					localStorage[key] = value;
				}
			}
		}
		
		localStorage[MBR_KEY] = systemVal(1,-1,-1,-1,"MBR");
		
		return true;
	}
	catch(e){
		return false;
	}
}

