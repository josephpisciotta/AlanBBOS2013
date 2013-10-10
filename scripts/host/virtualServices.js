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
		if(i === 0 || i === 32 || i === 64) // First memory location of each plock should be colored
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
