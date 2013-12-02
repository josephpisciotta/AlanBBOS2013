/*
	Process Control Block
*/

function PCB (state, pid, pc, base, limit, slot, priority) 
{
	// Variables
	this.state  	= state;	
	this.pid		= pid;  	
	this.pc			= pc;		
	this.base		= base;  	
	this.limit		= limit;	
	this.slot		= slot;	  
	this.priority 	= priority;  
	
	// Registers
	this.acc = 0;
	this.x 	 = 0;
	this.y 	 = 0;
	this.z 	 = 0;
	
	// Update values of PCB
	this.update = function(state, pc, acc, x, y, z)
	{
		this.state = state;
		this.pc	   = pc;
		this.acc   = acc;
		this.x     = x;
		this.y     = y;
		this.z     = z;
	}
	
}

function createProcessControlBlock(pri)
{
	var state = PROCESS_NEW;
	var pid = getCurrentPID();
	var pc = 0;
	
	// get memory location
	var memorySlot = _MemoryManager.getOpenSlot();
	
	// deem memory taken
	_MemoryManager.toggleSlotStatus(memorySlot.slotNumber);
	var base = memorySlot.base;
	var limit = memorySlot.limit;
	var slot = memorySlot.slotNumber;
	
	//create new pcb 
	var pcb = new PCB(state,pid,pc,base,limit,slot,pri);
	
	// return new pcb
	return pcb;
}