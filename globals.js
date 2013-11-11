/* ------------  
   Globals.js

   Global CONSTANTS and _Variables.
   (Global over both the OS and Hardware Simulation / Host.)
   
   This code references page numbers in the text book: 
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
   ------------ */

//
// Global CONSTANTS
//
var APP_NAME = "jOS F";  // 'cause I was at a loss for a better name.
var APP_VERSION = "1.00";   // What did you expect?

var CPU_CLOCK_INTERVAL = 100;   // This is in ms, or milliseconds, so 1000 = 1 second.

var TIMER_IRQ = 0;  // Pages 23 (timer), 9 (interrupts), and 561 (interrupt priority).
                    // NOTE: The timer is different from hardware/host clock pulses. Don't confuse these.
var KEYBOARD_IRQ = 1; 
var ModeSwitch = 2;

// Quantum for Round Robin
var DEFAULT_QUANTUM = 6; 

// Memory Defaults
var TOTAL_MEMORY = 768;
var MEM_BLOCK_SIZE = 255;

// PCB States
var PROCESS_NEW 		= 0; // Process newly created
var PROCESS_LOADED   	= 1; // Process loaded in memory
var PROCESS_READY		= 2; // Process added to ready queue awaiting execution
var PROCESS_RUNNING 	= 3; // Process currently executing
var PROCESS_TERMINATED 	= 4; // Process finished executing

//
// Global Variables
//
var _UsedQuantum = DEFAULT_QUANTUM; // Currently Being used quantum

var _PID = 0;

var _CPU = null;

var _Memory = null;

var _MemoryManager = null;

var _CurrentProcess = null;

var _ReadyQueue = null;

var _ProcessList = null;

var _Scheduler = null;

var _CycleCount = 1;

var _MemoryTableCells = null;

var _OSclock = 0;       // Page 23.

var _Mode = 1;   // 0 = Kernel Mode, 1 = User Mode.  See page 21.

var _Canvas = null;               // Initialized in hostInit().
var _TaskbarCanvas = null;        // Initialized in hostInit().
var _DrawingContext = null;       // Initialized in hostInit().
var _TaskbarContext = null;       // Initialized in hostInit().

var _DefaultFontFamily = "sans";  // Ignored, I think. The was just a place-holder in 2008, but the HTML canvas may have use for it.
var _DefaultFontSize = 13;
var _FontHeightMargin = 4;        // Additional space added to font size when advancing a line.

// Default the OS trace to be on.
var _Trace = true;

// OS queues
var _KernelInterruptQueue = null;
var _KernelBuffers = null;
var _KernelInputQueue = null;

var _ShellList = null;

// Standard input and output
var _StdIn  = null;
var _StdOut = null;

var _Date = null;

// UI
var _Console = null;
var _OsShell = null;

var _SystemStatus = "Running";

// At least this OS is not trying to kill you. (Yet.)
var _SarcasticMode = false;

// Global Device Driver Objects - page 12
var krnKeyboardDriver = null;

// For testing...
var _GLaDOS = null;
