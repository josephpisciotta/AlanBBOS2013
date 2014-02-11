#jOS F
============

This is my Fall 2013 Operating Systems class initial project.

============

#Command Line Interface

**Commands**

- **shutdown**: shuts down the virtual OS
- **cls**: clears the screen
- **man <topic>***: gives the manual page for the topic/command given
- **trace <on|off>**: turns the OS trace on or off
- **rot13 <string>**: does a rotation 13 obfuscation on a given string
- **prompt <string>**: sets the prompt to a given string
- **date**: displays user's date and time
- **whereami**: display's current location on drive
- **status <string>**: sets the status on the top status bar of the CLI
- **shellbg <string>**: choose a background for the shell
- **date**: displays the current date and time
- **bsod**: blue screen of death
- **setschedule <fcfs, rr, priority>**: this sets the scheduling algorithm used: First Come First Serve, Round Robin, or Priority
- **getschedule**: displays the scheduling algorithm currently being used
- **quantum <int>**: sets the quantum of the Round Robin scheduling algorithm of the CPU
- **create <filename>**: creates a file in local storage with a given name
- **read <filename>**: reads the file specified by the filename
- **write <filename> "data"**: writes the "data" specified to the given <filename>
- **delete <filename>**: deletes the file
- **format**: formats the local storage to the protocol designed for this OS
- **load**: takes an optional <priority> attribute. Loads a program throught the program input. Programs are checked for validity. Then loaded into memory if there is room or local storage for later use.
- **run <pid>**: runs the process with a given <pid> according to the virtual CPU scheduler. Some pids may exist in local storage
- **runall**: runs all loaded process, both on memory and in storage. The scheduler handles how these programs are run.
- **ps**: displays all the currently running processes
- **kill <pid>**: kills the process with the given <pid>







See http://www.labouseur.com/courses/os/ for details.
