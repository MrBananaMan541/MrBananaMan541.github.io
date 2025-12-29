// https://attacomsian.com/blog/javascript-check-variable-is-object
const isObject = obj => {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj)
}

// a private (to this module) helper function
// it will load in a string from localStorage and convert it to a JSON object
// if the string is empty or otherwise not "parseable" an
// empty object - {} - will be returned
const loadJSONFromLocalStorage = (username) => {
  const string = localStorage.getItem(username);
  let json;
  try{
    json = JSON.parse(string);
    if(!json) throw new Error("json is null!");
    if(!isObject(json)) throw new Error("json is not an object!");
  }catch(error){
    console.log(`ERROR: ${error} with string: ${string}`);
    json = {};
  }
  return json;
};

//Add value var as the value of the key var in a temp json object, and then save it to localstorage
//under the given username
export const writeToLocalStorage = (username, key, value) => {
  console.log(`Calling writeToLocalStorage(${key},${value})`);
  const json = loadJSONFromLocalStorage(username);
  json[key] = value;
  localStorage.setItem(username, JSON.stringify(json));
};

// the value of `key` will be returned from localStorage
export const readFromLocalStorage = (username, key) => {
  const json = loadJSONFromLocalStorage(username);
  console.log(`Calling readFromLocalStorage(${key}) with value=${json[key]}`);
  return json[key];
}

//Simple check to see if the user exists or not
export const doesUserExist = (username) => {
  console.log(localStorage.getItem(username));
  if (localStorage.getItem(username)) {
    return true;
  }
  else {
    return false;
  }
}

//Delete the given user from local storage
export const deleteUser = (username) => {
  console.log(`Deleting user: ${username}`);
  localStorage.removeItem(username);
}