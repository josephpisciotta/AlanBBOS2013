/* ------------  
   CPU.js

   Requires global.js.
   
   Routines for the host CPU simulation, NOT for the OS itself.  
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   JavaScript in both the host and client environments.

   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

function Cpu() {
    this.PC    = 0;     // Program Counter
    this.Acc   = 0;     // Accumulator
    this.Xreg  = 0;     // X register
    this.Yreg  = 0;     // Y register
    this.Zflag = 0;     // Z-ero flag (Think of it as "isZero".)
    this.isExecuting = false;
    
    this.init = function() {
        this.PC    = 0;
        this.Acc   = 0;
        this.Xreg  = 0;
        this.Yreg  = 0;
        this.Zflag = 0;      
        this.isExecuting = false;  
    };
    
    this.cycle = function() {
    	this.execute( this.fetch() );
        krnTrace("CPU cycle");
        updateCPUDisplay();
        
    };
    this.fetch = function()
	{
		var relocationValue = _MemoryManager.getRelocationValue();
		return _Memory[this.PC + relocationValue];
	}
	
	// Execute instruction and necessary operands (if any)
	this.execute = function(opcode)
	{
		switch(opcode)
		{
			case "A9": 	
				loadAccImmediate(); 	
				break;
			case "AD": 	
				loadAccDirect();		
				break;
			case "8D":	
				storeAccInMemory();		
				break;
			case "6D":	
				addWithCarry();			
				break;
			case "A2":	
				loadXRegisterWithConstant();	
				break;
			case "AE":	
				loadXRegisterFromMemory();		
				break;
			case "A0":	
				loadYRegisterWithConstant();	
				break;
			case "AC":	
				loadYRegisterFromMemory();		
				break;
			case "EA":	
				noOperation();			
				break;
			case "00": 	
				sysBreak();				
				break;
			case "EC":  
				compareXRegister();			
				break;
			case "D0":	
				branchXBytes();			
				break;
			case "EE":	
				incByteValue();			
				break;
			case "FF": 	
				sysCall();				
				break;
			default: 	
				sysBreak();				
				break;
		}
	}
}

// AD

function loadAccDirect()
{
	var byteOne = _MemoryManager.getNextByte();
	
	var byteTwo = _MemoryManager.getNextByte();
	
	// Concat hex addr
	var hexAddress = (byteTwo + byteOne);
	
	// hex to OS mem addr
	var decAddress = _MemoryManager.translateAddress(hexAddress);
	
	if( _MemoryManager.isValidAddress(decAddress) )
	{
		_CPU.Acc = parseInt( _Memory[decAddress] );
	}
	else
	{
		simBtnHaltOS_click();
		// Show error in log
		krnTrapError("\nRuntime Error: The requested address, " + hexAddress + ", is not in slot " + _CurrentProcess.slot + "\n\n");

	}
	
	_CPU.PC++;
}

// A9

function loadAccImmediate()
{

	_CPU.Acc = parseInt( _MemoryManager.getNextByte(), 16 );
	_CPU.PC++; 
}

// 8D 

function storeAccInMemory()
{
	var byteOne = _MemoryManager.getNextByte();
	var byteTwo = _MemoryManager.getNextByte();

	var hexAddress = (byteTwo + byteOne);

	var decAddress = _MemoryManager.translateAddress(hexAddress);

	if( _MemoryManager.isValidAddress(decAddress) )
	{
		var hexForm = _CPU.Acc.toString(16).toUpperCase();
		
		if( hexForm.length === 1)
			hexForm = "0" + hexForm;

		_Memory[decAddress] = hexForm;
	}
	else
	{
		simBtnHaltOS_click();

		krnTrapError("\nRuntime Error: The requested address, " + hexAddress + ", is not in slot " + _CurrentProcess.slot + "\n\n");

	}
	_CPU.PC++; 
}

// 6D

function addWithCarry()
{
	var byteOne = _MemoryManager.getNextByte();
	var byteTwo = _MemoryManager.getNextByte();

	var hexAddress = (byteTwo + byteOne);

	var decAddress = _MemoryManager.translateAddress(hexAddress);

	if( _MemoryManager.isValidAddress(decAddress) )
	{
		_CPU.Acc += parseInt( _Memory[decAddress], 16 );
	}
	else
	{
		simBtnHaltOS_click();

		krnTrapError("\nRuntime Error: The requested address, " + hexAddress + ", is not in slot " + _CurrentProcess.slot + "\n\n");

	}
	_CPU.PC++;
}

// A2

function loadXRegisterWithConstant()
{
	_CPU.Xreg = parseInt( _MemoryManager.getNextByte(), 16 );
	_CPU.PC++;
}

// AE

function loadXRegisterFromMemory()
{
	var byteOne = _MemoryManager.getNextByte();
	var byteTwo = _MemoryManager.getNextByte();

	var hexAddress = (byteTwo + byteOne);

	var decAddress = _MemoryManager.translateAddress(hexAddress);

	if( _MemoryManager.isValidAddress(decAddress) )
	{
		_CPU.Xreg = parseInt( _Memory[decAddress], 16 );
	}
	else
	{
		simBtnHaltOS_click();

		krnTrapError("\nRuntime Error: The requested address, " + hexAddress + ", is not in slot " + _CurrentProcess.slot + "\n\n");

	}
	_CPU.PC++;
}

// A0

function loadYRegisterWithConstant()
{
	_CPU.Yreg = _MemoryManager.getNextByte();
	_CPU.PC++;
}

// AC

function loadYRegisterFromMemory()
{
	var relocationValue = _MemoryManager.getRelocationValue();

	var byteOne = _MemoryManager.getNextByte();
	var byteTwo = _MemoryManager.getNextByte();

	var hexAddress = (byteTwo + byteOne);

	var decAddress = _MemoryManager.translateAddress(hexAddress);

	if( _MemoryManager.isValidAddress(decAddress) )
	{
		_CPU.Yreg = parseInt( _Memory[decAddress], 16 );
	}
	else
	{
		simBtnHaltOS_click();

		krnTrapError("\nRuntime Error: The requested address, " + hexAddress + ", is not in slot " + _CurrentProcess.slot + "\n\n");

	}

	_CPU.PC++;
}

// EA
function noOperation()
{
	_CPU.PC++;
}

// 00
function sysBreak()
{
	_CurrentProcess.update(PROCESS_TERMINATED, _CPU.PC, _CPU.Acc, _CPU.Xreg, _CPU.Yreg, _CPU.Zflag);
	_MemoryManager.toggleSlotStatus(_CurrentProcess.slot);
	
	_CPU.isExecuting = false;
}

// EC
function compareXRegister()
{
	var byteOne = _MemoryManager.getNextByte();
	var byteTwo = _MemoryManager.getNextByte();

	var hexAddress = (byteTwo + byteOne);

	var decAddress = _MemoryManager.translateAddress(hexAddress);

	if( _MemoryManager.isValidAddress(decAddress) )
	{
		_CPU.Zflag = ( parseInt( _Memory[decAddress] ) === _CPU.Xreg ) ? 1 : 0;
	}
	else
	{
		simBtnHaltOS_click();

		krnTrapError("\nRuntime Error: The requested address, " + hexAddress + ", is not in slot " + _CurrentProcess.slot + "\n\n");

	}
	_CPU.PC++;
}

// D0
function branchXBytes()
{
	if( _CPU.Zflag === 0 )
	{	
		var branchValue = parseInt( _MemoryManager.getNextByte(), 16 );
		
		_CPU.PC += branchValue;
		
		if( _CPU.PC > 255 )
		{
			_CPU.PC -= 256;
		}
		
		_CPU.PC++;
	}
	else
	{
		_CPU.PC += 2;
	}
}

// EE
function incByteValue()
{
	var byteOne = _MemoryManager.getNextByte();
	var byteTwo = _MemoryManager.getNextByte();

	var hexAddress = (byteTwo + byteOne);

	var decAddress = _MemoryManager.translateAddress(hexAddress);

	if( _MemoryManager.isValidAddress(decAddress) )
	{	
		// Convert to decimal
		var decForm = parseInt( _Memory[decAddress], 16 );

		decForm++;

		var hexForm = decForm.toString(16).toUpperCase();

		if( hexForm.length === 1)
			hexForm = "0" + hexForm;
		_Memory[decAddress] = hexForm;
	}
	else
	{
		simBtnHaltOS_click();

		krnTrapError("\nRuntime Error: The requested address, " + hexAddress + ", is not in slot " + _CurrentProcess.slot + "\n\n");

	}
	_CPU.PC++;
}

// FF
function sysCall()
{
	if( _CPU.Xreg === 1 )
	{
		var value = parseInt( _CPU.Yreg ).toString();

		for( var i = 0; i < value.length; i++)
		{
			_StdIn.putText( value.charAt(i) );
		}
		_StdIn.advanceLine();


		_StdIn.putText(">");
	}
	else if( _CPU.Xreg === 2 )
	{
		var decAddress = _MemoryManager.translateAddress( _CPU.Yreg );
		var sentinelValue = "00";
		var currentByte = _Memory[decAddress];
		
		var keyCode = 0;
		var chr = "";
		
		while( currentByte != sentinelValue )
		{
			keyCode = parseInt( currentByte, 16 );
			
			chr = String.fromCharCode(keyCode);
			_StdIn.putText(chr);
			
			decAddress++;
			currentByte = _Memory[decAddress];
		}
		_StdIn.advanceLine();

		_StdIn.putText(">");
	}
	
	_CPU.PC++;
}



function getCurrentPID()
{
	return _PID++;
}