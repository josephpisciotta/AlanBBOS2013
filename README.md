#jOS F
============

This is my Fall 2013 Operating Systems class initial project.

============

##Operation and User Interface

This is a Virtual Operating System. The Storage which it uses is the HTML Local Storage system. Memory is all virtual so it still requires management (allocation and deallocation). Like almost every operating system that has existed in the past few decades, this virtual one seperates firmware and system calls from user calls. It manages a virtual Interrupt Queue. Keyboards and FileSystems have had drivers written to operate. Programs do not have unlimited access to access memory. They are allowed to access what the system gives them access to. 

###Console

- The console can be used in the style of any Terminal application or Command Prompt. From the console you can run a number of the built in programs.
- You may create files (stored in bytes in a filesystem format created for the OS)
- You may load programs from the Program input. The programs are a limited form of 6502 Assembly (I have provided one already typed in) the programs must be given in the HEX form of Assembly

###Memory and Disk Display
While running a program the process memory will be displayed in the memory table and and files or programs that are stored on Disk will be under the Disk table.

###CPU Display
This displays the current state of the CPU registers, accumulator, and program counter.

###Ready Queue Display
This displays the Ready Queue for the processes that are waiting to be handled by the CPU.

###Current PCB Display
This displays the information of the currently running process.

###Log
This displays the events that register to the OS. Not everything should be displayed to the Console but as a designer, seeing what is registered by the OS is very important.

============

##Command Line Interface

**Commands**

- **shutdown**: shuts down the virtual OS
- **cls**: clears the screen
- **man &lt;topic&gt;**: gives the manual page for the topic/command given
- **trace &lt;on|off&gt;**: turns the OS trace on or off
- **rot13 &lt;string&gt;**: does a rotation 13 obfuscation on a given string
- **prompt &lt;string&gt;**: sets the prompt to a given string
- **date**: displays user's date and time
- **whereami**: display's current location on drive
- **status &lt;string&gt;**: sets the status on the top status bar of the CLI
- **shellbg &lt;string&gt;**: choose a background for the shell
- **date**: displays the current date and time
- **bsod**: blue screen of death
- **setschedule &lt;fcfs, rr, priority&gt;**: this sets the scheduling algorithm used: First Come First Serve, Round Robin, or Priority
- **getschedule**: displays the scheduling algorithm currently being used
- **quantum &lt;int&gt;**: sets the quantum of the Round Robin scheduling algorithm of the CPU
- **create &lt;filename&gt;**: creates a file in local storage with a given name
- **read &lt;filename&gt;**: reads the file specified by the filename
- **write &lt;filename&gt; "data"**: writes the "data" specified to the given &lt;filename&gt;
- **delete &lt;filename&gt;**: deletes the file
- **format**: formats the local storage to the protocol designed for this OS
- **load**: takes an optional &lt;priority&gt; attribute. Loads a program throught the program input. Programs are checked for validity. Then loaded into memory if there is room or local storage for later use.
- **run &lt;pid&gt;**: runs the process with a given &lt;pid&gt; according to the virtual CPU scheduler. Some pids may exist in local storage
- **runall**: runs all loaded process, both on memory and in storage. The scheduler handles how these programs are run.
- **ps**: displays all the currently running processes
- **kill &lt;pid&gt;**: kills the process with the given &lt;pid&gt;
- **ls**: Displays all files on disk


===============




See http://www.labouseur.com/courses/os/ for details.
