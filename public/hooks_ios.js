'use strict';

const jsonpath = require('jsonpath');
let root = require('window-or-global');
function Hooks(config, sessionId) {}

Hooks.prototype.filterSource = function(  source_value ) {


  //console.log('source before remove, typeof(source)=  ' + typeof source + " typeof source.value=" + typeof source.value);

  //const source_value= JSON.parse(source.value);
  //console.log("source before removeElement = " +  JSON.stringify(source_value) );
  removeElement(source_value, "type", "StatusBar");
  removeElement(source_value, "type", "Keyboard");
  removeElement(source_value, "name", "下一个键盘");
  removeElementAfterSecurityKeyboard(source_value);

  return JSON.stringify(source_value);
  //console.log("source after removeElement = " +  JSON.stringify(source_value) );
//console.log("source after removeElement = " +  (source.value) );
}


function removeElement(element, attrtype, match){

   //console.log("element  = "  +   element.type  ) ;

  if(element[attrtype]==match){
     //console.log("element match  "  + match);
    return true;
  }else if(element.children){

    const children_elements  = element.children;
    for(let i in children_elements  ){
      //console.log("children_elements[" + i + "]="  + children_elements[i].type );
      if (removeElement(children_elements[i], attrtype, match)) {
        children_elements.splice(i,1) ;
        //console.log("remove "  + children_elements[i] );
        break;

      }

    }
  }else{
    return false;
  }


}

function removeElementAfterSecurityKeyboard(element){

   //console.log("element  = "  +   element.type  ) ;

  if(element.name=="中国工商银行安全键盘"){
    // console.log("element match  中国工商银行安全键盘"  );
    return true;
  }else if(element.children){

    const children_elements  = element.children;
    for(let i in children_elements  ){
      //console.log("children_elements[" + i + "]="  + children_elements[i].type );
      if (removeElementAfterSecurityKeyboard(children_elements[i])) {
        let l = children_elements.length;
        children_elements.splice(i,l-i) ;
        //console.log("remove "  + children_elements[i] );
        break;

      }

    }
  }else{
    return false;
  }


}

function array_contain(array, obj){
    for (var i = 0; i < array.length; i++){
        if (array[i] === obj)//如果要求数据类型也一致，这里可使用恒等号===
            return true;
    }
    return false;
}

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

    //console.log("value=" +  source );

    var sourceValue   = jsonpath.query(source, '$.value');
    //console.log("sourceValue=" + sourceValue);
    let chidrenWindows =  jsonpath.query( eval('(' + sourceValue  + ')'), '$.children[*].children[*]');




    //console.log("sourceValue after digest" + sourceValue);

    /*
     *
     */
    //  console.log("chidrenWindows=" + JSON.stringify(  chidrenWindows  )  ) ;

      //console.log("childrentypes=" +  jsonpath.query(  chidrenWindows  , '$[*].type')      );
    //  console.log("value=" +   JSON.stringify(  jsonpath.query( eval('(' + sourceValue  + ')'), '$.children[*].children[*][?(@.type=="StatusBar")]')   )  );

    //var sourceValue   = jsonpath.query(source, '$.children[?(@.type=="Application")]');
    //console.log("sourceValue=" + sourceValue);
    //var textvalues   = jsonpath.query(  eval('(' + sourceValue  + ')'), "$..*[?(@.type=='StaticText')].label" );
    //  var textvalues = jsonpath.query(  chidrenWindows   , "$..value" );
    //  console.log("textvalues=" + JSON.stringify (textvalues ) );
    //  var labelvalues = jsonpath.query(  chidrenWindows  , "$..label" );
    //  console.log("labelvalues=" + JSON.stringify (labelvalues ) );
      let namevalues = jsonpath.query(   chidrenWindows  , "$..name" );
      let namevalue_array=[];
    //  console.log("namevalues=" + JSON.stringify (namevalues )  + " typeof " + typeof (namevalues) + " length=" + namevalues.length );
      let namevalue_digest="";
      for (let i in  namevalues ) {
        // console.log("namevalues=" + namevalues[i]);
        if (namevalues[i] && namevalues[i].length<6
          && namevalues[i]!= "" && namevalues[i]!= "dictation" && namevalues[i]!= "dictation_dockitem-portrait") {
          //  console.log("namevalues["+i+"]=" + namevalues[i]  );

          if ( !array_contain(namevalue_array, namevalues[i]) ) {
            namevalue_array.push(namevalues[i]);
          }
          //console.log("namevalues=" + namevalues[i] + " length=" +  namevalues[i].length  );

        }
      }
      for(let i in namevalue_array){
      //  console.log('namevalue_array' + ' ' + namevalue_array[i]);
        namevalue_digest = namevalue_digest + namevalue_array[i];
      }

    //  var noStatusBar   = jsonpath.query(   chidrenWindows   , "$.children[?(@.type=='StatusBar')]" );
    //  console.log("noStatusBar=" + JSON.stringify (noStatusBar ) );


    /*
     *  count diffrent types count
     */
    var types = jsonpath.query(eval('(' + sourceValue  + ')'), '$..type');
    let buttonCount=0;
    let TextViewCount=0;
    let TextFieldCount=0;
    let OtherCount=0;
    let StaticTextCount=0;
    let TextValue = '';
    for(let i=0; i< types.length; i++){
      if(types[i] == "Button") { buttonCount++;}
      else if(types[i] == "TextView") { TextViewCount++; }
      else if(types[i] == "TextField") { TextFieldCount++; }
      else if(types[i] == "StaticText" ) {
          StaticTextCount++;
        //  if(types[i].
          //TextValue = TextValue + types[i].value
      }
      else if(types[i] == "Other") { OtherCount++; }
    }

    let typecount_digest = '';
    if(buttonCount || TextViewCount || TextFieldCount || StaticTextCount){
      typecount_digest = buttonCount + "_" + TextViewCount + "_" + TextFieldCount + "_" + StaticTextCount ;
    }else{
      typecount_digest =   OtherCount+ "_" + types.length;
    }

    let appRect  = jsonpath.query(eval('(' + sourceValue  + ')'), '$.rect')[0];

    // console.log("app.rect=" + JSON.stringify ( appRect) );
    let StaticTexts = jsonpath.query(eval('(' + sourceValue  + ')'), '$..children[?(@.type=="StaticText" || @.type=="Button" ||  @.type=="Other")]');

    /*
      get title text
    */
    //let NavBarStaticText=[];
    let tempStaticText ;
    let distince= appRect.width/2;
    let title_digest="";
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
      // get the several central staticTexts label title as digest
      if( centerY<44+50 && centerY>20
          && StaticTexts[i].rect.x > appRect.width/4
          && StaticTexts[i].rect.x+StaticTexts[i].rect.width < appRect.width-appRect.width/4){
            title_digest = title_digest + StaticTexts[i].label;
      }
    }
/* get the most central staticText‘s label as digest
    if(tempStaticText){
      console.log("center Static " + JSON.stringify(tempStaticText));
      node.digest = tempStaticText.label +"_"+node.digest ;
    }
*/
  node.digest="";
  //console.log("titledigest " +  title_digest);
  if (title_digest) {
    node.digest = title_digest + "_";
  }
  if (namevalue_digest) {
    node.digest = node.digest + namevalue_digest;
  }else{
    node.digest = node.digest + typecount_digest;
  }
  //  console.log(  "node.digest = " + node.digest  );

  return true;

};

/**
 * Method to sort a list of actions which will be later bind to a crawling node object, return the list of actions.
 * @Params: actions the array of actions which can be further sorted.
 * @Params: crawler the crawler instance which contains the context information as well as crawler config.
 * @Returns: actions the sorted actions which should be bind to the crawling node.
 * */
Hooks.prototype.sortActionPriority = function(actions, crawler) {

  actions.sort(function(a,b){

    let v1,v2;

    if(!a.source.isHittable){
        v1 = 0;
    }else if( checkMatch(a.source, crawler.config.targetElements, crawler)){
        v1 = 200;
    }else if(a.source.label || a.source.name || a.source.value || a.source.text){
        v1 = GetRandomNum(1,100);
    }else{
      v1=0;
    }

    if(!b.source.isHittable){
      v2 = 0;
    }else  if(  checkMatch(b.source, crawler.config.targetElements, crawler) ){
      v2 = 200;
    }  else if (  b.source.label || b.source.name || b.source.value || b.source.text  ){
      v2 = GetRandomNum(1,100);
    }else{
      v2=0;
    }

    return v2-v1;
  });
  /*
      for (let i = 0; i < this.currentNode.actions.length; i++) {
        let action = this.currentNode.actions[i].source;
        let tag = action.label || action.name || action.value;
        console.log(this.currentNode.digest + ' actionbefore slice=' + tag + ' type=' + action.type);
      }
      console.log('backAction = ' + this.currentNode.backAction);
  */
/*  for(let i in actions){
    console.log('action after sort=' + actions[i].source.label);
  }
  console.log('backaction=' + crawler.currentNode.backAction.source.label);*/
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

function GetRandomNum(Min,Max)
{
var Range = Max - Min;
var Rand = Math.random();
return(Min + Math.round(Rand * Range));
}

function checkMatch(source, matches ,crawler ){
  for (let match in matches) {
    if (crawler.checkContentMatch(source, matches[match].searchValue, false)) {
      return true;
    }
  }
  return false;
}

exports.Hooks = Hooks;
