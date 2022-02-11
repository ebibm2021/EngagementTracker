import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  constructor() { }

  convertFormControlObjectToDataJson(objFormControl){
    let objData = {};
    for (var key in objFormControl) {
      if (objFormControl.hasOwnProperty(key)) {
        objData[key] = objFormControl[key].value;
      }
    }
    return objData;
  }
}
