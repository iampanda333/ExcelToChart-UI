import { Component } from '@angular/core';
import { FileUploadService } from './services/fileUpload.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  excelFile;
  chart = [];
  validFileType = false;
  formDirty = false;
  errorMessage = '';
  showChart = false;

  constructor(private fileUploadService: FileUploadService) { }

  selectImage(event) {
    this.formDirty = true;
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      if (this.validateFile(file.name)) {
        this.excelFile = file;
        this.validFileType = true;
      } else {
        this.validFileType = false;
      }
    }
  }

  clearFormState() {
    this.validFileType = false;
    this.formDirty = false;
    this.showChart = false;
    this.errorMessage = '';
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'xlsx') {
      return true;
    }
    else {
      return false;
    }
  }

  onSubmit() {
    this.clearFormState();
    this.fileUploadService.uploadAndReadExcelFile(this.excelFile).subscribe(
      (res) => {
        if (res.result.length > 0) {
          this.showChart = true;
          let sprint = res['result'].map((res => res.sprint));
          let expVelocity = res['result'].map((res => res.expVelocity));
          let actVelocity = res['result'].map((res => res.actVelocity));

          this.chart = new Chart('canvas', {
            type: 'line',
            data: {
              labels: sprint,
              datasets: [
                {
                  label: 'Expected Velocity',
                  data: expVelocity,
                  borderColor: '#0033cc',
                  fill: false
                },
                {
                  label: 'Actual Velocity',
                  data: actVelocity,
                  borderColor: '#cc3300',
                  fill: false
                }
              ]
            },
            options: {
              legend: {
                display: true
              },
              scales: {
                xAxes: [{
                  display: true
                }],
                yAxes: [{
                  display: true
                }]
              }
            }
          });
        } else {
          this.chart = [];
          this.errorMessage = 'Chart is not created';
        }
      },
      (err) => {
        if (err['error']['error']) {
          this.errorMessage = err['error']['error'];
        } else {
          this.errorMessage = 'Chart is not created';
        }
      }
    )
  }
}
