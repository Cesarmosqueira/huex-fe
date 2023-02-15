import { HttpClient, HttpHeaders } from '@angular/common/http';
import { throwError } from 'rxjs';

export class BaseService {

    protected httpOptions = {
        headers: new HttpHeaders(
            {
                'Content-Type': 'application/json'
            }
        )
    };

    constructor(protected httpClient: HttpClient) { }

    protected handleError(err) {
        let errorMessage = '';
        if (err.error instanceof Error) {
            errorMessage = `Un error ha ocurrido: ${err.error.message}`;
        } else {
            // errorMessage = `Código retornado por el servidor: ${err.status}, el mensaje de error es: ${err.message}`;
            errorMessage = err;
        }
        return throwError(errorMessage);
    }

 }