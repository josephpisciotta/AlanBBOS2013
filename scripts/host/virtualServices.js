/*
	virtual hardware services
*/

function formatInHex(baseTenNumber, desiredLength)
{
	var hexValue = baseTenNumber.toString(16).toUpperCase();

	var floating = "";
	
	// Make desired length of floating
	for( var i = hexValue.length; i < desiredLength; i++)
	{
		floating += "0";
	}

	
	return ("$" + floating + hexValue);
}


function createMemoryTable()
{
    var memoryTable = document.getElementById("memTable");
    
    // Clear contents of the table
	while(memoryTable.hasChildNodes())
	{
		memoryTable.removeChild(memoryTable.firstChild);
	}

	// Draw contents
    var rows = [];
    var cells = [];

    for( var i = 0; i < 96; i++ )
    {
		if(i === 0) // First memory location of each block should be colored
		{
			rows[i] = memoryTable.insertRow(i);
			rows[i].style.backgroundColor = "silver";
		}
		else // Insert normal rows
		{
			rows[i] = memoryTable.insertRow(i);
		}
        
		// alloc num of cells per row
		cells[i] = [];

        for( var x = 0; x < 9; x++ )
        {
			// Create a header cell for the first column and a normal table cell for the other 8
            cells[i][x] = document.createElement(( x === 0 ) ? "th" : "td");
			// Fill cells in column 0 with memory addresses and the other 8 with memory content
			if( x === 0 )
				cells[i][x].innerHTML = formatInHex((i * 8), 4);
			else
				cells[i][x].innerHTML = "&nbsp;";
			// Add cells to the row
            rows[rows.length - 1].appendChild(cells[i][x]);
        }
    }
	
	// Assign to table
	_MemoryTableCells = cells;
}
function updateMemoryDisplay()
{
	// Table format is cells[row][col]
	
	var memoryIndex = 0;
	
	// Rows
	for( var row = 0; row < 96; row++ )
	{
		// Columns (start at 1 because column 0 is addresses)
		for( var col = 1; col < 9; col++)
		{
			// Fill in each columns with memory content
			_MemoryTableCells[row][col].innerHTML = _Memory[memoryIndex];
			memoryIndex++;
		}
	}
}

function clearCPU()
{
	_CPU.PC = 0;
	_CPU.Acc = 0;
	_CPU.Xreg = 0;
	_CPU.Yreg = 0;
	_CPU.Zflag = 0;
}

function updateCPUDisplay()
{
	var elems = document.getElementsByName("cpuData");
	elems[0].innerHTML = formatInHex(_CPU.PC, 4);
	elems[1].innerHTML = _CPU.Acc;
	elems[2].innerHTML = _CPU.Xreg;
	elems[3].innerHTML = _CPU.Yreg;
	elems[4].innerHTML = _CPU.Zflag;
}

function updateReadyQueueDisplay()
{
	var size = _ReadyQueue.getSize();
	clearReadyQueueDisplay();
	var process = null;
	if(size > 0 ){
		for(var i = 0; i < size; i++){
			var elems = document.getElementsByName("rq"+(i+1)+"Data");
			var state = "";
			switch (_ReadyQueue.q[i].state){
				case 0:
					state = "PROCESS_NEW";
					break;
				case 1:
					state = "PROCESS_LOADED";
					break;
				case 2:
					state = "PROCESS_READY";
					break;
				case 3:
					state = "PROCESS_RUNNING";
					break;
				case 4:
					state = "PROCESS_TERMINATED";
					break;
			}
			elems[0].innerHTML = _ReadyQueue.q[i].pid;
			elems[1].innerHTML = state;
			elems[2].innerHTML = formatInHex(_ReadyQueue.q[i].base, 4);
			elems[3].innerHTML = formatInHex(_ReadyQueue.q[i].limit, 4);
		}

	}
	
}
function clearReadyQueueDisplay()
{	
		for(var i = 0; i < 3; i++){
			var elems = document.getElementsByName("rq"+(i+1)+"Data");
			elems[0].innerHTML = "&nbsp;";
			elems[1].innerHTML = "&nbsp;";
			elems[2].innerHTML = "&nbsp;";
			elems[3].innerHTML = "&nbsp;";
		}

	
}

function updatePCBDisplay()
{
	var elems = document.getElementsByName("pcbData");
	var state = "";
	switch (_CurrentProcess.state){
		case 0:
			state = "PROCESS_NEW";
			break;
		case 1:
			state = "PROCESS_LOADED";
			break;
		case 2:
			state = "PROCESS_READY";
			break;
		case 3:
			state = "PROCESS_RUNNING";
			break;
		case 4:
			state = "PROCESS_TERMINATED";
			break;
	}
	elems[0].innerHTML = state;
	elems[1].innerHTML = _CurrentProcess.pid;
	elems[2].innerHTML = _CurrentProcess.base;
	elems[3].innerHTML = _CurrentProcess.limit;
	elems[4].innerHTML = _CurrentProcess.slot;
}

