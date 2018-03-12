'use strict';

const jsonpath = require('jsonpath');
let root = require('window-or-global');
function Hooks(config, sessionId) {}

/**
 * Method to generate a unique digest which can identify a window, change the node.digest if you want.
 * @Params: $platform the name of the platform "iOS/android/web"
 * @Params: $source the raw json source of the current page
 * @Params: $node the node which needs to settle digest
 * @Returns: true to indicate the action has been handled and the default logic will not execute
 * to indicate the action has been handled
 * */
 Hooks.prototype.checkDigest = function(platform, source, node, crawler) {


  /*let digest1 = "";
  console.log("origin digest = " + digest1);
  root.wdclient.send('/wd/hub/session/' + root.wdclient.sessionId + '/title', 'get', null, null)
    .then(title => {
      digest1 = title.value;
    });
    console.log("title digest = " + digest1);

    node.digest = digest1;
console.log("node   digest: " + node.digest );
*/

    var sourceValue   = jsonpath.query(source, '$.value');
    //console.log("sourceValue=" + sourceValue);
    var types = jsonpath.query(eval('(' + sourceValue  + ')'), '$..type');
    let buttonCount=0;
    let TextViewCount=0;
    let TextFieldCount=0;
    let OtherCount=0;
    let StaticTextCount=0;
    for(let i=0; i< types.length; i++){
      if(types[i] == "Button") { buttonCount++;}
      else if(types[i] == "TextView") { TextViewCount++; }
      else if(types[i] == "TextField") { TextFieldCount++; }
      else if(types[i] == "StaticText") { StaticTextCount++; }
      else if(types[i] == "Other") { OtherCount++; }
    }
    if(buttonCount || TextViewCount || TextFieldCount || StaticTextCount){
      node.digest = buttonCount + "_" + TextViewCount + "_" + TextFieldCount + "_" + StaticTextCount ;//+ "_" + types.length;
    }else{
      node.digest =   OtherCount+ "_" + types.length;
    }

    let appRect  = jsonpath.query(eval('(' + sourceValue  + ')'), '$.rect')[0];

    console.log("app.rect=" + JSON.stringify ( appRect) );
    let StaticTexts = jsonpath.query(eval('(' + sourceValue  + ')'), '$..children[?(@.type=="StaticText" || @.type=="Button")]');

  //  let NavBarStaticText=[];
    let tempStaticText ;
    let distince= appRect.width/2;
    let labeldigest="";
    for(let i=0; i<StaticTexts.length;i++){
      const centerY= StaticTexts[i].rect.y + StaticTexts[i].rect.height/2;
    //  const centerX= StaticTexts[i].rect.x + StaticTexts[i].rect.width/2 ;
    //  const centerRightX= ;
    /*  if( centerY<20+44 && centerY>20 ){
        let tempDis = centerX - appRect.width/2;
        console.log("tempDis="+ tempDis);
        console.log("distince=   " + distince);
        if( (tempDis >= 0 && tempDis < distince)  ){
          tempStaticText = StaticTexts[i];
          distince = tempDis;

        }else if((tempDis < 0 && -tempDis < distince) ){
          tempStaticText = StaticTexts[i];
          distince = -tempDis;
        }
      }

      */
      // get the several central staticTexts label as digest
      if( centerY<20+44 && centerY>20
          && StaticTexts[i].rect.x > appRect.width/4
          && StaticTexts[i].rect.x+StaticTexts[i].rect.width < appRect.width-appRect.width/4){
            labeldigest = labeldigest + StaticTexts[i].label;
      }
    }
/* get the most central staticText‘s label as digest
    if(tempStaticText){
      console.log("center Static " + JSON.stringify(tempStaticText));
      node.digest = tempStaticText.label +"_"+node.digest ;
    }
*/
  if(labeldigest){
    //console.log("center Static " + JSON.stringify(tempStaticText));
    node.digest = labeldigest +"_"+node.digest ;
  }
    console.log(  "node.digest = " + node.digest  );



  return true;

};

/**
 * Method to sort a list of actions which will be later bind to a crawling node object, return the list of actions.
 * @Params: actions the array of actions which can be further sorted.
 * @Params: crawler the crawler instance which contains the context information as well as crawler config.
 * @Returns: actions the sorted actions which should be bind to the crawling node.
 * */
Hooks.prototype.sortActionPriority = function(actions, crawler) {

  /*actions.forEach(function(action){

  });*/

  for(let i=0; i<actions.length; i++){
    if( actions[i].source.type == "TextField" && actions[i].source.TextField_count)
      actions.splice(i,1)
    ;
  }

  actions.sort(function(a,b){
    let v1,v2;
    if(a.source.label || a.source.name || a.source.value || a.source.text ) {
      v1=1;
    }else{
      v1=0;
    }
    if(b.source.label || b.source.name || b.source.value || b.source.text ){
      v2=1;
    }else{
      v2=0;
    }
    return v2-v1;
  });

};

/**
 * Method to perform action for the current platform.
 * @Params: action the action which belongs to current active node
 * @Params: crawler the crawler instance which contains the context information as well as crawler config
 * @Returns: a Promise to indicate the action has been handled and the default logic will not execute
 * */
Hooks.prototype.performAction = function(action, crawler) {
  return null;
};

/**
 * Method to intercept the crawling process after an specific action has been performed
 * @Params: action the action which belongs to current active node, and has just been performed
 * @Params: crawler the crawler instance which contains the context information as well as crawler config
 * @Returns: a Promise to indicate the action has been handled and otherwise the default logic will bypass it
 * */
Hooks.prototype.afterActionPerformed = function(action, crawler) {
  return null;
};

/**
 * Method to analysis and insert tab nodes for a master-detail view structure.
 * @Params: sourceArray the array of elements which belongs to the candidate tab node.
 * @Params: crawler the crawler instance which contains the context information as well as crawler config
 * @Returns: true to indicate the action has been handled and the default logic will not execute
 * */
Hooks.prototype.insertTabNode = function (sourceArray, crawler) {
  return false;
};

exports.Hooks = Hooks;
