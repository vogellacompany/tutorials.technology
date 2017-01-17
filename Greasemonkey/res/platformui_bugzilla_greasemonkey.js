/*******************************************************************************
 * Copyright (c) 2012, 2016 IBM Corporation and others.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *     IBM Corporation - initial API and implementation
 *     Lars Vogel <Lars.Vogel@vogella.com> - Modification for Platfoform UI usage
 *******************************************************************************/
//---------------------------------------------------------------------
//
// JDT UI Bugzilla Add-on for Bugzilla at bugs.eclipse.org.
// For a longer description, see http://www.eclipse.org/jdt/ui/dev.php#scripts
//
// This is a Greasemonkey user script.  To install it, you need
// Greasemonkey: http://www.greasespot.net/
// Then restart Firefox and revisit this script.
//
// To uninstall, go to Add-ons > User Scripts,
// select "JDT UI Bugzilla Add-On", and click Remove.
//
// --------------------------------------------------------------------
//
// ==UserScript==
// @name          JDT UI Bugzilla Add-On
// @namespace     http://www.eclipse.org/jdt/ui
// @description   Script to tune Bugzilla for JDT UI
// @grant         GM_getResourceText
// @grant         GM_xmlhttpRequest
// @grant         GM_addStyle
// @run-at document-start
// @resource      config   https://www.eclipse.org/jdt/ui/scripts/jdtbugzilla.config.js
// @downloadURL   https://raw.githubusercontent.com/vogellacompany/com.vogella.tutorials.technology/master/Greasemonkey/res/platformui_bugzilla_greasemonkey.js
// @updateURL     https://raw.githubusercontent.com/vogellacompany/com.vogella.tutorials.technology/master/Greasemonkey/res/platformui_bugzilla_greasemonkey.js
// @version 1.20170111T1327

// @include       https://bugs.eclipse.org/bugs/show_bug.cgi*
// @include       https://bugs.eclipse.org/bugs/process_bug.cgi
// @include       https://bugs.eclipse.org/bugs/attachment.cgi*
// @include       https://bugs.eclipse.org/bugs/enter_bug.cgi*
// @include       https://bugs.eclipse.org/bugs/post_bug.cgi*
// @include       https://bugs.eclipse.org/bugs/query.cgi*
// @include       https://bugs.eclipse.org/bugs/buglist.cgi*
// @include       https://bugs.eclipse.org/bugs/show_activity.cgi*
// @include       https://bugs.eclipse.org/bugs/report.cgi*
//
// Test install for new Bugzilla versions:
// @include       https://bugs.eclipse.org/bugstest/*
//
// IBM-internal:
// @include       https://bugs.ottawa.ibm.com/*
//
// Locally saved query.cgi (requires about:config setting greasemonkey.fileIsGreaseable = true):
// @include       file://*/Search%20for%20bugs.htm*
// ==/UserScript==

// --- Configurable options --------------------------------------------
// These values can be overridden in your local jdtbugzilla.config.js.
// Steps in Firefox:
// - Greasemonkey > Manage User Scripts
// - open context menu on "JDT UI Bugzilla Add-On"
// - choose "Show Containing Folder"
// - edit jdtbugzilla.config.js

// Add as many milestones as you like:
var target_milestones= ["4.7 M5", "4.7 M6", "4.7", "4.6.3", "BETA J9"];

// Indexes into target_milestones to be used for "Fixed (in <TM>)" links
var main_target_milestones= [0/*, 2*/];

// Add "<name>", "<email>" pairs for people you frequently CC:
var ccs= [
"FM", "Fabian Pfaff <Fabian.Pfaff@vogella.com",
"SS", "Simon Scholz <simon.scholz@vogella.com>",
"PS", "Patrik Suzzi <psuzzi@gmail.com>",
"SC", "scela@redhat.com",
"AK", "akurtakov@gmail.com",
"DM", "daniel_megert@ch.ibm.com"
];

// Add "<name>", "<email>" pairs for people you frequently assign bugs to:
var assignees= ccs;

// Add "<name>", "<email>" pairs for people you frequently use as flag requestees:
var requestees= ccs;

// Add "<name>", "<string>" pairs for template strings that you frequently insert into the comment field (e.g. repo URLs):
var commentTemplates= [
"Fixed with ", "Fixed with ",
"jdt.ui", "http://git.eclipse.org/c/jdt/eclipse.jdt.ui.git/commit/?id=",
"platform.text", "http://git.eclipse.org/c/platform/eclipse.platform.text.git/commit/?id=",
"platform.common", "http://git.eclipse.org/c/platform/eclipse.platform.common.git/commit/?id=",
"platform.ui", "http://git.eclipse.org/c/platform/eclipse.platform.ui.git/commit/?id=",
"platform.team", "http://git.eclipse.org/c/platform/eclipse.platform.team.git/commit/?id=",
"pde.ui", "http://git.eclipse.org/c/pde/eclipse.pde.ui.git/commit/?id=",
"equinox.bundles", "http://git.eclipse.org/c/equinox/rt.equinox.bundles.git/commit/?id=",
];

// Add Products and Components to which you frequently move bugs:
var moveProducts= [ "Platform", "JDT", "PDE", "Equinox" ];
var moveComponents= [ "Core", "Debug", "Doc", "SWT", "Text", "UI" ];

// Add quick platform links ("<name>", "<hardware>", "<os>" triplets):
var platforms= [
"Win7", "PC", "Windows 7",
"Linux", "PC", "Linux",
"Mac", "PC", "Mac OS X",
];

// Add quick version links on the search page (<version> for exact version, <version*> for prefix match):
var queryVersions= [ "3.*", "4.*"];

// Add quick classifications links on the search page (<name>", ["<classification1>", "<classification2>", ...], ["<product1>", "<product2>", ...] triplets):
var queryClassifications= [
"E", ["Eclipse"], ["JDT", "PDE", "Platform"],
" & ", ["Eclipse", "RT"], ["Equinox", "JDT", "PDE", "Platform"],
"RT", ["RT"], ["Equinox"],
];

// Add quick product links on the search page ("<name>", "<Classification>", ["<product1>", "<product2>", ...] triplets):
var queryProducts= [
"EGit", "Technology", ["EGit"],
" & ", "Technology", ["EGit", "JGit"],
"JGit", "Technology", ["JGit"],
];

// Add quick component links on the search page ("<name>", ["<component1>", "<component2>", ...] pairs):
var queryComponents= [
"UI", ["UI"],
" & IDE", ["UI", "IDE"],
];

// Add tags to categorize bugs within a component:
var categories= new Array();
categories["Text"]= [
"[api]",
"[BiDi]",
"[block selection]",
"[breadcrumb]",
"[compare]",
"[content assist]",
"[correction]",
"[dnd]",
"[encoding]",
"[find/replace]",
"[formatting]",
"[Graphics]",
"[help]",
"[hovering]",
"[implementation]",
"[javadoc]",
"[key binding]",
"[language family]",
"[linked mode]",
"[navigation]",
"[painting]",
"[preferences]",
"[printing]",
"[projection]",
"[quick diff]",
"[RCP]",
"[reconciling]",
"[rulers]",
"[save actions]",
"[spell checking]",
"[syntax highlighting]",
"[templates]",
"[templates view]",
"[typing]",
"[validateEdit]",
"[wording]",
];
categories["Text"].url= "http://www.eclipse.org/eclipse/platform-text/development/bug-annotation.htm";

categories["JDT"]= [
"[1.9]",
"[1.8]",
"[1.7]",
"[5.0]",
"[actions]",
"[api]",
"[ast rewrite]",
"[BiDi]",
"[browsing]",
"[build path]",
"[call hierarchy]",
"[ccp]",
"[change method signature]",
"[clean up]",
"[code style]",
"[code templates]",
"[common navigator]",
"[compare]",
"[convert anonymous]",
"[convert local]",
"[create on paste]",
"[dnd]",
"[encapsulate field]",
"[expand selection]",
"[expressions]",
"[extract constant]",
"[extract interface]",
"[extract local]",
"[extract method]",
"[extract superclass]",
"[generalize type]",
"[generate constructor]",
"[generate delegate]",
"[getter setter]",
"[Graphics]",
"[hashcode/equals]",
"[imports on paste]",
"[infer type arguments]",
"[inline]",
"[introduce factory]",
"[introduce indirection]",
"[introduce parameter]",
"[jar exporter]",
"[javadoc wizard]",
"[JUnit]",
"[JUnit 5]",
"[ltk]",
"[mark occurrence]",
"[migrate jar]",
"[move member type]",
"[move method]",
"[move static members]",
"[nls tooling]",
"[open type]",
"[organize imports]",
"[override method]",
"[package explorer]",
"[plan item]",
"[preferences]",
"[pull up]",
"[push down]",
"[quick assist]",
"[quick fix]",
"[refactoring]",
"[rename]",
"[render]",
"[reorg]",
"[search]",
"[surround with try/catch]",
"[toString]",
"[type hierarchy]",
"[type wizards]",
"[use supertype]",
"[working sets]",
];
categories["JDT"].url= "http://www.eclipse.org/jdt/ui/doc/bug-annotation.php";

var assignToSymbol = "&#x261A;"; //BLACK LEFT POINTING INDEX
//var assignToSymbol = "&#x25C1;"; //White triangle left
//var assignToSymbol = "&#x25C0;"; //Black triangle left
//var assignToSymbol = "&#x2318;"; //PLACE OF INTEREST SIGN
//var assignToSymbol = ":=";
//var assignToSymbol = "&#x21b0;"; //Upwards Arrow With Tip Leftwards
//var assignToSymbol = "&#x270D;"; //WRITING HAND
//var assignToSymbol = "&#x270E;"; //LOWER RIGHT PENCIL
//var assignToSymbol = "&#x1f4bb;"; //Computer
//var assignToSymbol = "&#x21F1;"; //North west arrow to corner
//var assignToSymbol = "&#x25C6;"; //Black diamond
//var assignToSymbol = "&#x1f448;"; //Left white hand pointing index (not available on Ubuntu up to 14.04)
//	// not supported:
//var assignToSymbol = "&#x23FA;"; //Black Circle for Record
//var assignToSymbol = "&#x1F844;"; //Leftwards Heavy Arrow
//var assignToSymbol = "&#x1F87C;"; //Wide-Headed North West Heavy Barb Arrow
//var assignToSymbol = "&#x1F884;"; //Wide-Headed North West Very Heavy Barb Arrow

var searchSymbol = "&#x1F50E;"; //RIGHT-POINTING MAGNIFYING GLASS
// Fix bad "emoticon" icon in FF 50:
//  https://bugzilla.mozilla.org/show_bug.cgi?id=1231701 Use EmojiOne by default
//  https://bugzilla.mozilla.org/show_bug.cgi?id=1321586 How to go back to previous emoji set 
var searchSymbolStyle = "font-family: Segoe UI Emoji, Segoe UI Symbol, sans-serif;"

// Various CSS fixes:
var css =
	// Fix baseline of labels:
	      ".field_label { padding-top: .25em; padding-bottom: .3em; }\n"
	// Fix colors in title:
	    + "#titles a { color: #039 ! important; }\n"
	    + "#titles a:visited { color: #636 ! important; }\n"
	    + "#titles a:hover { color: #333 ! important; }\n"
	    + "#titles a:active { color: #000 ! important; }\n"
	    + "#titles { background-color: #C0C0C0; color: #000000; }\n"
	// Decrease height of title:
	    + "#titles { padding-top: 0.3em; padding-bottom: 0.3em; }\n"
	    + "#titles span { padding-top: 0em ! important; padding-bottom: 0em ! important; }\n"
	// Fix color of comment number:
	    + ".bz_comment_number { color: #65379c; }\n"
	// Fix bg color of enhancements in bug lists, see https://bugs.eclipse.org/bugs/show_bug.cgi?id=331415 :
	    + ".bz_enhancement { background-color: #FFFFFF ! important; }\n"
	    + ".bz_row_odd { background-color: #F7F7F7 ! important; }\n"
	    
	// Don't wrap headers in bug lists, see https://bugs.eclipse.org/bugs/show_bug.cgi?id=333392#c4 :
	    + "tr.bz_buglist_header th a { white-space: nowrap; }\n"
	// Remove disgusting underlines:
	    + "td.bz_short_desc_column a { text-decoration: none; }\n"
	    + "td.bz_short_desc_column a:hover { text-decoration: underline; }\n"
	// Highlight row background on hover:
	//    + "tr.bz_bugitem:hover { background-color: #CCCCFF; ! important }" // doesnt work, since other rules are more important...
	
	// Fix attachments table width:
	    + "#attachment_table { width: auto ! important; }\n"
	// Make "Show Obsolete" more prominent:
	    + ".bz_attach_view_hide { font-weight: bold ! important; color: red ! important; }\n"
	// Always show vertical scroll bar for Description field (gives proper wrapping-preview for short comments):
	    + "#comment { overflow-y:scroll; }\n"
	// Render <button> like <input>:
	    + "button { font-family: Verdana, sans-serif; font-size: small; }\n"
	// Make auto-complete drop-downs look like drop-downs:
	    + ".yui-ac-content { box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.8); }\n"
	// Don't fill whole line with email field on bug page (Bugzilla sets to 100% which makes quick links wrap):
	    + ".bz_userfield { width: 300px; }\n"
	    
	// Search field dimensions:
	    + ".search_field_grid select { height: 19ex ! important; width: 12em ! important; }\n"
	    + ".search_field_grid { margin-top: 0em; }\n"
	    + ".search_email_fields { width: 365px; }\n"
	    + "#field_label_short_desc { width: auto; }\n"
	// Don't waste another line for Search > Bugs numbered:
	    + "#bug_id_container .field_help { display:inline; }\n"
	
	// Don't show "Add Me to the CC List" button in "Possible Duplicates" on enter_bug.cgi:
	    + ".yui-dt-col-update_token { display: none; }\n"
	
	// De-colorize CLA flags until hovered, and fix baseline: (partially fixed via bug 498088 comment 14)
	    + ".cla_dec { filter: sepia(1); opacity: 0.33; vertical-align: bottom; }\n"
	    + ".cla_dec:hover { filter: none; opacity: 1.0; }\n"
	
	// "See Also" list: Avoid jagged "Remove" checkboxes and move them out of the way
	    + "#field_container_see_also ul li:hover { background-color:#F4F4F4 }\n"
	    + "#field_container_see_also ul li:hover label { background-color:#F4F4F4 }\n"
	    + "#field_container_see_also ul li label { position:absolute; right:16px; background-color:white }\n"
	
	// CSS for "toggle wide comments"
	    + ".wide { width: 100%; }\n"
	
	// Fix font of <select> elements:
	//     Workaround for https://bugzilla.mozilla.org/show_bug.cgi?id=1123654 / https://bugzilla.mozilla.org/show_bug.cgi?id=1194055
	//     Firefox 40 changed the default font for <select> to the OS default font ("Tahoma" for me), but not using the OS default font size.
	//     Firefox <= 39 used "MS Sans Serif". Tahoma 10 is very ugly. Let's just inherit the page font:
		+ "select { font-family: inherit; }\n"

	;

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith#Polyfill for Chromium 37 on Ubuntu 12.04:
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

// Features like short bug links (https://bugs.eclipse.org/123456), quick links for product, component, target milestone, etc. only
// make sense in the main Eclipse Bugzilla install. Disable them in other Bugzillas, where the rest of the script still works fine.
var isBugsEclipseOrg= location.href.startsWith("https://bugs.eclipse.org/bugs/");
	
// --- /Configurable options ------------------------------------------

if (typeof GM_getResourceText !== "undefined") { // GM_getResourceText is not available in Google Chrome, so let's go with the defaults.
	var config = GM_getResourceText("config");
	eval(config);
}

//----------- Functions:
function hideElem(id) {
    var elem= document.getElementById(id);
    if (elem) {
        elem.setAttribute("class", "bz_default_hidden");
    }
    return elem;
}

function showElem(id) {
    var elem= document.getElementById(id);
    if (elem) {
        elem.removeAttribute("class");
    }
    return elem;
}

function fixCheckboxField(containerId, inputId, labelText) {
	hideElem(containerId);
	var inputIdElem= showElem(inputId);
	if (inputIdElem) {
		inputIdElem.removeChild(inputIdElem.getElementsByTagName("br")[0]);
		inputIdElem.getElementsByTagName("label")[0].textContent= labelText;
		inputIdElem.firstElementChild.setAttribute("style", "margin-right: 1em");
	}
}

function addLink(name, href, parentElem, tooltip, separator) {
// console.debug(name + "," + href + "," + tooltip + "," + separator);
    var linkElem= document.createElement("a");
    linkElem.href= href;
    linkElem.innerHTML= name;
    if (tooltip) {
        linkElem.title= tooltip;
    }
    if (parentElem.hasChildNodes()) {
        if (separator == false) {
            //nop
        } else if (typeof separator == "string") {
            parentElem.appendChild(document.createTextNode(separator));
        } else {
            parentElem.appendChild(document.createTextNode(" | "));
        }
    }
    parentElem.appendChild(linkElem);
    return linkElem;
}

function addMultiLink(name, onClick, onModifierClick, parentElem, tooltip, separator) {
    var linkElem= document.createElement("a");
    var href= 'javascript:'
            + 'var modClick= event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || event.button == 1;'
            + 'if (modClick) {'
            +   onModifierClick
            + '} else {'
            +   onClick
            + '}'
            + 'return false;';
    linkElem.setAttribute("onmouseup", href);
    linkElem.setAttribute("onclick", "return false;"); // blocks Ctrl+Click from opening a new tab (but not middle-click)
    linkElem.href= "javascript:void('Modifier+Click to toggle')";
    linkElem.innerHTML= name;
    if (tooltip) {
        linkElem.title= tooltip;
    }
    if (parentElem.hasChildNodes() && !(separator == false)) {
        parentElem.appendChild(document.createTextNode(" | "));
    }
    parentElem.appendChild(linkElem);
}

function addStatusLink(name, status, resolution, parentElem) {
    var href= 'javascript:document.getElementById("bug_status").value="' + status + '";';
    href += 'showHideStatusItems("",["",""]);';
    if (resolution) {
        href += 'document.getElementById("resolution").value="' + resolution + '";';
    }
    href += 'document.getElementById("assigned_to").focus();'
            + 'document.getElementById("assigned_to").select();'
            + 'void(0);';
    addLink(name, href, parentElem);
}

var addOldAssigneeAsCcScript=
              'var assignee= document.getElementById("assigned_to").value;'
            + 'var newccElem= document.getElementById("newcc");'
            + 'if (assignee.search(/(?:inbox|triaged)@eclipse.org/i) == -1' // don't copy inbox
            + '      && assignee.match(/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/)'   // don't copy incomplete addresses
            + '      && !newccElem.value.includes(assignee)) {' // don't copy if already there
            + '  newccElem.value= assignee + ", " + newccElem.value;'
            + '  newccElem.focus();'
            + '  newccElem.selectionStart= 0;'
            + '  newccElem.selectionEnd= assignee.length + 2;'
            + '}';

function getAssigneeLinkScript(email) {
    return 'javascript:'
            + addOldAssigneeAsCcScript
            + 'assignTo("' + email + '");'
            + 'void(0);';
}

function addAssigneeLink(name, email, parentElem) {
	var href= getAssigneeLinkScript(email);
    addLink(name, href, parentElem, email);
}

function addCcLink(name, email, parentElem, fieldName) {
    var href= 'javascript:document.getElementById("' + fieldName + '").value="' + email + ', " + document.getElementById("' + fieldName + '").value;'
            + 'document.getElementById("' + fieldName + '").focus();'
            + 'document.getElementById("' + fieldName + '").selectionStart= 0;'
            + 'document.getElementById("' + fieldName + '").selectionEnd= ' + (email.length + 2) + ';'
            + 'void(0);';
    addLink(name, href, parentElem, email);
}

function addRequesteeLink(name, email, parentElem, fieldId) {
    var href= 'javascript:document.getElementById("' + fieldId + '").value="' + email + '";'
            + 'document.getElementById("' + fieldId + '").focus();'
            + 'void(0);';
    addLink(name, href, parentElem, email);
}

function addProductLink(name, parentElem) {
    var href= 'javascript:'
			+ addOldAssigneeAsCcScript
            + 'document.getElementById("product").value="' + name + '";'
            + 'document.getElementById("set_default_assignee").checked= true;'
            + 'document.getElementById("addselfcc") != null ? document.getElementById("addselfcc").checked= true : "";'
            + 'YAHOO.util.Dom.setStyle(document.getElementById("set_default_assignee_label"), "font-weight", "bold");'
            + 'document.getElementById("product").focus();'
            + 'void(0);';
    addLink(name, href, parentElem);
}

function addComponentLink(name, parentElem) {
    var href= 'javascript:'
			+ addOldAssigneeAsCcScript
            + 'document.getElementById("component").value="' + name + '";'
            + 'document.getElementById("set_default_assignee").checked= true;'
            + 'YAHOO.util.Dom.setStyle(document.getElementById("set_default_assignee_label"), "font-weight", "bold");'
            + 'document.getElementById("component").focus();'
            + 'void(0);';
    addLink(name, href, parentElem);
}

function addPlatformLink(parentElem, name, hardware, os) {
    var href= 'javascript:document.getElementById("rep_platform").value="' + hardware + '";'
            + 'document.getElementById("op_sys").value="' + os + '";'
            + 'void(0);';
    addLink(name, href, parentElem);
}

function addSearch_email_fieldsLinks(emailElemName, myMail) {
	var emailElem= document.getElementById(emailElemName);
	if (emailElem) {
	    emailElem.setAttribute("style", "width: 100%");
	    var emailtypeElems= emailElem.parentNode.getElementsByTagName("select");
	    if (!(emailtypeElems && emailtypeElems[0])) { // intermediate <div id="email1_autocomplete" class="yui-ac">
	        emailtypeElems= emailElem.parentNode.parentNode.getElementsByTagName("select");
	        emailElem.parentNode.setAttribute("style", "width: 100%");
	    }
	    if (emailtypeElems && emailtypeElems[0]) {
	        var emailtypeElem= emailtypeElems[0];
	        
			var sp= document.createElement("span");
			emailtypeElem.parentNode.insertBefore(sp, emailtypeElem.nextElementSibling);
			if (myMail) {
		        addEmailLink("me", myMail, emailElemName, sp);
			}
		    for (var i= 0; i < ccs.length; i= i+2) {
		        addEmailLink(ccs[i], ccs[i + 1], emailElemName, sp);
		    }
			emailtypeElem.parentNode.insertBefore(document.createElement("br"), emailtypeElem.nextElementSibling.nextElementSibling);
	        
	    }
		
		// Add "None" and "All" links after "Any of:" labels:
		var sp= document.createElement("span");
		sp.style.marginLeft= ".5em";
		emailElem.parentNode.insertBefore(sp, emailElem.parentNode.firstElementChild);
		var noneHref= 'javascript:'
					+ 'var emailElem= document.getElementById("' + emailElemName + '");'
					+ 'var allInputs= emailElem.parentNode.getElementsByTagName("input");'
					+ 'for (var i= 0; i < allInputs.length; i++) {'
					+ '  var inputElem= allInputs[i];'
					+ '  if (inputElem.type == "checkbox") {'
					+ '    inputElem.checked= false;'
					+ '  }'
					+ '}'
					+ 'void(0);';
		addLink("&empty;", noneHref, sp, "select none", false);
		var allHref= 'javascript:'
					+ 'var emailElem= document.getElementById("' + emailElemName + '");'
					+ 'var allInputs= emailElem.parentNode.getElementsByTagName("input");'
					+ 'for (var i= 0; i < allInputs.length; i++) {'
					+ '  var inputElem= allInputs[i];'
					+ '  if (inputElem.type == "checkbox") {'
					+ '    inputElem.checked= true;'
					+ '  }'
					+ '}'
					+ 'void(0);';
		addLink("All", allHref, sp, null, true);
	}
}

function addEmailLink(name, email, emailElemName, parentElem) {
    var href= 'javascript:document.getElementsByName("' + emailElemName + '")[0].value="' + email + '";'
            + 'document.getElementsByName("' + emailElemName + '")[0].focus();'
            + 'void(0);';
    addLink(name, href, parentElem, email);
}

function addFromDateLink(parentElem, value, name) {
    if (!name)
        name = value;
    var href= 'javascript:document.getElementById("chfieldfrom").value="' + value + '";'
            + 'document.getElementById("chfieldfrom").focus();'
            + 'void(0);';
    addLink(name, href, parentElem);
}

function addFixedInTargetLink(parentElem, target_milestone) {
    var href= 'javascript:document.getElementById("target_milestone").value="' + target_milestone + '";'
            + 'document.getElementById("bug_status").value="RESOLVED";'
            + 'document.getElementById("resolution").value="FIXED";'
            + 'showHideStatusItems("", ["",""]);'
            + 'document.getElementById("assigned_to").focus();'
            + 'document.getElementById("assigned_to").select();';
            + 'void(0);';
    addLink("(in " + target_milestone + ")", href, parentElem);
}

function addTargetLink(parentElem, milestone) {
    var onModifierClick=
              'if (!document.getElementById("assigned_to")) {'
            +   'var target_milestoneElem= document.getElementById("target_milestone");'
            +   'target_milestoneOptions= target_milestoneElem.options;'
            +   'for (var i= 0; i < target_milestoneOptions.length; i++) {'
            +     'if (target_milestoneOptions[i].text == "' + milestone + '") target_milestoneOptions[i].selected= !target_milestoneOptions[i].selected;'
            +   '}'
            + '}';

    var onClick=
              'var target_milestoneElem= document.getElementById("target_milestone");'
            + 'target_milestoneElem.value="' + milestone + '";'
            + 'target_milestoneElem.focus();';
    
    addMultiLink(milestone, onClick, onModifierClick, parentElem);
}

function createFieldLabelClearAndQuickLinkSpan(fieldLabelElem, fieldId) {
	fieldLabelElem.firstElementChild.firstElementChild.setAttribute("style", "display: inline;");
	fieldLabelElem.setAttribute("style", "text-align: left;");

	var spanElem= document.createElement("span");
//	spanElem.style.marginLeft= ".5em";
	spanElem.style.fontWeight= "normal";
	var href= 'javascript:var fieldElem= document.getElementById("' + fieldId + '");'
			+ 'fieldElem.selectedIndex= -1;'
			+ 'fieldElem.focus();'
			+ 'bz_fireEvent(fieldElem, "change");;'
			+ 'void(0);';
	addLink("&empty;", href, spanElem, "select none", false);
	spanElem.appendChild(document.createTextNode(" "));
	
	fieldLabelElem.firstElementChild.appendChild(spanElem);
	return spanElem;
}

function addQueryClassificationsLink(parentElem, classifications, products, name) {
    var href= 'javascript:var classificationElem= document.getElementById("classification");'
        + '    classificationElem.selectedIndex= -1;'
        + '    var classificationOptions= document.getElementById("classification").options;';
    
    for (var i = 0; i < classifications.length; i++) {
        href += 'for (var i = 0; i < classificationOptions.length; i++) {'
              + '    if (classificationOptions[i].text == "' + classifications[i] + '") classificationOptions[i].selected= true'
              + '}';
    }
    href += 'bz_fireEvent(classificationElem, "change");'
          + 'var productElem= document.getElementById("product");'
    if (products.length > 0) {
        href += 'productElem.value="' + products[0] + '";';
        for (var i = 0; i < products.length; i++) {
            href += 'var productOptions= productElem.options;'
                  + 'for (var i = 0; i < productOptions.length; i++) {'
                  + '    if (productOptions[i].text == "' + products[i] + '") productOptions[i].selected= true'
                  + '}';
        }
        href += 'bz_fireEvent(productElem, "change");';
    }
    href+= 'void(0);';
    addLink(name, href, parentElem, classifications, false);
}

function addQueryProductsLink(parentElem, classification, products, name) {
    var href= 'javascript:var classificationElem= document.getElementById("classification");'
            + 'classificationElem.value="' + classification + '";'
            + 'bz_fireEvent(classificationElem, "change");'
            + 'var productElem= document.getElementById("product");'
            + 'productElem.value="' + products[0] + '";';
    
    for (var i = 0; i < products.length; i++) {
        href += 'var productOptions= productElem.options;'
              + 'for (var i = 0; i < productOptions.length; i++) {'
              + '    if (productOptions[i].text == "' + products[i] + '") productOptions[i].selected= true'
              + '}';
    }
    href += 'bz_fireEvent(productElem, "change");'
            + 'void(0);';
    addLink(name, href, parentElem, products, false);
}

function addQueryComponentsLink(parentElem, components, name) {
    var href= 'javascript:document.getElementById("component").selectedIndex= -1;'
        + '    var componentOptions= document.getElementById("component").options;';
    
    for (var i = 0; i < components.length; i++) {
        href += 'for (var i = 0; i < componentOptions.length; i++) {'
              + '    if (componentOptions[i].text == "' + components[i] + '") componentOptions[i].selected= true'
              + '}';
    }
    href += 'void(0);';
    addLink(name, href, parentElem, components, false);
}

function addQueryStatusesLink(parentElem, statuses, name) {
    var onClick=
          'document.getElementById("bug_status").selectedIndex= -1;'
        + 'var bug_statusOptions= document.getElementById("bug_status").options;';
    for (var i = 0; i < statuses.length; i++) {
        onClick+=
          'for (var i = 0; i < bug_statusOptions.length; i++) {'
        + '    if (bug_statusOptions[i].text == "' + statuses[i] + '") bug_statusOptions[i].selected= true;'
        + '};';
    }
    
    var onModifierClick=
          'var bug_statusOptions= document.getElementById("bug_status").options;';
    for (var i = 0; i < statuses.length; i++) {
        onModifierClick+=
          'for (var i = 0; i < bug_statusOptions.length; i++) {'
        + '  if (bug_statusOptions[i].text == "' + statuses[i] + '") bug_statusOptions[i].selected= !bug_statusOptions[i].selected;'
        + '};';
    }
    
    addMultiLink(name, onClick, onModifierClick, parentElem, null, false);
}

function addQueryVersionsLink(parentElem, version) {
    var onClick= 'javascript:document.getElementById("version").selectedIndex= -1;'
        + '    var versionOptions= document.getElementById("version").options;'
        + 'for (var i = 0; i < versionOptions.length; i++) {';

    if (version.charAt(version.length - 1) == "*")
        onClick += 'if (versionOptions[i].text.substring(0, ' + (version.length - 2) + ') == "' + version.substring(0, version.length - 2) + '") versionOptions[i].selected= true;';
    else
        onClick += 'if (versionOptions[i].text == "' + version + '") versionOptions[i].selected= true;';

    onClick += '}'
        +'void(0);';
    
    
    var onModifierClick= 'javascript:var versionOptions= document.getElementById("version").options;'
        + 'for (var i = 0; i < versionOptions.length; i++) {';

    if (version.charAt(version.length - 1) == "*")
        onModifierClick += 'if (versionOptions[i].text.substring(0, ' + (version.length - 2) + ') == "' + version.substring(0, version.length - 2) + '") versionOptions[i].selected= !versionOptions[i].selected;';
    else
        onModifierClick += 'if (versionOptions[i].text == "' + version + '") versionOptions[i].selected= !versionOptions[i].selected;';

    onModifierClick += '}'
        +'void(0);';
        
        
    addMultiLink(version, onClick, onModifierClick, parentElem);
}

function addQueryOSLink(parentElem, oses, name) {
    var onClick=
          'document.getElementById("op_sys").selectedIndex= -1;'
        + 'var op_sysOptions= document.getElementById("op_sys").options;';
    for (var i = 0; i < oses.length; i++) {
        onClick+=
          'for (var i = 0; i < op_sysOptions.length; i++) {'
        + '    if (op_sysOptions[i].text.indexOf("' + oses[i] + '") == 0) op_sysOptions[i].selected= true;'
        + '};';
    }
    
    var onModifierClick=
          'var op_sysOptions= document.getElementById("op_sys").options;';
    for (var i = 0; i < oses.length; i++) {
        onModifierClick+=
          'for (var i = 0; i < op_sysOptions.length; i++) {'
        + '  if (op_sysOptions[i].text.indexOf("' + oses[i] + '") == 0) op_sysOptions[i].selected= !op_sysOptions[i].selected;'
        + '};';
    }
    
    addMultiLink(name, onClick, onModifierClick, parentElem, null, true);
}

function setOptionSize(elementId, size) {
    var elem= document.getElementById(elementId);
    if (elem) {
        elem.setAttribute("size", size);
    }
}

function setAccessKey(elementId, key) {
    var elem= document.getElementById(elementId);
    if (elem) {
        elem.setAttribute("accesskey", key);
    }
}

function createCategoriesChooser(component, categories) {
	var categoriesElem= document.createElement("select");
	categoriesElem.setAttribute("name", ""); // empty name => field will not be submitted with enclosing form
	categoriesElem.setAttribute("onchange", 
		"var form= document.changeform;" +
		"if (!form) { form= document.queryform; }" +
		"if (!form) { form= document.Create; }" +
		"if (this.value[0] != '[') {" +
		"    if (this.value == '-- clear categories --') {" +
		"        form.short_desc.value= form.short_desc.value.replace(/^(\\[[\\w \\.]*\\]\\s*)+/, '');" +
		"    }" +
		"    return;" +
		"}" +
		"var cat= this.value.substring(1);" +
		"var regex= /^\s*\\[([\\w \\.]*)\\]/y;" +
		"var match;" +
		"var lastEnd= 0;" +
		"while (true) {" +
		"    match= regex.exec(form.short_desc.value);" +
		"    if (match == null || match[1].localeCompare(cat, 'en', {sensitivity: \"base\"}) > 0) {" +
		"        var space= (match == null && lastEnd == 0) ? ' ' : '';" +
		"        form.short_desc.value= form.short_desc.value.substring(0, lastEnd) + this.value + space + form.short_desc.value.substring(lastEnd);" +
		"        return;" +
		"    } else {" +
		"        lastEnd= regex.lastIndex;" +
		"    }" +
		"}"
	);
	var allCategories= [
"-- " + component + " category --",
"-- clear categories --"
];
    allCategories= allCategories.concat(categories);
	for (var k= 0; k < allCategories.length; k++) {
		var newOption= document.createElement("option");
		var categoriesName= allCategories[k];
		newOption.setAttribute("value", categoriesName);
		newOption.innerHTML = categoriesName.substring(1, categoriesName.length - 1);
		categoriesElem.appendChild(newOption);
	}
	return categoriesElem;
}

function createCategoryChoosers() {
	var choosers= document.createElement("span");
	for (var component in categories) {
	    addLink(component + ":", categories[component].url, choosers);
		choosers.appendChild(document.createTextNode(" "));
	    choosers.appendChild(createCategoriesChooser(component, categories[component]));
    }
	return choosers;
}

function createCommentTemplateLinks() {
	// Add links to help enter a URL to a Git commit:
	var pElem= document.createElement("p");
	pElem.style.marginLeft= "1em";
	pElem.style.lineHeight= "2em";
	pElem.appendChild(document.createElement("br"));
	for (var i = 0; i < commentTemplates.length; i+= 2) {
        var aElem= document.createElement("a");
		aElem.appendChild(document.createTextNode(commentTemplates[i]));
        aElem.href='javascript:var cElem=document.getElementById("comment");'
            + 'var s= cElem.selectionStart;var e= cElem.selectionEnd;'
            + 'var url= "' + commentTemplates[i + 1] + '";'
            + 'cElem.value= cElem.value.substring(0, s) + url + cElem.value.substring(e, cElem.value.length);'
            + 'cElem.focus();cElem.selectionStart= s + url.length;cElem.selectionEnd= cElem.selectionStart;'
            + 'void(0);';
        aElem.title= "Insert comment template at caret";
		pElem.appendChild(aElem);
		pElem.appendChild(document.createElement("br"));
    }
    return pElem;
}

function setCommitElemNameTitleShortcut(commitElem) {
	commitElem.setAttribute("title", window.navigator.platform.match("Mac") ? "[Command+S]" : "[Ctrl+S]");
	commitElem.innerHTML= "Sa<u>v</u>e&nbsp;Changes";
	commitElem.setAttribute("accesskey", "v");
}

function createScript(script) {
	var scriptElem= document.createElement("script");
	scriptElem.type= "text/javascript";
	scriptElem.innerHTML= script;
	return scriptElem;
}

function escapeHtml(text) {
	if (typeof text === "boolean") {
		return text;
	} if (typeof text != "string") {
		return "";
	}
	var r = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	};
	return text.replace(/[&<>"']/g, function(i) { return r[i]; });
}

function getAppendGerritStatusFunction(link) {
	return function (res) {
		var myElem= document.createElement("a");
		myElem.href= link.href;
		myElem.style.marginLeft= "1em";
		
		var jsonText= res.responseText.substr(5);
		var json= JSON.parse(jsonText);
		myElem.textContent= escapeHtml(json.status)
				+ (json.mergeable ? " (mergeable) " : " ")
				+ escapeHtml(json.project)
				+ " [" + escapeHtml(json.branch) + "]"
		;
		myElem.title=
				  "Owner: " + escapeHtml(json.owner.name) + "<" + escapeHtml(json.owner.email) + ">\n"
				+ "Updated: " + escapeHtml(json.updated) + "\n"
				+ "Branch: " + escapeHtml(json.branch) + "\n"
				+ "Change-Id: " + escapeHtml(json.change_id) + "\n"
				+ "Subject: " + escapeHtml(json.subject) + "\n"
		;
//		myElem.title+= jsonText;
		
		link.parentNode.insertBefore(myElem, link.nextSibling);
	};
}

function addSaveShortcutCtrlS(form) {
	var scriptElem= createScript(
		'document.addEventListener("keydown", function(e) {\n'
		+ '  if ((window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey) && e.keyCode == 83) {\n'
		+ '    e.preventDefault();\n'
		+ '    document.getElementById("' + form + '").submit();\n'
		+ '  }\n'
		+ '}, false);\n'
	);
	document.getElementsByTagName("head")[0].appendChild(scriptElem);
}

//-----------

//----------- Start the real work

function main() { // GM 1.0 belches for "return" outside of function, see http://www.greasespot.net/2012/08/greasemonkey-10-release.html

console.log("Running jdtbugzilla.user.js on " + window.location);

// Don't run in frames or iframes:
if (window.top != window.self) {
    return;
}

var isLocalQuery = window.location.pathname.match(/\/Search%20for%20bugs\.htm/i);

// Remove Eclipse ads:
// old school:
var bannerElem= document.getElementById("banner");
if (bannerElem) {
    bannerElem.parentNode.removeChild(bannerElem);
} else {
    // for solstice (bug 437404):
    var headerElems= document.evaluate("//header[@role='banner']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < headerElems.snapshotLength; i++) {
        var headerElem= headerElems.snapshotItem(i);
        headerElem.parentNode.removeChild(headerElem);
    }
}
var headerIconsElem= document.getElementById("header-icons");
if (headerIconsElem) {
    headerIconsElem.parentNode.removeChild(headerIconsElem);
}

// Identify ourselves:
var headerElem= document.getElementById("common_links");
if (!headerElem) { // Bugzilla < 5.0
	headerElem= document.getElementById("header");
}
if (headerElem && headerElem.lastElementChild) {
    var ver= "";
    if (typeof GM_info !== "undefined") {
        ver= GM_info.script.version;
    }
    console.log(ver);
	if (isLocalQuery) {
		headerElem.lastElementChild.innerHTML +=
			' <span class="separator">| </span><li>not <a href="https://bugs.eclipse.org/bugs/query.cgi">live</a>!</li>';
	} else {
		headerElem.lastElementChild.innerHTML +=
			'<span class="separator">| </span><li><a href="https://www.eclipse.org/jdt/ui/scripts/jdtbugzilla.user.js" '
			+ 'title="Page tweaked by jdtbugzilla.user.js ' + ver + '" >Tweaked</a>!</li>';
	}
}

var headElem= document.getElementsByTagName("head")[0];
if (headElem) {
	// Various CSS fixes:
	var styleElem= document.createElement("style");
	styleElem.type= "text/css";
	styleElem.innerHTML = css;
	headElem.appendChild(styleElem);
	
	if (isLocalQuery) {
		// Set a base href to make <form method="post" action="buglist.cgi" id="queryform" ...> work in a local copy of the search page:
		var baseElem= document.createElement("base");
		baseElem.href= "http://bugs.eclipse.org/bugs/";
		headElem.appendChild(baseElem);
		return; // early return
	}
}

// Add "Hide" link to info message, see https://bugs.eclipse.org/bugs/show_bug.cgi?id=333403
//   The "Hide" link stores the last hidden message in localStorage => Only hides this exact message in this browser.
//   To show it again, execute localStorage.clear(); in a bug page.
var messageElem= document.getElementById("message");
if (messageElem && messageElem.textContent) {
	var key= "message.suppressed";
	var msgString= JSON.stringify(messageElem.textContent);
	if (localStorage[key] == msgString) {
		messageElem.parentNode.removeChild(messageElem);
	} else {
		messageElem.appendChild(document.createTextNode(" "));
		// Don't rename hideMessageElem to hideElem. JavaScript is a "language" from hell. See function hideElem().
		var hideMessageElem= addLink("Hide", "javascript:void(0)", messageElem, "Hide this message", false);
		hideMessageElem.setAttribute("onclick" , "localStorage['" + key + "']='" + msgString + "';this.parentNode.parentNode.removeChild(this.parentNode);return false;");
	}
}

// Add shortcut to set Platform to All/All:
var rep_platformElem= document.getElementById("rep_platform");
var op_sysElem= document.getElementById("op_sys");
if (rep_platformElem && op_sysElem && ! window.location.pathname.match(/.*query\.cgi/)) {
	var platformLinkSpanElem= document.createElement("span");
	platformLinkSpanElem.style.marginLeft= "1em";
	op_sysElem.parentNode.insertBefore(platformLinkSpanElem, op_sysElem.nextSibling);
	
    var href= 'javascript:document.getElementById("rep_platform").value="All";'
            + 'document.getElementById("op_sys").value="All";'
            + 'void(0);';
    addLink("All", href, platformLinkSpanElem);
    
	for (var i= 0; i < platforms.length; i+= 3) {
		addPlatformLink(platformLinkSpanElem, platforms[i], platforms[i+1], platforms[i+2]);
	}
}

var noWrapLinesRegex = /^(\s*(?:\[\w+\]\s*)?(?:at \S+(?:\(Native Method\)|\(Unknown Source\))?|- locked <0x[0-9a-fA-F]+> \(a \S+))$/m;

// Fix the "Comment" field size (too small on the "Attachment Details" page,
//     default cols=80 is too narrow for proper wrapping preview):
var commentElem= document.getElementById("comment");
if (commentElem) {
    commentElem.setAttribute("rows", "10");
    commentElem.setAttribute("cols", "81");
    commentElem.setAttribute("onFocus", "this.rows=25");

	// Fix line wrapping for links in reply comments, see https://bugzilla.mozilla.org/show_bug.cgi?id=810801 :
	
	// This script is a copy of the original wrapReplyText function in comments.js
	// (with string delimiters regularized to ' , \ replaced by \\, and surrounded with '+ "' ... '\n"'):
	
	// TODO: should not wrap at the space between "bug 1234".
	// Fix idea: instead of cutting hard, use a regex like this:
	// ^.{0,80}\s(?<![Bb]ug\s)(?!\s*\d+)
	// Note that this still wouldn't completely fix "bug 1234 comment 1".
	var script= ""
+ "function wrapReplyText(text) {\n"
+ "    // This is -3 to account for '\\n> '\n"
+ "    var maxCol = BUGZILLA.constant.COMMENT_COLS - 3;\n"
+ "    var text_lines = text.replace(/[\\s\\n]+$/, '').split('\\n');\n"
+ "    var wrapped_lines = new Array();\n"
+ "\n"
+ "    for (var i = 0; i < text_lines.length; i++) {\n"
+ "        var paragraph = text_lines[i];\n"
+ "        // Don't wrap already-quoted text.\n"
+ "        if (paragraph.indexOf('>') == 0) {\n"
+ "            wrapped_lines.push('> ' + paragraph);\n"
+ "            continue;\n"
+ "        }\n"
// avoid wrapping noWrapLinesRegex:
+ "        if (paragraph.match(" + noWrapLinesRegex + ")) {\n"
+ "            wrapped_lines.push('> ' + paragraph);\n"
+ "            continue;\n"
+ "        }\n"
// END avoid wrapping noWrapLinesRegex.
+ "\n"
+ "        var replace_lines = new Array();\n"
+ "        while (paragraph.length > maxCol) {\n"
+ "            var testLine = paragraph.substring(0, maxCol);\n"
+ "            var pos = testLine.search(/\\s\\S*$/);\n"
+ "\n"
+ "            if (pos < 1) {\n"
// fix:
+ "                if (paragraph.length > maxCol) {\n"
+ "                    pos = maxCol + paragraph.substring(maxCol).search(/\\s\\S*/);\n"
+ "                    if (pos == maxCol - 1) pos = paragraph.length;\n"
+ "                } else {\n"
+ "                    pos = maxCol;\n"
+ "                }\n"
//+ "                // Try to find some ASCII punctuation that's reasonable\n"
//+ "                // to break on.\n"
//+ "                var punct = '\\\\-\\\\./,!;:';\n"
//+ "                var punctRe = new RegExp('[' + punct + '][^' + punct + ']+$');\n"
//+ "                pos = testLine.search(punctRe) + 1;\n"
//+ "                // Try to find some CJK Punctuation that's reasonable\n"
//+ "                // to break on.\n"
//+ "                if (pos == 0)\n"
//+ "                    pos = testLine.search(/[\\u3000\\u3001\\u3002\\u303E\\u303F]/) + 1;\n"
//+ "                // If we can't find any break point, we simply break long\n"
//+ "                // words. This makes long, punctuation-less CJK text wrap,\n"
//+ "                // even if it wraps incorrectly.\n"
//+ "                if (pos == 0) pos = maxCol;\n"
+ "            }\n"
+ "\n"
+ "            var wrapped_line = paragraph.substring(0, pos);\n"
+ "            replace_lines.push(wrapped_line);\n"
+ "            paragraph = paragraph.substring(pos);\n"
+ "            // Strip whitespace from the start of the line\n"
+ "            paragraph = paragraph.replace(/^\\s+/, '');\n"
+ "        }\n"
+ "        replace_lines.push(paragraph);\n"
+ "        wrapped_lines.push('> ' + replace_lines.join('\\n> '));\n"
+ "    }\n"
+ "    return wrapped_lines.join('\\n') + '\\n\\n';\n"
+ "}\n"
;
	commentElem.parentNode.appendChild(createScript(script));
}

// Loop over <label>s:
var labels= document.getElementsByTagName("label");
for (var i= 0; i < labels.length; i++) {
    var labelElem= labels[i];
    var forAtt= labelElem.getAttribute("for");
	// Another Commit button on top of Additional Comments field
    if (forAtt == "comment" && labelElem.nextSibling) {
	    var commitElem= document.createElement("button");
	    commitElem.setAttribute("type", "submit");
	    commitElem.setAttribute("class", "knob-buttons");
		setCommitElemNameTitleShortcut(commitElem);
	    // Caveat: attachment.cgi is used for 3 purposes: add new, edit details, result after adding.
	    // Of course, the "comment" area is implemented differently on each page...
	    labelElem.parentNode.insertBefore(commitElem, labelElem.nextElementSibling);
	
	// Remove label as clickable area for Security_Advisories checkbox on "Verify Version, Component, Target Milestone" page:
    } else if (forAtt == "group_15") {
        labelElem.removeAttribute("for");
    
    // Add common "from" dates:
    } else if (forAtt == "chfieldfrom") {
        addFromDateLink(labelElem, "2h");
        addFromDateLink(labelElem, "1ds", "today");
        addFromDateLink(labelElem, "1d");
        addFromDateLink(labelElem, "2d");
        addFromDateLink(labelElem, "1w");
        addFromDateLink(labelElem, "1m");
        addFromDateLink(labelElem, "3m");
        addFromDateLink(labelElem, "1y");
    
    // Bug 367944: Bug fields doc doesn't describe severity any more:
    } else if (forAtt == "priority" || forAtt == "bug_severity") {
        labelElem.setAttribute("title",
              "- blocker: blocks development and/or testing work\n"
            + "- critical: crashes, loss of data, severe memory leak\n"
            + "- major: major loss of function\n"
            + "- normal: regular issue, some loss of functionality under specific circumstances\n"
            + "- minor: minor loss of function, or other problem where easy workaround is present\n"
            + "- trivial: cosmetic problem like misspelled words or misaligned text\n"
            + "- enhancement: request for enhancement");
         var field_help_linkElems= labelElem.getElementsByClassName("field_help_link");
         if (field_help_linkElems.length > 0) {
             field_help_linkElems[0].removeAttribute("title");
         }
    }
}

// Add quick links for requestee fields:
var requesteeElems= document.getElementsByClassName("requestee");
for (var i = 0; i < requesteeElems.length; i++) {
    var requesteeElem= requesteeElems[i];
    for (var j= 0; j < requestees.length; j= j+2) {
        addRequesteeLink(requestees[j], requestees[j + 1], requesteeElem.parentNode, requesteeElem.id);
    }
}

//----------- Page-specific fixes:

if (window.location.pathname.match(/.*enter_bug\.cgi/)) {
	process_enter_bug();
} else if (window.location.pathname.match(/.*query\.cgi/)) {
	process_query();
} else if (window.location.pathname.match(/.*buglist\.cgi/)) {
	process_buglist();
} else { // For all result pages:
	process_result_pages();
}


function process_enter_bug() {
    // Remove empty <td colspan="2">&nbsp;</td>, <th>&nbsp;</th>, and <td colspan="3" class="comment">We've made a guess at your...:
    var os_guess_noteElem= document.getElementById("os_guess_note");
	if (os_guess_noteElem) {
	    os_guess_noteElem.parentNode.parentNode.removeChild(os_guess_noteElem.parentNode);
	}

	// Add shortcuts to search Product:
	var field_container_productElem= document.getElementById("field_container_product");
	var productElem= document.getElementsByName("product")[0];
	if (field_container_productElem && productElem) {
		var queryLink= addLink(searchSymbol, "query.cgi"
							 + "?product=" + productElem.value
							 , field_container_productElem, "Search in this product", " | (");
		queryLink.style= searchSymbolStyle;
		addLink("1w", "buglist.cgi"
							 + "?product=" + productElem.value
							 + "&chfieldfrom=1w"
							 , field_container_productElem, "Changed in the last 7 days");
		field_container_productElem.appendChild(document.createTextNode(")"));
		
		// Add shortcuts to search Component:
		var field_label_componentElem= document.getElementById("field_label_component");
		var componentElem= document.getElementById("component");
		if (field_label_componentElem && componentElem) {
			var spanElem = document.createElement("span");
			spanElem.setAttribute("style" , "font-weight:normal;");
			
			field_label_componentElem.appendChild(spanElem);
			
			spanElem.appendChild(document.createTextNode("("));
			
			queryLink= addLink(searchSymbol, "query.cgi?product=" + productElem.value
												+ "&component=" + componentElem.value, spanElem, "Search in selected component", false);
			queryLink.setAttribute("id", "queryLink");
			queryLink.style= searchSymbolStyle;
			
			var changedLink= addLink("1w", "buglist.cgi?product=" + productElem.value
												+ "&component=" + componentElem.value
												+ "&chfieldfrom=1w", spanElem, "Changed in the last 7 days");
			changedLink.setAttribute("id", "changedLink");
			spanElem.appendChild(document.createTextNode(")"));

			componentElem.setAttribute("onchange",
				"set_assign_to();"
				
				+ "document.getElementById('queryLink').href=\"query.cgi"
				+ "?product=" + productElem.value
				+ "&component=\"+document.getElementById('component').value;"
				
				+ "document.getElementById('changedLink').href=\"buglist.cgi"
				+ "?product=" + productElem.value
				+ "&component=\"+document.getElementById('component').value+\""
				+ "&chfieldfrom=1w\";"
			);
		}
	}
	
    // Add another Commit button after Subject):
    var short_descElems= document.getElementsByName("short_desc");
    if (short_descElems.length > 0) {
	    var commitElem= document.createElement("button");
	    commitElem.setAttribute("type", "submit");
	    commitElem.setAttribute("tabindex", "99");
	    commitElem.innerHTML= "S<u>u</u>bmit Bug";
	    commitElem.setAttribute("accesskey", "u");
	    var space= document.createTextNode(" ");
	    short_descElems[0].parentNode.insertBefore(space, short_descElems[0].nextSibling);
	    short_descElems[0].parentNode.insertBefore(commitElem, space.nextSibling);
	    short_descElems[0].size= 76;
	    
		commitElem.setAttribute("title", window.navigator.platform.match("Mac") ? "[Command+S]" : "[Ctrl+S]");
		addSaveShortcutCtrlS("Create");

	    // Set initial focus:
	    short_descElems[0].focus();
	    
		var summaryTr= short_descElems[0].parentNode.parentNode;
	    
	    // Move "Possible Duplicates" after "Description":
		var possible_duplicates_containerElem= document.getElementById("possible_duplicates_container");
		var commentElem= document.getElementById("comment");
		if (possible_duplicates_containerElem && commentElem) {
    		commentElem.parentNode.parentNode.parentNode.insertBefore(possible_duplicates_containerElem, commentElem.parentNode.parentNode.nextSibling);
			// Add links to help enter a URL to a Git commit:
			commentElem.parentNode.setAttribute("colspan", "2");
			var td= document.createElement("td");
			td.appendChild(createCommentTemplateLinks());
			commentElem.parentNode.parentNode.insertBefore(td, commentElem.parentNode.nextSibling);
		}
		
	    
//	    // Move "Possible Duplicates" before "Summary":
//		var possible_duplicates_containerElem= document.getElementById("possible_duplicates_container");
//		if (possible_duplicates_containerElem) {
//    		summaryTr.parentNode.insertBefore(possible_duplicates_containerElem, summaryTr);
//		}
	    
//	    // Move "Possible Duplicates" to the right of the "Description":
//		var possible_duplicates_containerElem= document.getElementById("possible_duplicates_container");
//		var commentElem= document.getElementById("comment");
//		if (possible_duplicates_containerElem && commentElem) {
//    		possible_duplicates_containerElem.setAttribute("style", "display: inline;");
//		    
//		    var tableElem= document.createElement("table");
//    		tableElem.setAttribute("style", "display: inline;");
//		    tableElem.appendChild(possible_duplicates_containerElem)
//		    
//		    possible_duplicates_containerElem.removeChild(possible_duplicates_containerElem.firstElementChild);
//		    commentElem.parentNode.removeChild(commentElem.parentNode.getElementsByTagName("br")[0]);
//    		commentElem.parentNode.appendChild(tableElem);
//		}
		
		// Add bug categories choosers:
		var tr= document.createElement("tr");
		tr.appendChild(document.createElement("th"));
		var td= document.createElement("td");
		td.setAttribute("colspan", "3");
		td.appendChild(createCategoryChoosers());
		tr.appendChild(td);
		
		summaryTr.parentNode.insertBefore(tr, summaryTr);
    }
    
	var ccElems= document.getElementsByName("cc");
	if (ccElems.length > 0) {
	    var ccElem= ccElems[0];
	    // Add shortcut cc links:
	    for (var i= 0; i < ccs.length; i= i+2) {
            addCcLink(ccs[i], ccs[i + 1], ccElem.parentNode, "cc");
        }
        // inserted cc links should not wrap:
        ccElem.parentNode.setAttribute("style", "white-space:nowrap;");
        // fix width: (default is 100%, which would make the CC links overflow into flags table)
        ccElem.setAttribute("style", "width: 300px");
	}
}


function process_query() {
	var myMail;

	// Loop over <a>s:
	var anchors= document.getElementsByTagName("a");
	for (var i= 0; i < anchors.length; i++) {
	    var aElem= anchors[i];
	    var aElemHref= aElem.getAttribute("href");
	    if (!aElemHref)
	        continue;
	        
	    if (aElemHref == "index.cgi?logout=1") {
	        myMail= aElem.nextSibling.textContent.trim();
	    }
    }
    
//    // Fix "'Edit Search' on bug list does not fill in 'Comment' field": https://bugs.eclipse.org/bugs/show_bug.cgi?id=288654
//    var longdescRegex= /.*&longdesc=([^\&]+)&.*/;
//    if (location.search.match(longdescRegex)) {
//	    var match= window.location.search.replace(longdescRegex, "$1");
//	    var longdescElem= document.getElementById("longdesc");
//	    longdescElem.value= decodeURIComponent(match);
//	}
	
//	// Use GET for search, not POST (makes queries bookmarkable, avoids "do you want to resend?" messages, may fail for complex queries):
//	var queryformElem= document.getElementsByName("queryform");
//	if (queryformElem.length > 0) {
//	    queryformElem[0].method= "get";
//	}

	// Add "Generate Report" button to Search page:
	var searchElem= document.getElementById("Search");
	if (searchElem) {
		var generateElem= document.createElement("input");
		generateElem.value= "Generate Report";
		generateElem.type= "submit";
		generateElem.style.marginLeft = "2em";
		generateElem.setAttribute("onclick", ""
			+ "var formElem= document.forms['queryform'];"
			+ "var input= document.createElement('input');"
			+ "input.type= 'hidden';"
			+ "input.name= 'x_axis_field';"
			+ "input.value= 'product';"
			+ "formElem.appendChild(input);"
			
			+ "input= document.createElement('input');"
			+ "input.type= 'hidden';"
			+ "input.name= 'y_axis_field';"
			+ "input.value= 'component';"
			+ "formElem.appendChild(input);"
			
			+ "input= document.createElement('input');"
			+ "input.type= 'hidden';"
			+ "input.name= 'query_format';"
			+ "input.value= 'report-table';"
			+ "formElem.appendChild(input);"
			
			+ "input= document.createElement('input');"
			+ "input.type= 'hidden';"
			+ "input.name= 'format';"
			+ "input.value= 'table';"
			+ "formElem.appendChild(input);"
			
			+ "input= document.createElement('input');"
			+ "input.type= 'hidden';"
			+ "input.name= 'action';"
			+ "input.value= 'wrap';"
			+ "formElem.appendChild(input);"
			
			+ "formElem.action= 'report.cgi';"
			+ "return true;");
		
		searchElem.parentNode.appendChild(generateElem);
	}

	
    // Remove spam headers:
    var search_helpElem= document.getElementById("search_help");
    if (search_helpElem) {
        search_helpElem.parentNode.removeChild(search_helpElem);
    }
    var titlesElem= document.getElementById("titles");
    if (titlesElem) {
        titlesElem.parentNode.removeChild(titlesElem);
    }
    
    // Reduce tabs size:
    var tabsElems= document.getElementsByClassName("tabs");
    if (tabsElems.length > 0) {
        tabsElems[0].setAttribute("cellpadding", "3");
    }
    
    // Remove section headers and expand contents:
    var bz_section_titleElems= document.evaluate("//div[@class='bz_section_title']", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < bz_section_titleElems.snapshotLength; i++) {
        var bz_section_titleElem= bz_section_titleElems.snapshotItem(i);
        bz_section_titleElem.parentNode.replaceChild(document.createElement("hr"), bz_section_titleElem);
    }
    
    var bz_search_sectionElems= document.evaluate("//div[contains(@class,'bz_search_section')] | //ul[contains(@class,'bz_search_section')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < bz_search_sectionElems.snapshotLength; i++) {
        var bz_search_sectionElem= bz_search_sectionElems.snapshotItem(i);
        bz_search_sectionElem.setAttribute("style", "display: block ! important;");
    }
    
	// Add bug categories choosers:
	var Search_topElem= document.getElementById("Search_top");
	if (Search_topElem) {
	    var choosers= createCategoryChoosers();
	    choosers.style.paddingLeft = "1em";
	    Search_topElem.parentNode.insertBefore(choosers, Search_topElem.nextElementSibling);
	}

	// Add target milestone links:
	var targetElem= document.getElementById("field_label_target_milestone");
	if (targetElem && isBugsEclipseOrg) {
//		targetElem.firstElementChild.firstElementChild.textContent = "Target M:";
		var targetLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(targetElem, "target_milestone");
		for (var i= 0; i < target_milestones.length; i++) {
			addTargetLink(targetLinkSpanElem, target_milestones[i]);
		}
		addTargetLink(targetLinkSpanElem, "---");
		
		var sep= targetLinkSpanElem.childNodes[6];
		if (sep) {
		    targetLinkSpanElem.replaceChild(document.createElement("br"), sep);
		}
	}
	
	// Add quick classification links:
	var classificationElem= document.getElementById("field_label_classification");
	if (classificationElem && isBugsEclipseOrg) {
		var classificationLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(classificationElem, "classification");
		for (var i= 0; i < queryClassifications.length; i= i+3) {
            addQueryClassificationsLink(classificationLinkSpanElem, queryClassifications[i+1], queryClassifications[i+2], queryClassifications[i]);
        }
	}
	
	// Add quick product links:
	var productElem= document.getElementById("field_label_product");
	if (productElem && isBugsEclipseOrg) {
		var productLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(productElem, "product");
		for (var i= 0; i < queryProducts.length; i= i+3) {
            addQueryProductsLink(productLinkSpanElem, queryProducts[i+1], queryProducts[i+2], queryProducts[i]);
        }
	}
	
	// Add quick component links:
	var componentElem= document.getElementById("field_label_component");
	if (componentElem && isBugsEclipseOrg) {
		var componentLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(componentElem, "component");
		for (var i= 0; i < queryComponents.length; i= i+2) {
            addQueryComponentsLink(componentLinkSpanElem, queryComponents[i+1], queryComponents[i]);
        }
	}
	
	// Add open/closed links:
	var bug_statusElem= document.getElementById("field_label_bug_status");
	if (bug_statusElem) {
		var statusLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(bug_statusElem, "bug_status");
		addQueryStatusesLink(statusLinkSpanElem, new Array("UNCONFIRMED", "NEW", "ASSIGNED", "REOPENED"), " Open");
		statusLinkSpanElem.appendChild(document.createTextNode(" "));
		addQueryStatusesLink(statusLinkSpanElem, new Array("RESOLVED", "VERIFIED", "CLOSED"), "Closed");
	}
	
	// Add "Resolution: not FIXED" link:
	var resolutionElem= document.getElementById("field_label_resolution");
	if (resolutionElem) {
		var resolutionLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(resolutionElem, "resolution");
		
	    var href= 'javascript:'
	          + '    var resolutionOptions= document.getElementById("resolution").options;'
              + 'for (var i = 0; i < resolutionOptions.length; i++) {'
              + '    if (resolutionOptions[i].text != "FIXED") resolutionOptions[i].selected= true;'
              + '};'
	          + 'void(0);';
	    addLink("&not;FIXED", href, resolutionLinkSpanElem, null, false);
	}
	
	// Add quick links to detailed bug info fields:
	var versionElem= document.getElementById("field_label_version");
	if (versionElem) {
		var versionLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(versionElem, "version");
		for (var i= 0; i < queryVersions.length; i++) {
    		addQueryVersionsLink(versionLinkSpanElem, queryVersions[i]);
        }
    }
	var bug_severityElem= document.getElementById("field_label_bug_severity");
	if (bug_severityElem) {
		createFieldLabelClearAndQuickLinkSpan(bug_severityElem, "bug_severity");
    }
	var priorityElem= document.getElementById("field_label_priority");
	if (priorityElem) {
		createFieldLabelClearAndQuickLinkSpan(priorityElem, "priority");
    }
	var rep_platformElem= document.getElementById("field_label_rep_platform");
	if (rep_platformElem) {
		createFieldLabelClearAndQuickLinkSpan(rep_platformElem, "rep_platform");
    }
	var op_sysElem= document.getElementById("field_label_op_sys");
	if (op_sysElem) {
		var op_sysLinkSpanElem= createFieldLabelClearAndQuickLinkSpan(op_sysElem, "op_sys");
		addQueryOSLink(op_sysLinkSpanElem, new Array("Mac OS X"), "Mac");
		addQueryOSLink(op_sysLinkSpanElem, new Array("AIX", "HP-UX", "Linux", "Solaris", "Unix"), "*nix");
		addQueryOSLink(op_sysLinkSpanElem, new Array("Windows"), "W");
    }
	
	
	// Increase option list sizes to avoid scrolling (these are probably not used any more):
	setOptionSize("classification", 6);
	setOptionSize("product", 6);
	setOptionSize("component", 6);
	setOptionSize("version", 6);
	setOptionSize("target_milestone", 6);
	
	setOptionSize("bug_status", 8);
	setOptionSize("resolution", 8);
	setOptionSize("bug_severity", 8);
	setOptionSize("priority", 8);
	setOptionSize("rep_platform", 8);
	setOptionSize("op_sys", 8);
	
	setOptionSize("chfield", 5);
	
    // Add shortcut email links:
	addSearch_email_fieldsLinks("email1", myMail);
	addSearch_email_fieldsLinks("email2", myMail);
	addSearch_email_fieldsLinks("email3", myMail);

    // Fix layout of date fields:
    var history_filter_sectionElem= document.getElementById("history_filter_section");
    if (history_filter_sectionElem) {
        history_filter_sectionElem.lastElementChild.setAttribute("style", "width: auto");
    }
    
    // Fix label height:
    styleElem.innerHTML= styleElem.innerHTML
        + ".field_label { line-height: 1.3em ! important; }\n"
        + ".search_field_row { line-height: auto ! important; }\n";

	// Add accesskeys:
	// ("c" is broken in Bugzilla, see https://bugzilla.mozilla.org/show_bug.cgi?id=1299141 )
	setAccessKey("target_milestone", "g");
	setAccessKey("chfieldfrom", "b");
	setAccessKey("Search_top", "q");
	
	// Add tooltip for shortcut for "Search" buttons:
	if (searchElem) {
		searchElem.setAttribute("title", "[Accesskey+Q]");
	}
	var Search_topElem= document.getElementById("Search_top");
	if (Search_topElem) {
		Search_topElem.setAttribute("title", "[Accesskey+Q]");
		//addSaveShortcutCtrlS("queryform");
	}
}
	

function process_buglist() {
    // Add access key to Edit Query:
    var bz_query_editElems= document.getElementsByClassName("bz_query_edit");
	if (bz_query_editElems.length > 0) {
	    var bz_query_editElem= bz_query_editElems[0];
	    var aElem= bz_query_editElem.childNodes[1];
		aElem.setAttribute("accesskey", "e");
		aElem.firstChild.replaceData(0, 1, "");
		var mnemonic= document.createElement("b");
		mnemonic.appendChild(document.createTextNode("E"));
		aElem.insertBefore(mnemonic, aElem.firstChild);
		
	}

	// Add target milestone links (for "Change Several Bugs at Once"):
	var targetElem= document.getElementById("target_milestone");
	if (targetElem && isBugsEclipseOrg) {
		var targetLinkSpanElem= document.createElement("span");
		targetLinkSpanElem.style.marginLeft= ".5em";
		targetLinkSpanElem.style.fontWeight= "normal";
		targetElem.parentNode.appendChild(targetLinkSpanElem);
		for (var i= 0; i < target_milestones.length; i++) {
			addTargetLink(targetLinkSpanElem, target_milestones[i]);
		}
		addTargetLink(targetLinkSpanElem, "---");
	}
    
    // Turn bug link into short link:
    if (isBugsEclipseOrg) {
        var bz_id_columnElems= document.getElementsByClassName("bz_id_column");
        for (var i = 0; i < bz_id_columnElems.length; i++) {
            var aElem= bz_id_columnElems[i].firstElementChild;
            aElem.href= "../" + aElem.textContent;
        }
    }
    
    // Add "Create buglist" functionality in "Change Several Bugs at Once" form:
    var check_allElems= document.getElementsByName("check_all");
    if (check_allElems && check_allElems[0]) {
        var lastElem= check_allElems[0];
        
        var spaceElem= document.createTextNode("\n");
        lastElem.parentNode.insertBefore(spaceElem, lastElem.nextSibling);
        lastElem= spaceElem;
        
        var invertElem= document.createElement("input");
        invertElem.type= "button";
        invertElem.value= "Invert";
        invertElem.name= "check_invert";
        invertElem.setAttribute("onclick", "javascript:"
            + "var inputs= document.getElementsByTagName('input');\n"
            + "for (var i= 0; i < inputs.length; i++) {\n"
            + "    if (inputs[i].type === 'checkbox' && inputs[i].name.substr(0, 3) == 'id_') {\n"
            + "        inputs[i].checked= !inputs[i].checked == true;\n"
            + "    }\n"
            + "}\n"
            + "void(0);");
        lastElem.parentNode.insertBefore(invertElem, lastElem.nextSibling);
        lastElem= invertElem;
        
        spaceElem= document.createTextNode("\n");
        lastElem.parentNode.insertBefore(spaceElem, lastElem.nextSibling);
        lastElem= spaceElem;
        
        var updateElem= document.createElement("a");
        updateElem.innerHTML= "Update buglist link (checked bugs) -&gt;";
        updateElem.href= "javascript:void(0);";
        updateElem.setAttribute("onclick", "updateBuglistLink();");
        
        lastElem.parentNode.insertBefore(updateElem, lastElem.nextSibling);
        lastElem= updateElem;
        
        spaceElem= document.createTextNode("\n");
        lastElem.parentNode.insertBefore(spaceElem, lastElem.nextSibling);
        lastElem= spaceElem;
        
        var buglistLinkElem= document.createElement("input");
        buglistLinkElem.type= "text";
        buglistLinkElem.size= 100;
        buglistLinkElem.style= "width: auto";
        buglistLinkElem.id= "buglistLink";
        
        lastElem.parentNode.insertBefore(buglistLinkElem, lastElem.nextSibling);
        
		var scriptElem= createScript(
		    "function updateBuglistLink(init) {\n"
	            + "var inputs= document.getElementsByTagName('input');\n"
	            + "var bugs= '';\n"
	            + "for (var i= 0; i < inputs.length; i++) {\n"
	            + "  var input= inputs[i];\n"
	            + "  if (input.type == 'checkbox' && input.name.substr(0, 3) == 'id_' && (init || input.checked)) {\n"
	            + "    bugs += input.name.substr(3) + ',';\n"
	            + "  }\n"
	            + "}\n"
	            + "var buglistLinkElem= document.getElementById('buglistLink');\n"
	            + "buglistLinkElem.value= 'https://bugs.eclipse.org/bugs/buglist.cgi?bug_id=' + bugs;\n"
	            + "if (!init) {\n"
	            + "  buglistLinkElem.select();\n"
	            + "}\n"
	            + "void(0);\n"
		    + "}\n"
		    + "updateBuglistLink(true);\n"
		);
        lastElem.parentNode.appendChild(scriptElem);
    }
}

function process_result_pages() {
	var bugId;
	var myMail;

	// Rewrite header for direct copy/paste as CVS comment ("Bug xxx: Summary"):
	var titleElem= document.getElementById("title");
	if (titleElem) {
	    var changeformElem= document.getElementById("changeform");
		if (changeformElem) {
		    bugId= changeformElem.elements["id"].value;
		    var short_desc_nonedit_displayElem= document.getElementById("short_desc_nonedit_display");
		    if (short_desc_nonedit_displayElem) {
                // Render bug link as short link:
			    var bugLink= document.createElement("a");
			    bugLink.href= (isBugsEclipseOrg ? "../" : "show_bug.cgi?id=") + bugId;
			    bugLink.appendChild(document.createTextNode("Bug " + bugId));
			    
			    var bugElem= document.createElement("p");
			    bugElem.appendChild(bugLink);
			    bugElem.appendChild(document.createTextNode(": " + short_desc_nonedit_displayElem.textContent));

				if (titleElem.firstElementChild) { // Bugzilla < 5.0
					titleElem.replaceChild(bugElem, titleElem.firstElementChild);
				} else {
					titleElem.replaceChild(bugElem, titleElem.firstChild);
				}
				
				// emergency workaround for Bug 508888: Bugzilla page rendering is broken
				if (headElem) {
					var titleTag= document.getElementsByTagName("title")[0];
					if (titleTag && titleTag.textContent == "") {
						titleTag.textContent= "Bug " + bugId + " - " + short_desc_nonedit_displayElem.textContent;
					}
				}

			    
			    // Hack to stitch header to top, so that it is also visible when scrolled down:
			    //     Better solution would be to use absolute positioning and only have a scroll-y on the bugzilla-body div:
			    //     http://blog.stevensanderson.com/2011/10/05/full-height-app-layouts-a-css-trick-to-make-it-easier/
			    var tableElem= document.getElementById("titles");
			    tableElem.setAttribute("style", "position:fixed; top:0px; left:0px; right:0px; z-index:1000;");
			    // leave some space behind the fixed table:
			    var spacerElem= document.createElement("div");
			    spacerElem.appendChild(document.createTextNode("..."));
			    tableElem.parentNode.insertBefore(spacerElem, tableElem);
			    
			    var subtitleElem= document.getElementById("subtitle");
			    if (subtitleElem) {
				    subtitleElem.textContent= "";
				    
					// Add a convenient Commit button to the fixed header:
					var commitElem= document.createElement("button");
					commitElem.setAttribute("type", "submit");
					commitElem.setAttribute("class", "knob-buttons");
					commitElem.setAttribute("style", "margin: -3px 14px");
					commitElem.setAttribute("form", "changeform");
					setCommitElemNameTitleShortcut(commitElem);
					var tdElem= document.createElement("td");
					tdElem.appendChild(commitElem);
					subtitleElem.parentNode.insertBefore(tdElem, null);
				}
				
				// Fix vscroll when jumping to hash locations (accommodate for fixed header table):
				var bodyElem= document.getElementsByTagName("body")[0];
				if (headElem && bodyElem) {
					var scriptElem= createScript(
					    "function locationHashChanged() {\n"
					    + "  var off= - document.getElementById('titles').offsetHeight - 3;\n"
					    + "  console.log(off);\n"
					    + "  window.scrollBy(0, off);\n"
					    + "}\n"
					);
					headElem.appendChild(scriptElem);
					bodyElem.setAttribute("onhashchange", "locationHashChanged();");
					//TODO: Maybe the pageshow event would also work if the location hash did not change (e.g. on second click to hash link):
					// http://www.whatwg.org/specs/web-apps/current-work/multipage/history.html#event-pageshow
				}
			}
			
			// Add bug categories choosers:
			var short_descElem= document.getElementById("short_desc");
			if (short_descElem) {
	            // Insert before summary:
//	            var short_desc_divElem= short_descElem.parentNode.parentNode.parentNode.parentNode.parentNode;
//	            short_desc_divElem.parentNode.insertBefore(createCategoryChoosers(), short_desc_divElem);
	
	            // Insert after summary:
	            var choosers= createCategoryChoosers();
	            choosers.insertBefore(document.createTextNode(" "), choosers.firstChild);
	            short_descElem.setAttribute("style", "width: 60%;");
	            short_descElem.parentNode.insertBefore(choosers, short_descElem.nextSibling);
	            var summaryElem= document.getElementById("summary");
	            if (summaryElem) {
	                summaryElem.setAttribute("style", "width: 100%;"); // necessary for process_bug.cgi, dont ask...
	                summaryElem.parentNode.parentNode.setAttribute("style", "width: 99%;"); // fix horizonal scrollbars
	            }
	        }
  		}
	}
	
	var confirm_product_changeElem= document.getElementsByName("confirm_product_change")[0];
	if (confirm_product_changeElem) {
		var productElem= document.getElementsByName("product")[0];
		var componentElem= document.getElementsByName("component")[0];
		if (productElem && componentElem) {
			addLink("Descriptions", "https://bugs.eclipse.org/bugs/describecomponents.cgi?product=" + productElem.value,
					componentElem.parentNode.firstElementChild);
		}
	}
	
	headElem.appendChild(
		createScript(
              'function assignTo(email) {\n'
            + 'document.getElementById("assigned_to").value= email;\n'
            + 'document.getElementById("set_default_assignee").checked= false;\n'
            + 'document.getElementById("addselfcc") != null ? document.getElementById("addselfcc").checked= true : "";\n'
            + 'YAHOO.util.Dom.setStyle(document.getElementById("set_default_assignee_label"), "font-weight", "normal");\n'
            + 'document.getElementById("assigned_to").focus();\n'
            + '}\n'
		)
	);

	// Loop over <a>s:
	var anchors= document.getElementsByTagName("a");
	var diffRegex   = /attachment\.cgi\?id=(\d+)&action=diff/;
	var commentIdRegex= /^c(\d+)$/; // c42
	var commentRegex= /^show_bug\.cgi\?id=(\d+)#c(\d+)$/;
	var bugrefRegex = /show_bug\.cgi\?id=(\d+)/;
	var gerritRegex = /https:\/\/git\.eclipse\.org\/r\/(?:#\/c\/)?(\d+(?:\/.*)?)/;
	// https://git.eclipse.org/c/pde/eclipse.pde.ui.git/commit/?id=d609946a67b70c2afbdfe936f9883720e6e2d489
	var gitRegex =    /https:\/\/git\.eclipse\.org\/c\/([^?]+)\.git\/commit\/\?.*id=([0-9a-f]{7})[0-9a-f]+/;
	var lastComment;
	for (var i= 0; i < anchors.length; i++) {
	    var aElem= anchors[i];
	    var aElemHref= aElem.getAttribute("href");
	    if (!aElemHref)
	        continue;
	    
	    // Fix attachment link (revert the new Bugzilla 3.6 "feature" that shows fancy patch viewer but kills copy/paste of patch into Eclipse):
	    if (aElem.name.substr(0, 7) == "attach_" && aElemHref.match(diffRegex)) {
	        aElem.setAttribute("href", aElemHref.replace(diffRegex, "attachment.cgi?id=$1"));
	        
	        // Add [diff] after [details] in attachment references:
	        var diffElem= document.createElement("a");
	        diffElem.textContent= "[diff]";
	        diffElem.href= aElemHref.replace(diffRegex, "attachment.cgi?id=$1&action=diff");
	        aElem.parentNode.appendChild(document.createTextNode(" "));
	        aElem.parentNode.appendChild(diffElem);
	        i+= 2; //skip [details] and new anchor
	    
	    // Change "Comment 42" to ">bug 170000 comment 42<" (simplifies copy/paste of reference):
	    } else if (aElemHref.match(commentRegex) && aElem.parentNode.getAttribute("class") == "bz_comment_number") {
	        aElem.textContent= "comment " + commentIdRegex.exec(aElem.parentNode.parentNode.parentNode.id)[1];
	        
	        var pre= document.createTextNode("bug " + bugId + " ");
	        aElem.parentNode.insertBefore(pre, aElem);
	        lastComment= aElem;
	        
	    // Modifier+click on [-] to toggle wide comments
	    } else if (aElem.getAttribute("class") == "bz_collapse_comment") {
	        var commentId= commentIdRegex.exec(aElem.parentNode.parentNode.parentNode.id)[1];
	        var action=
	              'var modClick= event.shiftKey || event.ctrlKey || event.altKey || event.metaKey || event.button == 1;'
	            + 'if (modClick) {'
	            + '  toggle_wide_comment_display(' + commentId + '); return false;'
	            + '} else {'
	            +   aElem.getAttribute("onclick")
	            + '}'
	            + 'return false;';
	        aElem.setAttribute("onclick", action);
	        aElem.title="Toggle comment display (Modifier+click to toggle wide)";
	    
	    // Remove link in bug header to allow easy copying of bug number:
	    } else if (aElemHref.match(bugrefRegex)) {
	        if (aElem.parentNode.getAttribute("class") == "bz_alias_short_desc_container edit_form") {
	            var pre= document.createTextNode("bug " + bugId);
	            aElem.parentNode.insertBefore(pre, aElem);
	            aElem.parentNode.removeChild(aElem);
	            
	        // Show title of "See Also" bugs:
			} else if (aElem.parentNode.parentNode.parentNode.id == "field_container_see_also"
					&& aElem.getAttribute("class") && aElem.getAttribute("class").includes("bz_bug_link")) {
				var myElem= document.createElement("span");
				myElem.style.marginLeft= "1em";
				myElem.textContent= aElem.title;
				myElem.title= aElem.title;
				aElem.parentNode.insertBefore(myElem, aElem.nextSibling);
            }
        
	    // Turn "Add comment" link into a button:
	    } else if (aElem.parentNode.getAttribute("class") == "bz_add_comment") {
	        var buttonElem= document.createElement("button");
	        buttonElem.setAttribute("onclick", aElem.getAttribute("onclick"));
	        buttonElem.textContent= aElem.textContent + "...";
	        aElem.parentNode.replaceChild(buttonElem, aElem);
	    
	    } else if (aElem.getAttribute("class") == "email" && aElem.firstElementChild) {
	        var email= aElemHref.substr(7);
		    // Add "envelope" mail link, containing "name <email_address>" (e.g. to copy-paste as Git author)
		    var fullElem= aElem.cloneNode();
		    fullElem.innerHTML= "&#x2709;"; //ENVELOPE
		    fullElem.style.textDecoration="none";
	        var fullEmail= aElem.firstElementChild.textContent + " <" + email + ">";
		    fullElem.title= fullEmail;
	        aElem.title= email;
	        fullElem.setAttribute("href", "mailto:" + fullEmail);
	        
		    aElem.parentNode.insertBefore(fullElem, aElem.nextSibling.nextSibling);
		    aElem.parentNode.insertBefore(document.createTextNode(" "), fullElem.nextSibling);
		    
		    i+= 1; // skip new link
		    
		    var nextNode= fullElem.nextElementSibling; // ECA | Friend | null!
		    
			// Add "assign to" link (unless already assigned)
			var assigned_toElem= document.getElementById("assigned_to");
			if (assigned_toElem && assigned_toElem.value != email) {
			    var assignToElem= aElem.cloneNode();
			    assignToElem.innerHTML+= assignToSymbol;
			    assignToElem.style.textDecoration="none";
			    assignToElem.title= "Assign to " + aElem.title;
		        assignToElem.setAttribute("href", getAssigneeLinkScript(email));
		        
			    fullElem.parentNode.insertBefore(assignToElem, nextNode);
			    fullElem.parentNode.insertBefore(document.createTextNode(" "), nextNode);
			    
			    i+= 1; // skip new link
			}
			
			// add link to search for changes by this user in the last week
			var changesElem= addLink(searchSymbol, "buglist.cgi?chfieldfrom=1w"
						 + "&email1=" + email + "&emailassigned_to1=1&emailcc1=1&emaillongdesc1=1&emailqa_contact1=1&emailreporter1=1&emailtype1=exact&order=Last Changed"
					, fullElem.parentNode, "Changes by this user in the last 7 days", false);
			changesElem.setAttribute("style", "text-decoration: none; " + searchSymbolStyle);
			fullElem.parentNode.insertBefore(changesElem, nextNode);
			fullElem.parentNode.insertBefore(document.createTextNode(" "), nextNode);
			i+= 1; // skip new link
		
		// Dim glaring icon for "Bug 429346: Link to editing bugzilla config from bugzilla"
	    } else if (aElemHref == "https://dev.eclipse.org/committers/bugs/bugz_manager.php") {
	        aElem.setAttribute("class", "cla_dec");
	    
	    // Store user's email address
	    } else if (aElemHref == "index.cgi?logout=1") {
	        myMail= aElem.nextSibling.textContent.trim();
	    
	    // Add accesskey
	    } else if (aElem.textContent == "Expand All Comments") {
	        aElem.innerHTML= "E<b>x</b>pand All Comments";
	        aElem.setAttribute("accesskey", "x");
		
		// Improve link rendering for https://bugs.eclipse.org/434841#c37
		} else if (aElem.textContent.match(/\s*Gerrit Change\s*/) && aElemHref.match(gerritRegex)) {
			var changeId= gerritRegex.exec(aElemHref)[1];
			aElem.textContent = "r/" + changeId;
			
			// Lazily load/append Gerrit status:
			// can't use XMLHttpRequest due to Cross-Origin Request blocking (Same Origin Policy)
			if (typeof GM_xmlhttpRequest !== "undefined") {
				GM_xmlhttpRequest({
					method: "GET",
					url: "https://git.eclipse.org/r/changes/" + changeId + "?o=DETAILED_ACCOUNTS",
					onload: getAppendGerritStatusFunction(aElem)
				});
			}
			
		} else if (aElem.textContent.match(/\s*Git Commit\s*/) && aElemHref.match(gitRegex)) {
			var match= gitRegex.exec(aElemHref);
			aElem.textContent = match[2];
			
			var label= document.createElement("span");
			label.style.marginLeft= "1.5em";
			label.textContent= "(" + match[1] + ")";
			aElem.parentNode.insertBefore(label, aElem.nextSibling);
		
		// Show resolved bugs in dependency tree:
		} else if (aElemHref.match(/showdependencytree\.cgi\?id=\d+&hide_resolved=1/)) {
			aElem.setAttribute("href", aElemHref.substr(0, aElemHref.length - 1) + "0");
		
	    } else if (document.getElementById("product") && document.getElementById("component")) { // e.g. not in attachment.cgi?id=*&action=edit
		    // Add "Clone This Bug (in <originating project>)":
		    if (aElem.textContent == "Clone This Bug") {
			    var cloneElem= aElem.cloneNode();
			    var product= document.getElementById("product").value;
			    cloneElem.textContent= "(in " + product + ")";
			    cloneElem.href= aElem.href + "&product=" + product;
			    aElem.parentNode.insertBefore(cloneElem, aElem.nextSibling);
			    aElem.parentNode.insertBefore(document.createTextNode(" "), cloneElem);
		        
		    // Add "New (in <originating project>)":
		    } else if (aElemHref == "enter_bug.cgi") {
			    var cloneElem= aElem.cloneNode();
			    var component= document.getElementById("component").value;
			    var product= document.getElementById("product").value;
			    cloneElem.textContent= "(in " + product + "/" + component + ")";
			    cloneElem.href= aElem.href + "?product=" + product + "&component=" + component;
			    aElem.parentNode.insertBefore(cloneElem, aElem.nextSibling);
			    aElem.parentNode.insertBefore(document.createTextNode(" "), cloneElem);
		    }
		// insert more general stuff further up (not here; previous "else if" was pretty broad...)
		}
	    
	//    // Show obsolete attachments initially:
	//    if (aElem.getAttribute("onclick") == "return toggle_display(this);") {
	//        aElem.setAttribute("name", "toggle_display"); // have to give this a name so we can refer to it from the embedded script afterwards
	//        var scriptElem= document.createElement("script");
	//        scriptElem.type="text/javascript";
	//        scriptElem.innerHTML= 'toggle_display(document.anchors["toggle_display"]);';
	//        aElem.parentNode.insertBefore(scriptElem, aElem.nextSibling)
	//    }
	}

	// add "Jump to my last comment" and "Jump to last comment and Reload" links in header:
	if (lastComment) {
		var header_addl_infoElems= document.getElementsByClassName("header_addl_info");
		if (header_addl_infoElems[0]) {
			// original text: Last modified: 2015-11-09 11:15:40 CET
			var newHTML= '<a href="#">Top</a> '
					+ '(<a href="javascript:scroll_to_my_last_comment();void(0);" title="Jump to my last comment">My</a>) '
					+ '<a href="' + lastComment.href + '" title="Jump to last comment">Last</a> '
					+ '<a href="javascript:'
					+ 'window.location.href=\'' + lastComment.href
					+ '\';window.location.reload(false);void(0);" title="Jump to last comment and Reload">modified &#x1F503;</a>'
					+ header_addl_infoElems[0].innerHTML.substr(13);
			header_addl_infoElems[0].innerHTML= newHTML;
		}
	}
	
	// Edit summary:
	if (!hideElem("summary_alias_container")) { // Bugzilla < 5.0
		hideElem("summary_container");
	}
	if (!showElem("summary_alias_input")) { // Bugzilla < 5.0
		showElem("summary_input");
	}
	
	// Move alias field to bug id line:
	var aliasElem= document.getElementById("alias");
	var summary_alias_inputElem= document.getElementById("summary_alias_input");
	if (aliasElem && summary_alias_inputElem) {
		var aliasTrElem= aliasElem.parentNode.parentNode;
		var spacer= document.createTextNode(" ");
		summary_alias_inputElem.parentNode.insertBefore(spacer, summary_alias_inputElem.previousElementSibling);
		var table= document.createElement("table");
		table.setAttribute("style", "display: inline; vertical-align: -5px");
		table.appendChild(aliasTrElem);
		summary_alias_inputElem.parentNode.insertBefore(table, summary_alias_inputElem.previousElementSibling);
	}
	
	// Edit CC list (already badly hacked on bugs.eclipse.org, see https://bugs.eclipse.org/bugs/show_bug.cgi?id=334083 ):
	hideElem("cc_edit_area_showhide_container");
	var cc_edit_areaElem= showElem("cc_edit_area");
	if (cc_edit_areaElem) {
		cc_edit_areaElem.removeChild(cc_edit_areaElem.getElementsByTagName("br")[0]);
	}
	
	setOptionSize("cc", 8);
	
	// Add shortcut cc links:
	   // ... with auto-complete:
	var newcc_autocompleteElem= document.getElementById("newcc_autocomplete");
	if (newcc_autocompleteElem) {
	    var addDiv= newcc_autocompleteElem.parentNode.firstElementChild;
	    for (var i= 0; i < ccs.length; i= i+2) {
            addCcLink(ccs[i], ccs[i + 1], addDiv, "newcc");
        }
	}
	
	   // ... without auto-complete (https://bugs.eclipse.org/386744):
	var newccElem= document.getElementById("newcc");
	if (newccElem) {
	    var addDiv= newccElem.parentNode.firstElementChild;
	    for (var i= 0; i < ccs.length; i= i+2) {
            addCcLink(ccs[i], ccs[i + 1], addDiv, "newcc");
        }
        
		var ccElem= document.getElementById("cc");
		if (ccElem) {
			// Add "(^ edit)" to CC list:
			var eHref= 'javascript:'
			+ 'var newccElem= document.getElementById("newcc");'
			+ 'var ccElem= document.getElementById("cc");'
			+ 'var ccElems= ccElem.children;'
			+ 'var email= "";'
			+ 'for (var i= 0; i < ccElems.length; i++) {'
			+ '  if (ccElems[i].selected || ccElem.selectedOptions.length == 0) {'
			+ '    if (email.length != 0) {'
			+ '      email += ", ";'
			+ '    }'
			+ '    email += ccElems[i].value;'
			+ '  }'
			+ '}'
			+ 'var endWithComma= newccElem.value.length != 0;'
			+ 'if (endWithComma) {'
			+ '  email += ", ";'
			+ '}'
			+ 'newccElem.value= email + newccElem.value;'
			+ 'newccElem.focus();'
			+ 'newccElem.selectionStart= 0;'
			+ 'newccElem.selectionEnd= email.length - (endWithComma ? 2 : 0);'
			+ 'void(0);';
			
			var eLinkElem= document.createElement("a");
			eLinkElem.href= eHref;
			eLinkElem.style= "vertical-align:top";
			eLinkElem.innerHTML= "(^ edit)";
			eLinkElem.title= "Copy selected CCs to editable/copyable field";
			ccElem.parentNode.insertBefore(eLinkElem, ccElem.nextElementSibling);
			
			var spaceElem= document.createTextNode(" ");
			ccElem.parentNode.insertBefore(spaceElem, eLinkElem.nextSibling);
			
			// Add "Assign to selected CC" to CC list:
			var aHref= 'javascript:'
			+ 'var ccElem= document.getElementById("cc");'
			+ 'var ccElems= ccElem.children;'
			+ 'var email;'
			+ 'for (var i= 0; i < ccElems.length; i++) {'
			+ '  if (ccElems[i].selected || ccElem.selectedOptions.length == 0) {'
			+ '    email = ccElems[i].value;'
			+ '    break;'
			+ '  }'
			+ '}'
			+ 'if (email) {'
			+ '  assignTo(email);'
			+ '}'
			+ 'void(0);';
			
			var aLinkElem= document.createElement("a");
			aLinkElem.href= aHref;
			aLinkElem.style= "vertical-align:top";
			aLinkElem.innerHTML= assignToSymbol;
			aLinkElem.style.textDecoration="none";
			aLinkElem.title= "Assign to selected CC";
			ccElem.parentNode.insertBefore(aLinkElem, spaceElem.nextElementSibling);
		}
	}
	
	// Edit see_also:
	hideElem("container_showhide_see_also");
	showElem("container_see_also");
	
	// Edit & rearrange Assignee & QA:
	fixCheckboxField("bz_assignee_edit_container", "bz_assignee_input", "Default Ass.");
	fixCheckboxField("bz_qa_contact_edit_container", "bz_qa_contact_input", "Default QA");
	
	var set_default_assigneeElem= document.getElementById("set_default_assignee");
	if (set_default_assigneeElem) {
		set_default_assigneeElem.setAttribute("onclick", addOldAssigneeAsCcScript);
	}

    // Fix Product & Component (lose focus on change):
	var classificationElem= document.getElementById("classification");
	var productElem= document.getElementById("product");
	var componentElem= document.getElementById("component");
	if (classificationElem && productElem) {
	    productElem.setAttribute("onchange", "window.setTimeout(function() {"
	                + "document.getElementById('product').focus();"
	                + 'document.getElementById("addselfcc") != null ? document.getElementById("addselfcc").checked= true : "";'
                    + "}, 10)"
	                );
	    
		var productsLinkSpanElem= document.createElement("span");
		productsLinkSpanElem.style.marginLeft= "1em";
		productElem.parentNode.insertBefore(productsLinkSpanElem, productElem.nextSibling);
		if (isBugsEclipseOrg) {
			// Add shortcuts to set Product:
			for (var i= 0; i < moveProducts.length; i++) {
				addProductLink(moveProducts[i], productsLinkSpanElem);
			}
			productsLinkSpanElem.appendChild(document.createTextNode(" | "));
		} else {
			productsLinkSpanElem.appendChild(document.createTextNode(" "));
		}
		// Add shortcut to search Product:
		addLink(searchSymbol, "query.cgi"
							 + "?classification=" + classificationElem.options[classificationElem.selectedIndex].value
							 + "&product=" + productElem.options[productElem.selectedIndex].value
							 , productsLinkSpanElem, "Search in this product", " (").style= searchSymbolStyle;
		addLink("1w", "buglist.cgi"
							 + "?classification=" + classificationElem.options[classificationElem.selectedIndex].value
							 + "&product=" + productElem.options[productElem.selectedIndex].value
							 + "&chfieldfrom=1w"
							 , productsLinkSpanElem, "Changed in the last 7 days");
		productsLinkSpanElem.appendChild(document.createTextNode(")"));
	}
	
	if (classificationElem && productElem && componentElem) {
	    componentElem.setAttribute("onchange", "window.setTimeout(function() {"
	                + "document.getElementById('component').focus();"
	                + 'document.getElementById("addselfcc") != null ? document.getElementById("addselfcc").checked= true : "";'
                    + "}, 10)"
	                );
	    
		var componentsLinkSpanElem= document.createElement("span");
		componentsLinkSpanElem.style.marginLeft= "1em";
		componentElem.parentNode.insertBefore(componentsLinkSpanElem, componentElem.nextSibling);
		if (isBugsEclipseOrg) {
			// Add shortcuts to set Component:
			for (var i= 0; i < moveComponents.length; i++) {
				addComponentLink(moveComponents[i], componentsLinkSpanElem);
			}
			componentsLinkSpanElem.appendChild(document.createTextNode(" | "));
		} else {
			componentsLinkSpanElem.appendChild(document.createTextNode(" "));
		}
		// Add shortcut to search Component:
		addLink(searchSymbol, "query.cgi"
							 + "?classification=" + classificationElem.options[classificationElem.selectedIndex].value
							 + "&product=" + productElem.options[productElem.selectedIndex].value
							 + "&component=" + componentElem.options[componentElem.selectedIndex].value
							 , componentsLinkSpanElem, "Search in this component", " (").style= searchSymbolStyle;
		addLink("1w", "buglist.cgi"
							 + "?classification=" + classificationElem.options[classificationElem.selectedIndex].value
							 + "&product=" + productElem.options[productElem.selectedIndex].value
							 + "&component=" + componentElem.options[componentElem.selectedIndex].value
							 + "&chfieldfrom=1w"
							 , componentsLinkSpanElem, "Changed in the last 7 days");
		componentsLinkSpanElem.appendChild(document.createTextNode(")"));
	}
	
	// Copy QA and Assignee to the right (read-only):
	var assigneeCopy, qaCopy;
	var bz_assignee_edit_containerElem= document.getElementById("bz_assignee_edit_container");
	if (bz_assignee_edit_containerElem) {
	    var spans= bz_assignee_edit_containerElem.getElementsByTagName("span");
		for (var i= 0; i < spans.length; i++) {
		    var spanElem= spans[i];
		    if (spanElem.getAttribute("class") == "vcard") {
		        assigneeCopy= spanElem.cloneNode(true);
		    }
		}
	}
	var bz_qa_contact_edit_containerElem= document.getElementById("bz_qa_contact_edit_container");
	if (bz_qa_contact_edit_containerElem) {
	    var spans= bz_qa_contact_edit_containerElem.getElementsByTagName("span");
		for (var i= 0; i < spans.length; i++) {
		    var spanElem= spans[i];
		    if (spanElem.getAttribute("class") == "vcard") {
		        qaCopy= spanElem.cloneNode(true);
		    }
		}
	}
	
    var bz_show_bug_column_2Elem= document.getElementById("bz_show_bug_column_2");
    if (bz_show_bug_column_2Elem) {
        var trs= bz_show_bug_column_2Elem.getElementsByTagName("tr");
	    if (qaCopy) {
	        var qaTr= document.createElement("tr");
	        
	        var qaTdLabel= document.createElement("td");
	        qaTdLabel.setAttribute("class", "field_label");
	        qaTdLabel.innerHTML= "<b>QA Contact</b>:";
	        qaTr.appendChild(qaTdLabel);
	        
	        var qaTdValue= document.createElement("td");
	        qaTdValue.appendChild(qaCopy);
	        qaTr.appendChild(qaTdValue);
	        
	        if (trs.length > 0) {
	            trs[1].parentNode.insertBefore(qaTr, trs[1]);
	        }
	    }
        if (assigneeCopy) {
	        var assigneeTr= document.createElement("tr");
	        
	        var assigneeTdLabel= document.createElement("td");
	        assigneeTdLabel.setAttribute("class", "field_label");
	        assigneeTdLabel.innerHTML= "<b>Assignee</b>:";
	        assigneeTr.appendChild(assigneeTdLabel);
	        
	        var assigneeTdValue= document.createElement("td");
	        assigneeTdValue.appendChild(assigneeCopy);
	        assigneeTr.appendChild(assigneeTdValue);
	        
	        if (trs.length > 0) {
	            trs[1].parentNode.insertBefore(assigneeTr, trs[1]);
	        }
        }
	}
	
	// Add accesskeys:
	setAccessKey("bug_status", "t");
	setAccessKey("resolution", "r");
	setAccessKey("target_milestone", "m");
	
	// Add shortcut target milestone links:
	var targetElem= document.getElementById("target_milestone");
	if (targetElem && isBugsEclipseOrg) {
		var targetLinkSpanElem= document.createElement("span");
		targetLinkSpanElem.style.marginLeft= "1em";
		targetElem.parentNode.insertBefore(targetLinkSpanElem, targetElem.nextSibling);
		for (var i= 0; i < target_milestones.length; i++) {
			addTargetLink(targetLinkSpanElem, target_milestones[i]);
		}
		addTargetLink(targetLinkSpanElem, "---");
	}
	
	// Move Status to right spot:
	var statusElem= document.getElementById("status");
	var bz_assignee_inputElem= document.getElementById("bz_assignee_input");
	if (statusElem && bz_assignee_inputElem) {
		var statusTRElem= statusElem.parentNode.parentNode;
		var bz_assignee_inputTRElem= bz_assignee_inputElem.parentNode.parentNode;
		bz_assignee_inputTRElem.parentNode.insertBefore(statusTRElem, bz_assignee_inputTRElem);
		
		// Add shortcut status links:
		var dup_id_discoverableElem= document.getElementById("dup_id_discoverable");
		var statusLinksDivElem= document.createElement("div");
		dup_id_discoverableElem.parentNode.insertBefore(statusLinksDivElem, dup_id_discoverableElem.nextSibling);
	
		var bug_statusElem= document.getElementById("bug_status");
		if (dup_id_discoverableElem && bug_statusElem) {
		    var firstStatus= bug_statusElem.options[0].value;
		    var secondStatus= bug_statusElem.options[1].value;
		    if ((firstStatus == "NEW" || firstStatus == "ASSIGNED" || firstStatus == "REOPENED") && secondStatus != "RESOLVED") {
			    addStatusLink("NEW", "NEW", "", statusLinksDivElem);
			    addStatusLink("ASSIGNED", "ASSIGNED", "", statusLinksDivElem);
			} else {
			    addStatusLink("REOPENED", "REOPENED", "", statusLinksDivElem);
			    addStatusLink("VERIFIED", "VERIFIED", null, statusLinksDivElem);
			}
		    
		    addStatusLink("FIXED", "RESOLVED", "FIXED", statusLinksDivElem);
		    // Add shortcut target milestone link:
		    for (var i = 0; i < main_target_milestones.length; i++) {
		        var targetLinkSpanElem= document.createElement("span");
		        targetLinkSpanElem.style.marginLeft= ".5em";
		        statusLinksDivElem.appendChild(targetLinkSpanElem);
		        addFixedInTargetLink(targetLinkSpanElem, target_milestones[main_target_milestones[i]]);
		    }
		    
		    addStatusLink("INVALID", "RESOLVED", "INVALID", statusLinksDivElem);
		    addStatusLink("WONTFIX", "RESOLVED", "WONTFIX", statusLinksDivElem);
		    addStatusLink("WORKSFORME", "RESOLVED", "WORKSFORME", statusLinksDivElem);
		    addStatusLink("NOT_ECLIPSE", "RESOLVED", "NOT_ECLIPSE", statusLinksDivElem);
		}
		
	    // Add shortcut assignee links:
	    if (myMail) {
            addAssigneeLink("me", myMail, bz_assignee_inputElem);
        }
	    for (var i= 0; i < assignees.length; i= i+2) {
            addAssigneeLink(assignees[i], assignees[i + 1], bz_assignee_inputElem);
        }
	}
	
	// Add a convenient Commit button:
	var bz_qa_contact_inputElem= document.getElementById("bz_qa_contact_input");
	if (bz_qa_contact_inputElem) {
	    var commitElem= document.createElement("button");
	    commitElem.setAttribute("type", "submit");
		setCommitElemNameTitleShortcut(commitElem);
	    commitElem.style.marginLeft= "1em";
	    bz_qa_contact_inputElem.appendChild(commitElem);
		
		addSaveShortcutCtrlS("changeform");
	}
		
	// Edit attachment details: 
	if (document.getElementById("attachment_information_read_only")) {
        location.assign("javascript:toggle_attachment_details_visibility();void(0)");
    }
	
	// Move "Expand / Collapse All" away to avoid interfering with selections in the comments section:
	var bz_collapse_expand_commentsElems= document.getElementsByClassName("bz_collapse_expand_comments");
	if (bz_collapse_expand_commentsElems.length > 0) {
		var bz_group_visibility_sectionElems= document.getElementsByClassName("bz_group_visibility_section");
		if (bz_group_visibility_sectionElems.length > 0) {
			bz_collapse_expand_commentsElems[0].setAttribute("style", "padding-top: 4em;");
			bz_group_visibility_sectionElems[0].parentNode.appendChild(bz_collapse_expand_commentsElems[0]);
		} else {
			var add_commentElem= document.getElementById("add_comment");
			if (add_commentElem) {
				var tdRightOfadd_commentElem= add_commentElem.parentNode.nextElementSibling;
				var spacer= document.createElement("div");
				spacer.setAttribute("style", "padding-top: 9em");
				tdRightOfadd_commentElem.appendChild(spacer);
				tdRightOfadd_commentElem.appendChild(bz_collapse_expand_commentsElems[0]);
			}
		}
		
		// Add "Collapse All Before My Last" (Alt+Shift+E) and "Jump To My Last" (Alt+Shift+Y)
		var scriptElem= document.createElement("script");
		scriptElem.type= "text/javascript";
		scriptElem.innerHTML=
		  "function collapse_all_comments_before_my_last() {\n" +
			"var comments = YAHOO.util.Dom.getElementsByClassName('bz_comment_text');\n" +
			"var i = comments.length - 1;\n" +
			"var scrollTarget;\n" +
			"for (; i >= 0; i--) {\n" +
			"	var comment = comments[i];\n" +
			"	if (!comment)\n" +
			"		continue;\n" +
			"	\n" +
			"	var emailElems= comment.parentNode.getElementsByClassName('email');\n" +
			"	if (emailElems[emailElems.length - 1].title == '" + myMail + "') {\n" +
			"		scrollTarget= emailElems[emailElems.length - 1];\n" +
			"		i--;\n" +
			"		break;\n" +
			"	};\n" +
			"}\n" +
			"for (; i >= 0; i--) {\n" +
			"	var comment = comments[i];\n" +
			"	if (!comment)\n" +
			"		continue;\n" +
			"	\n" +
			"	var id = comments[i].id.match(/\\d*$/);\n" +
			"	var link = document.getElementById('comment_link_' + id);\n" +
			"	collapse_comment(link, comment);\n" +
			"}\n" +
			"if (scrollTarget) {\n" +
			"	scrollTarget.scrollIntoView(true);\n" +
			"	locationHashChanged();\n" +
			"};\n" +
		  "}\n" +
		  
		  "function scroll_to_my_last_comment() {\n" +
			"var comments = YAHOO.util.Dom.getElementsByClassName('bz_comment');\n" +
			"var i = comments.length - 1;\n" +
			"var scrollTargetId;\n" +
			"for (; i >= 0; i--) {\n" +
			"	var comment = comments[i];\n" +
			"	if (!comment)\n" +
			"		continue;\n" +
			"	\n" +
			"	var emailElems= comment.getElementsByClassName('email');\n" +
			"	if (emailElems[0].title == '" + myMail + "') {\n" +
			"		scrollTargetId= comment.id;\n" +
			"		i--;\n" +
			"		break;\n" +
			"	};\n" +
			"}\n" +
			"if (scrollTargetId) {\n" +
			"	window.location.hash= scrollTargetId;\n" +
			"};\n" +
		  "}\n" +
		  
		// Click "Collapse All Before My Last":
//		      + "collapse_all_comments_before_my_last();\n" // turned out to be inconvenient
		    "";
		headElem.appendChild(scriptElem);

		var aElem= document.createElement("a");
		aElem.href= "javascript:void(0);";
		aElem.innerHTML= "Collaps<b>e</b> All Before My Last";
		aElem.setAttribute("accesskey", "e");
		aElem.setAttribute("onclick","javascript:collapse_all_comments_before_my_last();\nreturn false;");
		
		var liElem= document.createElement("li");
		liElem.appendChild(aElem);
		bz_collapse_expand_commentsElems[0].appendChild(liElem);
		
		liElem.appendChild(document.createTextNode(" ("))
		aElem= document.createElement("a");
		aElem.href= "javascript:void(0);";
		aElem.innerHTML= "Jump To M<b>y</b> Last";
		aElem.setAttribute("accesskey", "y");
		aElem.setAttribute("onclick","javascript:scroll_to_my_last_comment();\nreturn false;");
		liElem.appendChild(aElem);
		liElem.appendChild(document.createTextNode(")"))
		
		
		// Add links to help enter a URL to a Git commit:
		bz_collapse_expand_commentsElems[0].parentNode.appendChild(createCommentTemplateLinks());
	}
	
	// Script for "toggle wide comments":
	var scriptElem= createScript(
		"function toggle_wide_comment_display (comment_id) {\n"+
		"  var comment = document.getElementById('comment_text_' + comment_id);\n" +
		"  var re = new RegExp(/\\bwide\\b/);\n" +
		"  if (comment.className.match(re))\n" +
		"    unwiden_comment(comment);\n" +
		"  else\n" +
		"    widen_comment(comment);\n" +
		"}\n" +
		"function widen_comment(comment) {\n"+
		"    YAHOO.util.Dom.addClass(comment, 'wide');\n"+
		"}\n"+
		"\n"+
		"function unwiden_comment(comment) {\n"+
		"    YAHOO.util.Dom.removeClass(comment, 'wide');\n"+
		"}\n"+
		""
	);
	headElem.appendChild(scriptElem);
	
	// Don't wrap lines that match noWrapLinesRegex: (alternative to bug 446727: Increase line length to 140chars in Bugzilla)
	var bz_comment_textElems= document.getElementsByClassName("bz_comment_text");
	for (var i= 0; i < bz_comment_textElems.length; i++) {
		var childNodesElems= bz_comment_textElems[i].childNodes;
		for (var j= 0; j < childNodesElems.length; j++) {
			var child= childNodesElems[j];
			if (child.nodeType == 3 /*text*/) {
				var split= child.textContent.split(noWrapLinesRegex);
				if (split.length > 1) {
					for (var k= 0; k < split.length; k+= 2) {
						var span= document.createTextNode(split[k]);
						child.parentNode.insertBefore(span, child);
						
						var span= document.createElement("span");
						span.textContent= split[k + 1];
						span.style= "white-space: pre";
						child.parentNode.insertBefore(span, child);
					}
					child.parentNode.removeChild(child);
				}
			}
		}
	}
}

console.log("jdtbugzilla.user.js done.");
} // main()


GM_addStyle(css);
document.addEventListener('DOMContentLoaded', function() {
  //page has been loaded, run DOM interactive parts (aka "@run-at document-end") here:
  main();
}, true);

