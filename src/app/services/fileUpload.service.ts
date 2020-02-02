import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class FileUploadService {
    url = environment.fileUploadURL;

    constructor(private http: HttpClient) { }

    uploadAndReadExcelFile(file): Observable<FileResponse> {
        const formData = new FormData();
        formData.append('file', file);
        return this.http.post<FileResponse>(this.url + "upload", formData);
    }
}