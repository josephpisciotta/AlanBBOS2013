/*
	Scheduler.js
	
	Process scheduler
*/

function Scheduler()
{
	this.schedule = DEFAULT_SCHEDULE;
	this.setSchedule = function(input){
		if (input === RR){
			this.schedule = RR;
			_ReadyQueue.priorityQueue = false;
			return "Scheduling algorithm set to Round Robin.";
		}
		else if (input === FCFS){
			this.schedule = FCFS;
			_UsedQuantum = 256;
			_ReadyQueue.priorityQueue = false;
			return "Scheduling algorithm set to First Come, First Served.";
		}
		else if (input === PRIORITY){
			this.schedule = PRIORITY;
			_ReadyQueue.priorityQueue = true;
			return "Scheduling algorithm set to Priority.";
		}
		else{
			return "This command requires as an input either: rr, fcfs, or priority";
		}
	}
	this.contextSwitch = function(){
		if(_ReadyQueue.peek()){
			hostLog("\nContext Switch...\n","OS");
			
			// Mode = kernel
			_KernelInterruptQueue.enqueue( new Interrupt(ModeSwitch, [0]) );	
			
			// Update current PCB and add it back into the queue
			if(_CurrentProcess.state != PROCESS_TERMINATED){
				_CurrentProcess.update(PROCESS_READY, _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
				_ReadyQueue.enqueue(_CurrentProcess);
				hostLog("\nPut process: "+_CurrentProcess.pid+" on end of Ready Queue.\n");
			}
			
			// Make the next process in ready queue the current process
			_CurrentProcess = _ReadyQueue.dequeue();
			hostLog("\nSwitched to process: "+_CurrentProcess.pid+".\nThis process now will begin running.");
			
			// roll in roll our to/from disk
			if( _CurrentProcess.slot === -1 )
			{	

				if( _ReadyQueue.size() != 0 && !_MemoryManager.openSlotExists() )
				{
					_MemoryManager.rollOut(_ReadyQueue.getItem(_ReadyQueue.size() - 1));
				}
				_MemoryManager.rollIn(_CurrentProcess);
			}

			// Update CPU
			_CPU.update(_CurrentProcess.pc, _CurrentProcess.acc, _CurrentProcess.x, _CurrentProcess.y, _CurrentProcess.z);
			
			
			hostLog("\nContext Switch...\n","OS");
			// Mode = user
			_KernelInterruptQueue.enqueue( new Interrupt(ModeSwitch, [1]) );	
			
		}	
		// Always reset Cycle count
		_CycleCount = 1; 
		
	}
}