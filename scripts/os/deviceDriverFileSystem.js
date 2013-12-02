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

function krnCreate(filename){
	var dirKey = krnFindOpenDirectoryBlock();
	
	var filekey = krnFineOpenFileBlock();
	
	if (dirKey && fileKey && filename.length < 60){
		localStorage[dirKey] = krnSetValueOccupied(fileKey, filename);
		
		localStorage[fileKey] = krnSetValueOccupied(NULL_TSB, "");
		
		return true;
	}
	else{
		return "Error";
	}
	
}

function krnWrite(filename, data){
	var dirKey = krnGetDirectoryKeyFromName(filename);
}

function krnFindOpenFileBlock()
{
	var keyInt = 0;
	var valueArray;
	var occupiedBit;
	
	for(key in localStorage)
	{
		keyInt = parseKey(key);
		
		// Ensure we are iterating through file space only
		if( keyInt >= 100 && keyInt <= 300)
		{
			valueArray = JSON.parse(localStorage[key]);
			occupiedBit = valueArray[0];
			
			if( occupiedBit === 0 )
			{
				// TSB of the open file block
				return( key );
			}
		}
	}
	
	// If no file blocks are open return null
	return null;
}

function krnFindOpenDirectoryBlock()
{
	var keyInt = 0;
	var valueArray;
	var occupiedBit;
	
	for(key in localStorage)
	{
		keyInt = parseKey(key);
		
		if( keyInt >= 0 && keyInt <= 77)
		{
			valueArray = JSON.parse(localStorage[key]);
			occupiedBit = valueArray[0];
			
			if( occupiedBit === 0 )
			{
				// TSB of the open directory block
				return( key );
			}
		}
	}
	
	// If no directory blocks are open return null
	return null;
}

function krnSetValueOccupied(key, data)
{
	var valueArray = JSON.parse(key);
	
	var track  = valueArray[0];
	var sector = valueArray[1];
	var block  = valueArray[2];
	
	// Return a new value with an occupied status with an appropriate TSB pointer and data
	return ( systemValue(1, track, sector, block, data) );
}

function krnFillSpace(data){
	var bytes = data.length;
	
	for (var i = bytes; i < 60; i++){
		data += "-";
	}
	
	return data
}

function parseKey(key)
{
	// Strip key
	key = key.replace(/\]|\[|,/g, "");
	key = parseInt(key);
	
	return key;
}