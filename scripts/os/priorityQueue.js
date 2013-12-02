/* ------------
   priorityQueue.js
   
   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the Javascript Array documentation at http://www.w3schools.com/jsref/jsref_obj_array.asp .
   Look at the push and shift methods, as they are the least obvious here.
   
   ------------ */
   
function Queue()
{
    // Properties
    this.q = new Array();
    
    // sorted bool
    this.sorted = false;
    
    // priority
    this.priorityQueue = false;
    
    // sort style
    this.sortStyle = function(a,b){
	    return a.priority - b.priority;
    };
    

    // Methods
    this.getSize = function() {
        return this.q.length;    
    };
    

	this.sort = function(){
		if(this.priorityQueue){
			this.q.sort(this.sortStyle);
			this.sorted = true;
		}
	}


    this.isEmpty = function(){
        return (this.q.length == 0);    
    };

    this.enqueue = function(element) {
        this.q.push(element);        
        this.sorted = false;
    };
    
    this.getItem = function(index) {
	  	var elem = this.q[index];
	  	if(elem){
		  	return elem.object;
	  	}
	  	else
	  		return undefined;
    };
    
    this.dequeue = function() {
    	if(!this.sorted){
	    	this.sort();
    	}
        var retVal = null;
        if (this.q.length > 0)
        {
            retVal = this.q.shift();
        }
        return retVal;        
    };
    
    this.peek = function(){
    	if(!this.sorted){
	    	this.sort();
    	}
	    if(this.q.length>0){
		   return (this.q[0]);
	    }
	    else
	    	return undefined;
    }
    
    this.toString = function() {
        var retVal = "";
        for (var i in this.q)
        {
            retVal += "[" + this.q[i] + "] ";
        }
        return retVal;
    };
}
