function Scheduler()
{
	this.contextSwitch = function(){
		if(_ReadyQueue.peek()){
			hostLog("\nContext Switch...\n","OS");
			
			// Mode = kernel
			_Mode = 0;
			
			// Update current PCB and add it back into the queue
			if(_CurrentProcess.state != PROCESS_TERMINATED){
				_CurrentProcess.update(PROCESS_READY, _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
				_ReadyQueue.enqueue(_CurrentProcess);
			}
			
			// Make the next process in ready queue the current process
			_CurrentProcess = _ReadyQueue.dequeue();
			
			// Update CPU
			_CPU.update(_CurrentProcess.pc, _CurrentProcess.acc, _CurrentProcess.x, _CurrentProcess.y, _CurrentProcess.z);
			
			
			hostLog("\nContext Switch...\n","OS");
			// Mode = user
			_Mode = 1;
			
		}	
		// Always reset Cycle count
		_CycleCount = 1; 
		
	}
}