/**
 * If we dont have bind() in this browser, implement it.
 *
 */
if (!Function.prototype.bind) {
	Function.prototype.bind = function(){  
		var fn = this, args = Array.prototype.slice.call(arguments),
		object = args.shift(); 
		return function(){ 
			return fn.apply(object, 
				args.concat(Array.prototype.slice.call(arguments))
			); 
		};
	};
}

function ucfirst (str) {
	// http://kevin.vanzonneveld.net
	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
	// +   bugfixed by: Onno Marsman
	// +   improved by: Brett Zamir (http://brett-zamir.me)
	// *     example 1: ucfirst('kevin van zonneveld');
	// *     returns 1: 'Kevin van zonneveld'
	str += '';
	var f = str.charAt(0).toUpperCase();
	return f + str.substr(1);
}
function stringUnderscore(str){
	var res = str.replace(/([A-Z])/g, function($1){return "_"+$1.toLowerCase();});
	if(res.substr(0, 1) == '_') {
		res = res.substr(1);
	}
	return res;
}
/**
 * Converts a string from string_with_underscores to StringWithUnderscores.
 * @param string str Underscored string
 * @return string
 */
function camelCase(str) {
	if(typeof str != 'string') {
		return str;
	}
	var parts = str.split('_');
	var res = '';
	$.each(parts, function (index, part) {
		res += ucfirst(part);
	});
	return res;
}
function trim (str, charlist) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: mdsjack (http://www.mdsjack.bo.it)
    // +   improved by: Alexander Ermolaev (http://snippets.dzone.com/user/AlexanderErmolaev)
    // +      input by: Erkekjetter
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: DxGx
    // +   improved by: Steven Levithan (http://blog.stevenlevithan.com)
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // *     example 1: trim('    Kevin van Zonneveld    ');
    // *     returns 1: 'Kevin van Zonneveld'
    // *     example 2: trim('Hello World', 'Hdle');
    // *     returns 2: 'o Wor'
    // *     example 3: trim(16, 1);
    // *     returns 3: 6
    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace = " \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000";
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}
function count (mixed_var, mode) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Waldo Malqui Silva
    // +   bugfixed by: Soren Hansen
    // +      input by: merabi
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Olivier Louvignes (http://mg-crea.com/)
    // *     example 1: count([[0,0],[0,-4]], 'COUNT_RECURSIVE');
    // *     returns 1: 6
    // *     example 2: count({'one' : [1,2,3,4,5]}, 'COUNT_RECURSIVE');
    // *     returns 2: 6
    var key, cnt = 0;

    if (mixed_var === null || typeof mixed_var === 'undefined') {
        return 0;
    } else if (mixed_var.constructor !== Array && mixed_var.constructor !== Object) {
        return 1;
    }

    if (mode === 'COUNT_RECURSIVE') {
        mode = 1;
    }
    if (mode != 1) {
        mode = 0;
    }

    for (key in mixed_var) {
        if (mixed_var.hasOwnProperty(key)) {
            cnt++;
            if (mode == 1 && mixed_var[key] && (mixed_var[key].constructor === Array || mixed_var[key].constructor === Object)) {
                cnt += this.count(mixed_var[key], 1);
            }
        }
    }

    return cnt;
}

function getObjectKeys(obj) {
	var keys = [];
	for(var key in obj) {
		keys.push(key);
	}
	return keys;
}

function getFormValues($form) {
	var paramObj = {};
	$.each($form.serializeArray(), function(_, kv) {
		if (paramObj.hasOwnProperty(kv.name)) {
			paramObj[kv.name] = $.makeArray(paramObj[kv.name]);
			paramObj[kv.name].push(kv.value);
		}
		else {
			paramObj[kv.name] = kv.value;
		}
	});
	return paramObj;
}

/**
 * Function : dump()
 * Arguments: The data - array,hash(associative array),object
 *    The level - OPTIONAL
 * Returns  : The textual representation of the array.
 * This function was inspired by the print_r function of PHP.
 * This will accept some data as the argument and return a
 * text that will be a more readable version of the
 * array/hash/object that is given.
 * Docs: http://www.openjs.com/scripts/others/dump_function_php_print_r.php
 */
function dump(arr,level) {
	var dumped_text = "";
	if(!level) level = 0;
	
	//The padding given at the beginning of the line.
	var level_padding = "";
	for(var j=0;j<level+1;j++) level_padding += "    ";
	
	if(typeof(arr) == 'object') { //Array/Hashes/Objects 
		for(var item in arr) {
			var value = arr[item];
			
			if(typeof(value) == 'object') { //If it is an array,
				dumped_text += level_padding + "'" + item + "' ...\n";
				dumped_text += dump(value,level+1);
			} else {
				dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
			}
		}
	} else { //Stings/Chars/Numbers etc.
		dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
	}
	return dumped_text;
}

function sortSelect($select) {
    var cl = $select.get(0);
    var clTexts = new Array();

    for(i = 2; i < cl.length; i++)
    {
        clTexts[i-2] =
            cl.options[i].text.toUpperCase() + "," +
            cl.options[i].text + "," +
            cl.options[i].value;
    }

    clTexts.sort();

    for(i = 2; i < cl.length; i++)
    {
        var parts = clTexts[i-2].split(',');
        
        cl.options[i].text = parts[1];
        cl.options[i].value = parts[2];
    }
}

function urlencode (str) {
  // http://kevin.vanzonneveld.net
  // +   original by: Philip Peterson
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: AJ
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +      input by: travc
  // +      input by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Lars Fischer
  // +      input by: Ratheous
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: Joris
  // +      reimplemented by: Brett Zamir (http://brett-zamir.me)
  // %          note 1: This reflects PHP 5.3/6.0+ behavior
  // %        note 2: Please be aware that this function expects to encode into UTF-8 encoded strings, as found on
  // %        note 2: pages served as UTF-8
  // *     example 1: urlencode('Kevin van Zonneveld!');
  // *     returns 1: 'Kevin+van+Zonneveld%21'
  // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
  // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
  // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
  // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'
  str = (str + '').toString();

  // Tilde should be allowed unescaped in future versions of PHP (as reflected below), but if you want to reflect current
  // PHP behavior, you would need to add ".replace(/~/g, '%7E');" to the following.
  return encodeURIComponent(str).replace(/!/g, '%21').replace(/'/g, '%27').replace(/\(/g, '%28').
  replace(/\)/g, '%29').replace(/\*/g, '%2A').replace(/%20/g, '+');
}

function http_build_query (formdata, numeric_prefix, arg_separator) {
  // http://kevin.vanzonneveld.net
  // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Legaev Andrey
  // +   improved by: Michael White (http://getsprink.com)
  // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
  // +   improved by: Brett Zamir (http://brett-zamir.me)
  // +    revised by: stag019
  // +   input by: Dreamer
  // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
  // +   bugfixed by: MIO_KODUKI (http://mio-koduki.blogspot.com/)
  // %        note 1: If the value is null, key and value is skipped in http_build_query of PHP. But, phpjs is not.
  // -    depends on: urlencode
  // *     example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
  // *     returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
  // *     example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
  // *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'
  var value, key, tmp = [],
    that = this;

  var _http_build_query_helper = function (key, val, arg_separator) {
    var k, tmp = [];
    if (val === true) {
      val = "1";
    } else if (val === false) {
      val = "0";
    }
    if (val != null) {
      if(typeof(val) === "object") {
        for (k in val) {
          if (val[k] != null) {
            tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
          }
        }
        return tmp.join(arg_separator);
      } else if (typeof(val) !== "function") {
        return that.urlencode(key) + "=" + that.urlencode(val);
      } else {
        throw new Error('There was an error processing for http_build_query().');
      }
    } else {
      return '';
    }
  };

  if (!arg_separator) {
    arg_separator = "&";
  }
  for (key in formdata) {
    value = formdata[key];
    if (numeric_prefix && !isNaN(key)) {
      key = String(numeric_prefix) + key;
    }
    var query=_http_build_query_helper(key, value, arg_separator);
    if(query != '') {
      tmp.push(query);
    }
  }

  return tmp.join(arg_separator);
}

var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4();
  };
})();


if (!window.console) {
	var names = ["log", "debug", "info", "warn", "error",
	"assert", "dir", "dirxml", "group",
	"groupEnd", "time", "timeEnd", "count",
	"trace", "profile", "profileEnd"];

	window.console = {};
	for (var i = 0; i < names.length; ++i)
	window.console[names[i]] = function() {}
}