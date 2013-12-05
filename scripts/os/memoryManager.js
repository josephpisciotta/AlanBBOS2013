/*
	Memory Manager
*/

function MemoryManager()
{	
	this.memorySlots = {
		slotOne: 
		{
			available  : true,
			base  : 0,
			limit : 255,
			slotNumber : 1
		},
		slotTwo:
		{
			available  	: true,
			base  		: 256,
			limit 		: 511,
			slotNumber	: 2
		},
		slotThree:
		{
			available	: true,
			base		: 512,
			limit		: 767,
			slotNumber	: 3
		}
	};
	
	// Return the relocate val for the currently exec process 
	this.getRelocationValue = function()
	{	
		return _CurrentProcess.base;
	};
	
	this.getNextByte = function()
	{	
		// next byte in memory
		return _Memory[ (++_CPU.PC) + this.getRelocationValue() ];
	};
	
	// translate hex address to memory address
	this.translateAddress = function(hexAddress)
	{
		return parseInt( hexAddress, 16 ) + this.getRelocationValue();
	};
	
	// is the address valid
	this.isValidAddress = function(address)
	{
		// Get base and limit addresses
		var base = _CurrentProcess.base;
		var limit = _CurrentProcess.limit;
		// Make sure address is within bounds
		return ( address >= base && address <= limit );
	};
	
	// returns whether the slot is available
	this.openSlotExists = function()
	{
		return ( this.memorySlots.slotOne.available || this.memorySlots.slotTwo.available || this.memorySlots.slotThree.available );
	};
	
	// return the slot if it is open
	this.getOpenSlot = function()
	{
		var internalName = new Array("slotOne", "slotTwo", "slotThree");
		
		for (var i = 0; i < internalName.length; i++){
			if( this.memorySlots[internalName[i]].available === true )
			{
				return( this.memorySlots[internalName[i]] );
			}
		}
		

		return null;
	};

	// Assigns the memory map's slot open properties to true/false 
	this.toggleSlotStatus = function(slotNum)
	{
		// Make sure slotNum is between 1 and three
		if(slotNum <= 3 && slotNum){
			var slot_statuses = {
									"1":this.memorySlots.slotOne.available,
									"2":this.memorySlots.slotTwo.available,
									"3":this.memorySlots.slotThree.available
								}
						
			if(slot_statuses[""+slotNum+""] == true)
				slot_statuses[""+slotNum+""] = false;
			else
				slot_statuses[""+slotNum+""] = true;
				
				
			// Update all statuses	
			this.memorySlots.slotOne.available = slot_statuses["1"];
			this.memorySlots.slotTwo.available = slot_statuses["2"];
			this.memorySlots.slotThree.available = slot_statuses["3"];
		}
		else{
			
		}

	};
	
	// Return memory from slot
	this.getMemoryContentFromSlot = function(slotNum)
	{
		if(slotNum <= 3 && slotNum){
			var base = -1;
			var limit = -1;
			var opcodeArray = [];
			
			var internalName = {"1":"slotOne", "2":"slotTwo", "3":"slotThree"};
			
			base  = this.memorySlots[internalName[""+slotNum+""]].base;
			limit = this.memorySlots[internalName[""+slotNum+""]].limit;
	
			
			for(var i = base; i <= limit; i++)
			{
				opcodeArray.push(_Memory[i]);
			}
			
			return opcodeArray;
		}
		else{
			// Error
			return [];
		}
	};
	
	// roll in
	this.rollIn = function(process){
		var filename = "process " + process.pid.toString();
		
		var code = krnFileSystemDriver.read(filename);
		if (code !== false){
			var opcodes = code.split(/\s/);
		
			var memorySlot = _MemoryManager.getOpenSlot();
			
			process.base = memorySlot.base;
			process.limit = memorySlot.limit;
			process.slot = memorySlot.slotNumber;
			process.state = PROCESS_LOADED;
			
			this.toggleSlotStatus(process.slot);
			var opcode = "";
			
			console.log(process.base);
			for( var i = 0; i < opcodes.length; i++ ){
				opcode = opcodes[i];
				this.addByte(opcode.toUpperCase(), i, process);
			}
			
			krnFileSystemDriver.delete(filename);
		}
		else{
			delete _ProcessList[process.pid];
		}
		
	};
	
	// roll out
	this.rollOut = function(process){
		var filename = "process " + process.pid.toString();
		
		var opcodes = this.getMemoryContentFromSlot(process.slot);
		
		var code = opcodes.join(" ");
		
		krnFileSystemDriver.create(filename);
		krnFileSystemDriver.write(filename, code);
		
		this.toggleSlotStatus(process.slot);
		
		this.clearMemorySlot(process.slot);
		process.base = -1;
		process.limit = -1;
		process.slot = -1;
		process.state = DISK_PROCESS;
	}
	
	// clear slot 
	this.clearMemorySlot = function(slotNum)
	{
		var internalName = {"1":"slotOne", "2":"slotTwo", "3":"slotThree"};
		for( var i = this.memorySlots[internalName[""+slotNum+""]].base; i < this.memorySlots[internalName[""+slotNum+""]].limit; i++)
		{
			_Memory[i] = "00";
		}

		
	};
	
	// add byte to memory at position with offset if needed
	this.addByte = function(data, position, proc)
	{
			
		console.log(proc.base);
		_Memory[position + proc.base] = data;
	};
}