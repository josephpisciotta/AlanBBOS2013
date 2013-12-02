/* ------------
   Shell.js
   
   The OS Shell - The "command line interface" (CLI) for the console.
   ------------ */

// TODO: Write a base class / prototype for system services and let Shell inherit from it.

function Shell() {
    // Properties
    this.promptStr   = ">";
    this.commandList = [];
    this.curses      = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
    this.apologies   = "[sorry]";
 
    // Methods
    this.init        = shellInit;
    this.putPrompt   = shellPutPrompt;
    this.handleInput = shellHandleInput;
    this.execute     = shellExecute;
}

function shellInit() {
    var sc = null;
    //
    // Load the command list.

    // ver
    sc = new ShellCommand();
    sc.command = "ver";
    sc.description = "- Displays the current version data.";
    sc.function = shellVer;
    this.commandList[this.commandList.length] = sc;
    
    // help
    sc = new ShellCommand();
    sc.command = "help";
    sc.description = "- This is the help command. Seek help.";
    sc.function = shellHelp;
    this.commandList[this.commandList.length] = sc;
    
    // shutdown
    sc = new ShellCommand();
    sc.command = "shutdown";
    sc.description = "- Shuts down the virtual OS but leaves the underlying hardware simulation running.";
    sc.function = shellShutdown;
    this.commandList[this.commandList.length] = sc;

    // cls
    sc = new ShellCommand();
    sc.command = "cls";
    sc.description = "- Clears the screen and resets the cursor position.";
    sc.function = shellCls;
    this.commandList[this.commandList.length] = sc;

    // man <topic>
    sc = new ShellCommand();
    sc.command = "man";
    sc.description = "<topic> - Displays the MANual page for <topic>.";
    sc.function = shellMan;
    this.commandList[this.commandList.length] = sc;
    
    // trace <on | off>
    sc = new ShellCommand();
    sc.command = "trace";
    sc.description = "<on | off> - Turns the OS trace on or off.";
    sc.function = shellTrace;
    this.commandList[this.commandList.length] = sc;

    // rot13 <string>
    sc = new ShellCommand();
    sc.command = "rot13";
    sc.description = "<string> - Does rot13 obfuscation on <string>.";
    sc.function = shellRot13;
    this.commandList[this.commandList.length] = sc;

    // prompt <string>
    sc = new ShellCommand();
    sc.command = "prompt";
    sc.description = "<string> - Sets the prompt.";
    sc.function = shellPrompt;
    this.commandList[this.commandList.length] = sc;
    
    // load
    sc = new ShellCommand();
    sc.command = "load";
    sc.description = "Load code from input.";
    sc.function = shellLoad;
    this.commandList[this.commandList.length] = sc;
    
    // run
    sc = new ShellCommand();
    sc.command = "run";
    sc.description = "<pid> - Run process from pid in memory.";
    sc.function = shellRun;
    this.commandList[this.commandList.length] = sc;
    
    // runall
    sc = new ShellCommand();
    sc.command = "runall";
    sc.description = "Run all processes in memory.";
    sc.function = shellRunAll;
    this.commandList[this.commandList.length] = sc;
    
    // quantum
    sc = new ShellCommand();
    sc.command = "quantum";
    sc.description = "<int> - choose the Round Robin quantum.";
    sc.function = shellQuantum;
    this.commandList[this.commandList.length] = sc;
    
    // ps
    sc = new ShellCommand();
    sc.command = "ps";
    sc.description = "- Displays the current processes.";
    sc.function = shellProcesses;
    this.commandList[this.commandList.length] = sc;
    
    // kill
    sc = new ShellCommand();
    sc.command = "kill";
    sc.description = "- <pid> Kills the given process.";
    sc.function = shellKill;
    this.commandList[this.commandList.length] = sc;
    
    // whereami
    sc = new ShellCommand();
    sc.command = "whereami";
    sc.description = "- Displays the current location";
    sc.function = shellWhereAmI;
    this.commandList[this.commandList.length] = sc;
    
    // date
    sc = new ShellCommand();
    sc.command = "date";
    sc.description = "- Displays the current date and time";
    sc.function = shellDateTime;
    this.commandList[this.commandList.length] = sc;
    
    // status
    sc = new ShellCommand();
    sc.command = "status";
    sc.description = "<string> - Sets status message on taskbar";
    sc.function = shellStatus;
    this.commandList[this.commandList.length] = sc;

	// background
	sc = new ShellCommand();
    sc.command = "shellbg";
    sc.description = "<string> - Sets the background color of the Shell. Input HEX color eg. 00FF00";
    sc.function = shellBackgroundColor;
    this.commandList[this.commandList.length] = sc;
    
    // bsod
	sc = new ShellCommand();
    sc.command = "bsod";
    sc.description = "- blue screen of death. be warned.";
    sc.function = shellBSOD;
    this.commandList[this.commandList.length] = sc;
    
    // setSchedule
	sc = new ShellCommand();
    sc.command = "setschedule";
    sc.description = "<rr, fcfs, priority> - sets the scheduling algorithm of the OS";
    sc.function = shellSetSchedule;
    this.commandList[this.commandList.length] = sc;
    
    // getSchedule
	sc = new ShellCommand();
    sc.command = "getschedule";
    sc.description = "gets the scheduling algorithm of the OS";
    sc.function = shellGetSchedule;
    this.commandList[this.commandList.length] = sc;
    
    // create
	sc = new ShellCommand();
    sc.command = "create";
    sc.description = "<filename> - Creates a file in local storage with given filename";
    sc.function = shellCreateFile;
    this.commandList[this.commandList.length] = sc;
    
    // read
	sc = new ShellCommand();
    sc.command = "read";
    sc.description = "<filename> - Reads a file in local storage with given filename";
    sc.function = shellReadFile;
    this.commandList[this.commandList.length] = sc;
    
    // write
	sc = new ShellCommand();
    sc.command = "write";
    sc.description = "<filename> \"data\" -  writes data to a file in local storage with given filename";
    sc.function = shellWriteFile;
    this.commandList[this.commandList.length] = sc;
    
    // delete
	sc = new ShellCommand();
    sc.command = "delete";
    sc.description = "<filename> -  deletes a file in local storage with given filename";
    sc.function = shellDeleteFile;
    this.commandList[this.commandList.length] = sc;
    
    // format
	sc = new ShellCommand();
    sc.command = "format";
    sc.description = "formats local storage";
    sc.function = shellFormat;
    this.commandList[this.commandList.length] = sc;

    // processes - list the running processes and their IDs
    // kill <id> - kills the specified process id.

    //
    // Display the initial prompt.
    this.putPrompt();
}

function shellPutPrompt()
{
    _StdIn.putText(this.promptStr);
}

function shellHandleInput(buffer)
{
    krnTrace("Shell Command~" + buffer);
    // 
    // Parse the input...
    //
    if (_ShellList.length == 0)
    	_ShellList[0] = buffer;
    else {
    	_ShellList.push(buffer);
    }
    hostLog(_ShellList.length);
    
    
    var userCommand = new UserCommand();
    userCommand = shellParseInput(buffer);
    // ... and assign the command and args to local variables.
    var cmd = userCommand.command;
    var args = userCommand.args;
    //
    // Determine the command and execute it.
    //
    // JavaScript may not support associative arrays in all browsers so we have to
    // iterate over the command list in attempt to find a match.  TODO: Is there a better way? Probably.
    var index = 0;
    var found = false;
    while (!found && index < this.commandList.length)
    {
        if (this.commandList[index].command === cmd)
        {
            found = true;
            var fn = this.commandList[index].function;
        }
        else
        {
            ++index;
        }
    }
    if (found)
    {
        this.execute(fn, args);
    }
    else
    {
        // It's not found, so check for curses and apologies before declaring the command invalid.
        if (this.curses.indexOf("[" + rot13(cmd) + "]") >= 0)      // Check for curses.
        {
            this.execute(shellCurse);
        }
        else if (this.apologies.indexOf("[" + cmd + "]") >= 0)      // Check for apologies.
        {
            this.execute(shellApology);
        }
        else    // It's just a bad command.
        {
            this.execute(shellInvalidCommand);
        }
    }
}



function shellParseInput(buffer)
{
    var retVal = new UserCommand();

    // 1. Remove leading and trailing spaces.
    buffer = trim(buffer);

    // 2. Lower-case it.
    buffer = buffer.toLowerCase();

    // 3. Separate on spaces so we can determine the command and command-line args, if any.
    var tempList = buffer.split(" ");

    // 4. Take the first (zeroth) element and use that as the command.
    var cmd = tempList.shift();  // Yes, you can do that to an array in JavaScript.  See the Queue class.
    // 4.1 Remove any left-over spaces.
    cmd = trim(cmd);
    // 4.2 Record it in the return value.
    retVal.command = cmd;

    // 5. Now create the args array from what's left.
    for (var i in tempList)
    {
        var arg = trim(tempList[i]);
        if (arg != "")
        {
            retVal.args[retVal.args.length] = tempList[i];
        }
    }
    return retVal;
}

function shellExecute(fn, args)
{
    // We just got a command, so advance the line...
    _StdIn.advanceLine();
    // ... call the command function passing in the args...
    fn(args);
    // Check to see if we need to advance the line again
    if (_StdIn.CurrentXPosition > 0)
    {
        _StdIn.advanceLine();
    }
    // ... and finally write the prompt again.
    this.putPrompt();
}


//
// The rest of these functions ARE NOT part of the Shell "class" (prototype, more accurately), 
// as they are not denoted in the constructor.  The idea is that you cannot execute them from
// elsewhere as shell.xxx .  In a better world, and a more perfect JavaScript, we'd be
// able to make then private.  (Actually, we can. have a look at Crockford's stuff and Resig's JavaScript Ninja cook.)
//

//
// An "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function ShellCommand()     
{
    // Properties
    this.command = "";
    this.description = "";
    this.function = "";
}

//
// Another "interior" or "private" class (prototype) used only inside Shell() (we hope).
//
function UserCommand()
{
    // Properties
    this.command = "";
    this.args = [];
}


//
// Shell Command Functions.  Again, not part of Shell() class per se', just called from there.
//
function shellInvalidCommand()
{
    _StdIn.putText("Invalid Command. ");
    if (_SarcasticMode)
    {
        _StdIn.putText("Duh. Go back to your Speak & Spell.");
    }
    else
    {
        _StdIn.putText("Type 'help' for, well... help.");
    }
}

function shellCurse()
{
    _StdIn.putText("Oh, so that's how it's going to be, eh? Fine.");
    _StdIn.advanceLine();
    _StdIn.putText("Bitch.");
    _SarcasticMode = true;
}

function shellApology()
{
   if (_SarcasticMode) {
      _StdIn.putText("Okay. I forgive you. This time.");
      _SarcasticMode = false;
   } else {
      _StdIn.putText("For what?");
   }
}

function shellVer(args)
{
    _StdIn.putText(APP_NAME + " version " + APP_VERSION);    
}

function shellHelp(args)
{
    _StdIn.putText("Commands:");
    for (var i in _OsShell.commandList)
    {
        _StdIn.advanceLine();
        _StdIn.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
    }    
}

function shellShutdown(args)
{
     _StdIn.putText("Shutting down...");
     // Call Kernel shutdown routine.
    krnShutdown();   
    // TODO: Stop the final prompt from being displayed.  If possible.  Not a high priority.  (Damn OCD!)
}

function shellCls(args)
{
    _StdIn.clearScreen();
    _StdIn.resetXY();
}

function shellMan(args)
{
    if (args.length > 0)
    {
        var topic = args[0];
        switch (topic)
        {
            case "help": 
                _StdIn.putText("Help displays a list of (hopefully) valid commands.");
                break;
            default:
                _StdIn.putText("No manual entry for " + args[0] + ".");
        }        
    }
    else
    {
        _StdIn.putText("Usage: man <topic>  Please supply a topic.");
    }
}
function shellLoad(args)
{
	var uInput = document.getElementById("taProgramInput");
	
	
	//Validation
	var valid = /^[0-9A-F ]+$/i.test(uInput.value);
	
	
	if(valid){
	
		var pri = args[0];
	
		var intRegex = /^\d+$/;
		var blankRegex = /^\s*$/;
		
		var result;
		// Test if prioirty entered is an int
		if(intRegex.test(pri)) {
			result = loadProgram(uInput.value, pri);

		}

		// Otherwise 
		else{
			result = loadProgram(uInput.value, DEFAULT_PRIORITY);
		}
	
		if(result === -1){
			_StdIn.putText("Can only hold 3 processes at this time.");
		}
		else{
			_StdIn.putText("Process created with ID: " + result["pid"] + 
						   " and Priority: " + result["priority"]);
		}
		
	}
	else{
		_StdIn.putText("Invalid Input.");
	}
	
	
}

function shellTrace(args)
{
    if (args.length > 0)
    {
        var setting = args[0];
        switch (setting)
        {
            case "on": 
                if (_Trace && _SarcasticMode)
                {
                    _StdIn.putText("Trace is already on, dumbass.");
                }
                else
                {
                    _Trace = true;
                    _StdIn.putText("Trace ON");
                }
                
                break;
            case "off": 
                _Trace = false;
                _StdIn.putText("Trace OFF");                
                break;                
            default:
                _StdIn.putText("Invalid arguement.  Usage: trace <on | off>.");
        }        
    }
    else
    {
        _StdIn.putText("Usage: trace <on | off>");
    }
}

function shellRot13(args)
{
    if (args.length > 0)
    {
        _StdIn.putText(args[0] + " = '" + rot13(args[0]) +"'");     // Requires Utils.js for rot13() function.
    }
    else
    {
        _StdIn.putText("Usage: rot13 <string>  Please supply a string.");
    }
}

function shellPrompt(args)
{
    if (args.length > 0)
    {
        _OsShell.promptStr = args[0];
    }
    else
    {
        _StdIn.putText("Usage: prompt <string>  Please supply a string.");
    }
}

function shellDateTime()
{
    var date = new Date();
    _StdIn.putText(date.toString());
}

function shellWhereAmI() {

    var output = window.location.href;

    _StdIn.putText(output);
}

function shellStatus(args) {
    if (args.length > 0)
    {
        _SystemStatus = args[0];
    }
    else
    {
        _StdIn.putText("Usage: status <string>  Please supply a string.");
    }
}

function shellKrnTrapErrorTest(){
    // we don't want to kill the OS so we'll pass false for the kill switch
    return krnTrapError("This is just an OS Error trap test.", false);
}

function shellBackgroundColor(args){
 	if (args.length > 0)
    {
        _Canvas.style.backgroundColor= "#" + args[0];
    }
    else
    {
        _StdIn.putText("Usage: shellbg <color> in HEX with lowercase letters eg. 00ff00");
    }
	
}

// Blue screen of death
function shellBSOD()
{
	krnTrapBSOD();
}

// Shell quantum
function shellQuantum(args)
{
	var parsed = parseInt(args[0]);
	console.log(parsed);
	
	if(parsed % 1 === 0){
		_UsedQuantum = parsed;
		_StdIn.putText("The quantum is now "+parsed+".");
	}
	else
		_StdIn.putText("Usage: quantum <integer>. ");
		_StdIn.putText("Current quantum is "+_UsedQuantum+".")
}

function shellRun(args)
{
	_CurrentProcess = _ProcessList[args[0]];
	
	_CurrentProcess.state = PROCESS_RUNNING;
	
	clearCPU();
	_CPU.isExecuting = true;
	delete _ProcessList[args[0]];
	
	
	
}

// run all processes
function shellRunAll()
{
	if(_ProcessList != null){
		
	
		var process = null;
		
		// load processes into _ReadyQueue in a fcfs manner
		for (i in _ProcessList){
			process = _ProcessList[i];
			
			//remove it from process list
			delete _ProcessList[i];
			
			_ReadyQueue.enqueue(process);
		}
		
		_CurrentProcess = _ReadyQueue.dequeue();
		
		_CurrentProcess.state = PROCESS_RUNNING;
		
		clearCPU();
		_CPU.isExecuting = true;
	
	}
	else
		_StdIn.putText("No loaded processes to run.")
}

function shellSetSchedule(args){
	var input = args[0];
	var result = _Scheduler.setSchedule(input);
	_StdIn.putText(result);
}

function shellGetSchedule(args){
	_StdIn.putText("Current schedule: " + _Scheduler.schedule);
}

function shellProcesses(){
	var num = _ProcessList.length;
	if (num === 0){
		_StdIn.putText("No current processes.");
	}
	else{
		_StdIn.putText("Processes (pid): ");

		for(i in _ProcessList){
			_StdIn.putText(_ProcessList[i].pid.toString() + " ");

		}
	}
}


function shellKill(args){
	if(args[0] % 1 === 0){
		var pid = parseInt(args[0]);
		
		var tmp_proc = null;
		var tmp_slot = 0;
		
		var queue = _ReadyQueue.q;
		
		for(i in queue){
			if(_ReadyQueue.q[i].pid === pid){
				tmp_proc = _ReadyQueue.q[i];
				tmp_slot = tmp_proc.slot;
				_ReadyQueue.q[i].state = PROCESS_TERMINATED;
				
				_StdIn.putText("Terminated.");
			}
		}
	}
	else
		_StdIn.putText("Please give a pid.");
}

function shellCreateFile(args){
	var alphnum = /^[a-z0-9]+$/i;
	
	if (alphnum.test(args[0])){
		if(krnFileSystemDriver.create(args[0])){
			_StdIn.putText("File: "+ args[0] + " was created.");
		}
		else{
			_StdIn.putText("Error creating file.");
		}
	}
	else{
		_StdIn.putText("Please enter a valid filename.");
	}
	
}

function shellReadFile(args){
	var alphnum = /^[a-z0-9]+$/i;
	
	if (alphnum.test(args[0])){
		var data = krnFileSystemDriver.read(args[0]);
		if( data.length > 0 )
		{	
			for( var i = 0; i < data.length; i++ )
			{	
				if( i % 45 === 0 )
					_StdIn.advanceLine();
				_StdIn.putText(data.charAt(i));
			}
			
			_StdIn.advanceLine();
		}
		else
		{
			_StdIn.putText("Read not successful");
		}
	}
	else{
		_StdIn.putText("Please enter a valid filename.");
	}
	
}

function shellWriteFile(args){
	var alphnum = /^[a-z0-9]+$/;
	
	
	if (alphnum.test(args[0])){
			var data = args.join(" ");
			data = data.substring(args[0].length + 1);
			if(krnFileSystemDriver.write(args[0], data.substring(2,data.length-2))){
				_StdIn.putText("File: "+ args[0]+ " was written.");
			}
			else{
				_StdIn.putText("Error writing file.");
			}
	
	}
	else{
		_StdIn.putText("Please enter a valid filename.");
	}
	
}

function shellDeleteFile(args){
	var alphnum = /^[a-z0-9]+$/i;
	
	if (alphnum.test(args[0])){
		if(krnFileSystemDriver.delete(args[0])){
			_StdIn.putText("File: "+ args[0]+ " was deleted.");
		}
		else{
			_StdIn.putText("Error deleting file.");
		}
	}
	else{
		_StdIn.putText("Please enter a valid filename.");
	}
	
}

function shellFormat(){
	if(krnFileSystemDriver.format()){
		_StdIn.putText("Disk formatted.");
	}
	else{
		_StdIn.putText("Error formatting disk.");
	}
}