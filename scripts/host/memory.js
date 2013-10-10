/*
	Memory Prototype
*/

function Memory()
{
	var memoryArray = new Array();

	// TOTAL_MEMORY should be 768
	for(i = 0; i < TOTAL_MEMORY; i++)
	{
		memoryArray[i] = "00";
	}
	
	return memoryArray;
}