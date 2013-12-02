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
    this.write = krnWrite;
    this.read = krnRead;
    this.delete = krnDelete;
    this.listFiles = krnOccupiedDirectories;
    
    this.findOpenDirectoryBlock = krnFindOpenDirectoryBlock;
    this.findOpenFileBlock = krnFindOpenFileBlock;
    this.setValueOccupied = krnSetValueOccupied;
    this.getDirectoryKeyFromName = krnGetDirectoryKeyFromName;
    this.getLinkedFileBlocks = krnGetLinkedFileBlocks;
    this.fillEmptySpace = krnFillSpace;
    this.parseKey = parseKey;
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
	
	var fileKey = krnFindOpenFileBlock();
	
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
	console.log(dirKey + " " + filename + data);
	
	if (dirKey !== null){
		var valArray = JSON.parse(localStorage[dirKey]);
		
		var track = valArray[1];
		
		var sect = valArray[2];
		
		var block = valArray[3];
		
		var fileKey = systemKey(track,sect,block);
		
		if (data.length <= 60){
			localStorage[fileKey] = systemVal(1,-1,-1,-1,data);
		}
		else{
			var blocksNeeded = Math.ceil(data.length/60);
			
			var segments = [];
			for (var i = 0; i < blocksNeeded; i++){
				segments[i] = data.substring((i*60), ((i + 1) *60));
			}
			localStorage[fileKey] = krnSetValueOccupied(NULL_TSB, segments[0]);
			
			var nextFileKey = fileKey;
			
			var curBlockKey = "";
			
			for (var i = 1; i < segments.length; i++){
				curBlockKey = nextFileKey;
				
				nextFileKey = krnFindOpenFileBlock();
				
				localStorage[nextFileKey] = krnSetValueOccupied(NULL_TSB, segments[i]);
				krnLinkSegmentToParent(curBlockKey, nextFileKey);
			}
		}
		return true;
	}
	else{
		return false;
	}
}

function krnRead(filename){
	try{
		// Get the occupied directory that contains tkrnhe associated filename
		var directoryKey = krnGetDirectoryKeyFromName(filename);
		// Read and store the file block TSB from the directory block
		var valueArray = JSON.parse( localStorage[directoryKey] );
		var track = valueArray[1];
		var sector = valueArray[2];
		var block = valueArray[3];
		
		// Put the file key (TSB) in the correct format
		var parentFileKey = systemKey(track, sector, block);
		
		// See if there are any linked files to the origin file block
		var linkedFileArray = krnGetLinkedFileBlocks(parentFileKey);
		
		// Vars needed to pull the data from the file values
		var valueArray;
		var data;
		var dataSegmentsList = [];
		
		// Get the data of the files and put it in an array
		for(index in linkedFileArray)
		{
			valueArray = JSON.parse( localStorage[linkedFileArray[index]] );
			data = valueArray[4];
			// Trim the data of dashes (if any)
			if( data.indexOf("-") != -1 )
				data = data.substring(0, data.indexOf("-"));
			dataSegmentsList.push(data);
		}

		// Return the opcode string without commas
		return dataSegmentsList.toString().replace(/,/g, "");
	}
	catch(e){
		return false;
	}
}

function krnDelete(filename){
	try{
		var dirKey = krnGetDirectoryKeyFromName(filename);
		
		var valArray = JSON.parse(localStorage[dirKey]);
		
		var track = valArray[1];
		var sect = valArray[2];
		var block = valArray[3];
		
		localStorage[dirKey] = systemVal(0,-1,-1,-1,"");
		
		var parentKey = systemKey(track,sect,block);
		var linkedFiles = krnGetLinkedFileBlocks(parentKey);
	
		var segments = [];
		for (i in segments){
			krnFormatLineWithKey(segments[i]);
		}
		return true;
	}
	catch(e){
		return false;
	}
}

function krnFormatLineWithKey(key)
{
	localStorage[key] = filesystemVal(0, -1, -1, -1, "");
}

function krnOccupiedDirectories(){
	var keyInt = 0;
	var filenames = [];
	var valArray;
	var occupiedBit;
	var filename;
	for (key in localStorage){
		keyInt = parseKey(key);
		if(keyInt > 0 && keyInt <= 77){
			valArray = JSON.parse(localStorage[key]);
			occupiedBit = valArray[0];
			
			if(occupiedBit){
				filename = valArray[4];
				if(filename.indexOf("-") != -1)
					filename = filename.substring(0, filename.indexOf("-"));
					
				filenames.push(filename);
			}
		}
	}
	
	if(filenames.length>0){
		return filenames;
	}
	else{
		return null;
	}
		
}

function krnGetLinkedFileBlocks(parent){
	var files = [parent];
	
	var curKey = parent;
	
	while( curKey != NULL_TSB )
	{
		var parentVals = JSON.parse( localStorage[curKey] );
		var track = parentVals[1];
		var sect = parentVals[2];
		var block = parentVals[3];
		
		var child = systemKey(track, sect, block);
		
		if( child != NULL_TSB)
		{
			files.push(child);
		}
		
		// Set our current key as the key we most recently processed
		curKey = child;
	}
	
	return files;
}
function krnLinkSegmentToParent(parent, child){
	var valArray = JSON.parse(localStorage[parent]);
	var data = valArray[4];
	
	var childArray = JSON.parse(child);
	var track = childArray[0];
	var sect = childArray[1];
	var block = childArray[2];
	
	localStorage[parent] = systemVal(1,track,sect,block,data)
}

function krnGetDirectoryKeyFromName(filename){
	var keyInt = 0;
	var valArray;
	var occupied;
	var data;
	var storedFilename;
	
	for(key in localStorage)
	{
		keyInt = parseKey(key);
		
		if( keyInt >= 0 && keyInt <= 77 )
		{
			valArray = JSON.parse(localStorage[key]);
			occupied = valArray[0];
			data = valArray[4];

			if( occupied === 1 )
			{
				// Pull filename from the directory data
				storedFilename = data.substring(0, data.indexOf("-"));
				// If key is found with matching filename return that key
				if(filename === storedFilename)
					return key;
			}
		}
	}
	
	// Return null if directory section is fully open or filename doesnt exist
	return null;
}

function krnFindOpenFileBlock()
{
	var keyInt = 0;
	var valArray;
	var occupiedBit;
	
	for(key in localStorage)
	{
		keyInt = parseKey(key);
		
		if( keyInt >= 100 && keyInt <= 300)
		{
			valArray = JSON.parse(localStorage[key]);
			occupiedBit = valArray[0];
			
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
	var valArray;
	var occupiedBit;
	
	for(key in localStorage)
	{
		keyInt = parseKey(key);
		
		if( keyInt >= 0 && keyInt <= 77)
		{
			valArray = JSON.parse(localStorage[key]);
			occupiedBit = valArray[0];
			
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
	var valArray = JSON.parse(key);
	
	var track  = valArray[0];
	var sector = valArray[1];
	var block  = valArray[2];
	
	// Return a new value with an occupied status with an appropriate TSB pointer and data
	return ( systemVal(1, track, sector, block, data) );
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