
export function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

export function objectToQueryString(obj) {
	var str = [];
	for (var p in obj)
	    if (obj.hasOwnProperty(p)) {
	      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
	    }
	return str.join("&");
}

// precisely cut off decimal without rounding it...
export function toFixed2 (num, fixed){
  var re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
  return num.toString().match(re)[0];
}


// utility function for merging array
export function arrayUnique  (array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
} 


export function getRange (upper, lower, steps , precision = 0) {

  const difference = upper - lower ;
  const increment = difference / (steps - 1);
  return [lower, ...Array(steps - 2).fill('').map((_, index) => {
    let val = lower + (increment * (index + 1));

    if(precision){
      let v = toFixed2(val , precision);
      return parseFloat(v);
    }else{
      let v = Math.round((val + Number.EPSILON) * 100) / 100 ;
      return parseInt(v);
    }
  }), upper] ;
}

export function between (x, min, max) {
  return x >= min && x <= max;
}

export function numberWithSpaces(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function decimalWithSpaces(x) {
    var parts = x.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    return parts.join(".");
}

export function authBaseUrl(){
  return process.env.REACT_APP_AUTH_BASE_URL ; // @TODO fix process giving issue
}

export function apiBaseUrl(){
  return process.env.REACT_APP_API_BASE_URL ; // @TODO fix process giving issue
}

export function publicUrl(){
  return process.env.REACT_APP_PUBLIC_URL ; // @TODO fix process giving issue
}


export function bypassAuth(){
  return {
    error: false ,
    user : {
      id: -1 ,
      name : 'generic name' ,
      username : 'generic username' ,
      role : 'generic role'
    },
    accessToken : 'generic access token' , // no need to validate this token on explorer API server
    refreshToken : 'generic refresh token',
    login: true
  }
}