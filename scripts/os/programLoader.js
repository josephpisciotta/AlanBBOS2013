/*
	Program Loader
	
	May eventually refactor this into the kernel
*/

function loadProgram(code, priority)
{
	// input already validated
	
	// code = input
	
	// opcodes = array of opcodes
	var opcodes = code.split(/\s/);
	
	// Make sure memory slot exists
	if (_MemoryManager.openSlotExists())
	{
		var process = createProcessControlBlock(priority);
		
		_MemoryManager.clearMemorySlot(process.slot);
		
		var opcode = "";
		
		console.log(process.base);
		for( var i = 0; i < opcodes.length; i++ ){
			opcode = opcodes[i];
			_MemoryManager.addByte(opcode.toUpperCase(), i, process);
		}
		
		process.state = PROCESS_LOADED;
		
		_ProcessList[process.pid] = process;
		
		return {"pid":process.pid, "priority":process.priority};
		
	}
	else{
		return -1;
	}
}