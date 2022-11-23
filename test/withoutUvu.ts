import {getHome} from "../src/index";

getHome().then((res) =>{
  console.log(res);
  console.log(res[1].books);
});
