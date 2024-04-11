import { HttpParams } from '@angular/common/http';
import { CustomURLEncoder } from '../../core/services/custom-url-encoder/custom-url-encoder';
import each from 'lodash/each';

export abstract class Api {
  abstract domain: string;

  protected params(object: object): HttpParams {
    let parameters = new HttpParams({
      encoder: new CustomURLEncoder(),
    });
    each(object, (value, key) => {
      if (String(value) !== 'undefined') {
        parameters = parameters.append(key, String(value));
      }
    });
    return parameters;
  }
}
