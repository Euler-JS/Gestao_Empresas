import { Component, OnInit } from '@angular/core';
import { AddDataService } from 'src/app/services/add-data.service';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss'],
})
export class InfoComponent implements OnInit {

  constructor(
    public addDataService: AddDataService
  ) { }

  ngOnInit() {}

}
