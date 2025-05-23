import { AbstractControl } from "@angular/forms";
import { Observable, Observer, of } from "rxjs";

type ErrorType = Observable<{ [key: string]: any; } | null>;

export const mimeType = (
  control: AbstractControl
): ErrorType => {
  if (typeof(control.value) === 'string') {
    return of(null);
  }
  const file = control.value as File;
  const fileReader = new FileReader();

  const frObs = new Observable(
    (observer: Observer<{ [key: string]: any } | null>) => {
      fileReader.addEventListener("loadend", () => {
        const arr = new Uint8Array(fileReader.result as ArrayBuffer).subarray(0, 4);
        let header = "";
        let isValid = false;
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16);
        }
        let mimeType = "";
        switch (header) {
          case "89504e47":
            mimeType = "image/png";
            isValid = true;
            break;
          case "47494638":
            mimeType = "image/gif";
            break;
          case "25504446":
            mimeType = "application/pdf";
            break;
          case "ffd8ffe0":
          case "ffd8ffe1":
          case "ffd8ffe2":
          case "ffd8ffe3":
          case "ffd8ffe8":
            mimeType = "image/jpeg";
            isValid = true;
            break;
          default:
            mimeType = "unknown";
            isValid = false; // Or you can use the blob.type as fallback
            break;
        }
        if (isValid) {
          observer.next(null);
        } else {
          observer.next({ invalidMimeType: true, mimeType });
        }
        observer.complete();
      });
      fileReader.readAsArrayBuffer(file);
    }
  );
  return frObs;
};
