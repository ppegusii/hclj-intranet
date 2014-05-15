$(function () {
	new Controller();
});
function Controller(){
  this.__vTxt__ = new ViewText('#text');
  this.__vBtn__ = new ViewButton('#makeTable');
  this.__vTbl__ = new ViewTable('#table-container');
  this.__text__ = undefined; //should be in a Model

  this.__init__();
}
Controller.prototype.__init__ = function(){
  this.__vTxt__.bind('textChanged',this.__getTextChangedHandler__());
  this.__vBtn__.bind('click',this.__getClickHandler__());
};
Controller.prototype.__getTextChangedHandler__ = function(){
  var c = this;
  return function textChangedHandler(text){
    if(text && text !== ''){
      c.__text__ = text;
      return c.__vBtn__.enable();
    }
    c.__text__ = undefined;
    c.__vBtn__.disable();
  };
};
Controller.prototype.__getClickHandler__ = function(){
  var c = this;
  return function clickHandler(){
    c.__vTbl__.makeTable(c.__text__);
  };
};
function View(selector){
  this.__wrappedElement__ = $(selector);
	this.__callbacks__ = undefined;
}
function ViewText(selector){
  View.call(this,selector);
  this.__init__();
}
ViewText.prototype.__init__ = function(){
  this.__initCallbacks__();
  var changed = this.__getChangeHandler__();
  this.__wrappedElement__.keyup(changed);
  $('body').on('mousemove',null,changed);
};
ViewText.prototype.__getChangeHandler__ = function(){
  var vt = this;
  return function(eventObject){
    var text = vt.__wrappedElement__.val();
    vt.__callbacks__['textChanged'].forEach(function(callback,index,callbacks){
      callback(text);
    });
  };
}
ViewText.prototype.__initCallbacks__ = function(){
	this.__callbacks__ = [];
	this.__callbacks__['textChanged'] = [];
};
ViewText.prototype.bind = function(name,handler){
	this.__callbacks__[name].push(handler);
};
function ViewButton(selector){
  View.call(this,selector);
  this.__init__();
}
ViewButton.prototype.__init__ = function(){
  this.__initCallbacks__();
  var vb = this;
  this.__wrappedElement__.click(function(eventObject){
    var text = $(this).val();
    vb.__callbacks__['click'].forEach(function(callback,index,callbacks){
      callback(text);
    });
  });
};
ViewButton.prototype.__initCallbacks__ = function(){
	this.__callbacks__ = [];
	this.__callbacks__['click'] = [];
};
ViewButton.prototype.bind = function(name,handler){
	this.__callbacks__[name].push(handler);
};
ViewButton.prototype.disable = function(){
  this.__wrappedElement__.attr('disabled','disabled');
}
ViewButton.prototype.enable = function(){
  this.__wrappedElement__.removeAttr('disabled');
}
function ViewTable(selector){
  View.call(this,selector);
}
ViewTable.prototype.makeTable = function(text){
  //copied from http://www.textfixer.com/html/csv-convert-table.php
  var oldTextArr = text.split("\n");
  var newText = "";
  //Get rid of quotes at beginning and end
  for(var i = 0; i < oldTextArr.length; i++){
    oldTextArr[i] = oldTextArr[i].replace(/\r/,"");
    oldTextArr[i] = oldTextArr[i].replace(/^\'/,""); 
    oldTextArr[i] = oldTextArr[i].replace(/^\"/,"");
    oldTextArr[i] = oldTextArr[i].replace(/"$/,""); 
    oldTextArr[i] = oldTextArr[i].replace(/'$/,"");
    if(i === 0){
      oldTextArr[i] = "<tr><th>"+oldTextArr[i]+"</th></tr>";
    }else{
      oldTextArr[i] = "<tr><td>"+oldTextArr[i]+"</td></tr>";
    }
  }
  var linesep = '\t';
  //make table
  for(var i = 0; i < oldTextArr.length; i++){
    if(i === 0){
      oldTextArr[i] = oldTextArr[i].replace(new RegExp(linesep, "gi"), "</th><th>" );
    }else{
      oldTextArr[i] = oldTextArr[i].replace(new RegExp(linesep, "gi"), "</td><td>" );
    }
    newText = newText + oldTextArr[i]+"\n";
  }
  newText = "<table>\n"+newText+"</table>\n";
  this.__wrappedElement__.html(newText);
}
