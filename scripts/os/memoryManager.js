/*
	Memory Manager
*/

function MemoryManager()
{	
	this.memoryMap = {
		slotOne: 
		{
			open  : true,
			base  : 0,
			limit : 755,
			slotNumber : 1
		}
	};
	
	// Return the relocate val for the currently exec process 
	this.getRelocationValue = function()
	{	
		return _CurrentProcess.base;
	}
	
	this.getNextByte = function()
	{	
		// next byte in memory
		return _Memory[ (++_CPU.PC) + this.getRelocationValue() ];
	}
	
	// translate hex address to memory address
	this.translateAddress = function(hexAddress)
	{
		return parseInt( hexAddress, 16 ) + this.getRelocationValue();
	}
	
	// is the address valid
	this.isValidAddress = function(address)
	{
		// Get base and limit addresses
		var base = _CurrentProcess.base;
		var limit = _CurrentProcess.limit;
		// Make sure address is within bounds
		return ( address >= base && address <= limit );
	}
	
	// returns whether the slot is open
	this.openSlotExists = function()
	{
		var slotOneStatus   = this.memoryMap.slotOne.open;
	
		return ( slotOneStatus );
	}
	
	// return the slot if it is open
	this.getOpenSlot = function()
	{
		var internalName = "slotOne";
		if( _MemoryManager.memoryMap[internalName].open == true )
		{
			return( _MemoryManager.memoryMap[internalName] );
		}

		return null;
	}

	// Assigns the memory map's slot open properties to true/false 
	this.toggleSlotStatus = function()
	{

			var slotOneStatus   = this.memoryMap.slotOne.open;


			slotOneStatus = slotOneStatus ? false : true;
			this.memoryMap.slotOne.open = slotOneStatus; // Assign correct status 

	}
	
	// Return memory from slot one
	this.getMemoryContentFromSlot = function()
	{
		var base = -1;
		var limit = -1;
		var opcodeArray = [];
		

		base  = _MemoryManager.memoryMap.slotOne.base;
		limit = _MemoryManager.memoryMap.slotOne.limit;

		
		for(var i = base; i <= limit; i++)
		{
			opcodeArray.push(_Memory[i]);
		}
		
		return opcodeArray;
	}
	
	// clear slot one
	this.clearMemorySlot = function()
	{

		for( var i = _MemoryManager.memoryMap.slotOne.base; i < _MemoryManager.memoryMap.slotOne.limit; i++)
		{
			_Memory[i] = "00";
		}

		
	}
	
	// add byte to memory at position with offset if needed
	this.addByte = function(data, position, offset)
	{
		console.log(offset);
		_Memory[position + offset] = data;
	}
}